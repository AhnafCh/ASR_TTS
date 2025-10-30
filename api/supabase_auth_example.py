"""
Supabase JWT Verification for FastAPI
Uses asymmetric JWT verification (RS256) - no secret needed!
"""

from fastapi import Depends, HTTPException, status, FastAPI
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from typing import Optional
import httpx
from functools import lru_cache
import os

app = FastAPI()

# Configuration
SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL", "https://eijcnqmuwhpkvnhgrrbr.supabase.co")
JWKS_URL = f"{SUPABASE_URL}/auth/v1/jwks"

security = HTTPBearer()

# Cache JWKS response
_jwks_cache: Optional[dict] = None


async def get_jwks() -> dict:
    """
    Fetch JWKS (JSON Web Key Set) from Supabase.
    The public keys are cached to avoid repeated requests.
    """
    global _jwks_cache
    
    if _jwks_cache is None:
        async with httpx.AsyncClient() as client:
            response = await client.get(JWKS_URL)
            response.raise_for_status()
            _jwks_cache = response.json()
    
    return _jwks_cache


async def verify_supabase_token(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> dict:
    """
    Verify Supabase JWT token using the public key from JWKS endpoint.
    No JWT_SECRET needed - uses asymmetric verification!
    
    Returns:
        dict: JWT payload containing user information
        
    Raises:
        HTTPException: If token is invalid or expired
    """
    token = credentials.credentials
    
    try:
        # Get JWKS (contains public keys)
        jwks = await get_jwks()
        
        # Get the key ID from the token header (unverified)
        unverified_header = jwt.get_unverified_header(token)
        kid = unverified_header.get("kid")
        
        if not kid:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token missing key ID"
            )
        
        # Find the matching public key
        try:
            key = next(k for k in jwks["keys"] if k["kid"] == kid)
        except StopIteration:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Public key not found"
            )
        
        # Verify and decode the token
        payload = jwt.decode(
            token,
            key,
            algorithms=["RS256"],
            audience="authenticated",
            issuer=f"{SUPABASE_URL}/auth/v1",
            options={
                "verify_signature": True,
                "verify_exp": True,
                "verify_aud": True,
                "verify_iss": True,
            }
        )
        
        return payload
        
    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid token: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Token verification failed: {str(e)}"
        )


async def get_current_user(payload: dict = Depends(verify_supabase_token)) -> dict:
    """
    Extract user information from verified JWT payload.
    
    Returns:
        dict: User information including id, email, role
    """
    return {
        "id": payload.get("sub"),  # User ID
        "email": payload.get("email"),
        "role": payload.get("role"),
        "metadata": payload.get("user_metadata", {}),
    }


# Optional: Admin-only dependency
async def require_admin(user: dict = Depends(get_current_user)) -> dict:
    """Ensure user has admin role"""
    if user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return user


# ============================================================================
# EXAMPLE ROUTES
# ============================================================================

@app.get("/")
async def root():
    """Public endpoint - no authentication required"""
    return {"message": "Welcome to the API"}


@app.get("/api/auth/me")
async def get_me(user: dict = Depends(get_current_user)):
    """
    Get current user information.
    Requires valid Supabase JWT token.
    """
    return {
        "user": user,
        "authenticated": True
    }


@app.get("/api/protected/data")
async def get_protected_data(user: dict = Depends(get_current_user)):
    """
    Protected endpoint - requires authentication.
    The JWT is automatically verified using Supabase's public key.
    """
    return {
        "message": "This is protected data",
        "user_id": user["id"],
        "email": user["email"]
    }


@app.post("/api/protected/create")
async def create_item(
    item: dict,
    user: dict = Depends(get_current_user)
):
    """
    Create an item with user ownership.
    """
    return {
        "message": "Item created",
        "item": item,
        "owner_id": user["id"]
    }


@app.get("/api/admin/users")
async def list_users(admin: dict = Depends(require_admin)):
    """
    Admin-only endpoint.
    Requires both authentication and admin role.
    """
    return {
        "message": "Admin endpoint",
        "admin_id": admin["id"]
    }


# ============================================================================
# ALTERNATIVE: Manual Token Verification (without dependency injection)
# ============================================================================

async def verify_token_manual(authorization: str) -> Optional[dict]:
    """
    Manually verify a token from Authorization header.
    Useful for WebSocket connections or custom auth flows.
    
    Args:
        authorization: Authorization header value (e.g., "Bearer token...")
        
    Returns:
        dict | None: User payload if valid, None if invalid
    """
    if not authorization or not authorization.startswith("Bearer "):
        return None
    
    token = authorization.split(" ")[1]
    
    try:
        jwks = await get_jwks()
        unverified_header = jwt.get_unverified_header(token)
        kid = unverified_header.get("kid")
        
        key = next(k for k in jwks["keys"] if k["kid"] == kid)
        
        payload = jwt.decode(
            token,
            key,
            algorithms=["RS256"],
            audience="authenticated",
            issuer=f"{SUPABASE_URL}/auth/v1"
        )
        
        return payload
    except Exception:
        return None


# ============================================================================
# MIDDLEWARE EXAMPLE (Optional - protect all routes)
# ============================================================================

from fastapi import Request
from fastapi.responses import JSONResponse

@app.middleware("http")
async def auth_middleware(request: Request, call_next):
    """
    Optional: Global authentication middleware.
    Protects all routes except those in the exempt list.
    """
    # Routes that don't require authentication
    exempt_paths = ["/", "/docs", "/openapi.json"]
    
    if request.url.path in exempt_paths:
        return await call_next(request)
    
    # Check authorization header
    auth_header = request.headers.get("Authorization")
    
    if not auth_header:
        return JSONResponse(
            status_code=401,
            content={"detail": "Authorization header missing"}
        )
    
    # Verify token
    user = await verify_token_manual(auth_header)
    
    if not user:
        return JSONResponse(
            status_code=401,
            content={"detail": "Invalid or expired token"}
        )
    
    # Attach user to request state
    request.state.user = user
    
    return await call_next(request)


# ============================================================================
# TESTING
# ============================================================================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)


# ============================================================================
# CURL EXAMPLES
# ============================================================================

"""
# 1. Get a token from your Next.js app's localStorage:
#    localStorage.getItem('supabase.auth.token')

# 2. Make authenticated requests:

# Get current user
curl http://localhost:8000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Access protected data
curl http://localhost:8000/api/protected/data \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Create item (POST)
curl -X POST http://localhost:8000/api/protected/create \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Item"}'

# Try without token (should fail)
curl http://localhost:8000/api/protected/data
# Response: {"detail": "Not authenticated"}
"""
