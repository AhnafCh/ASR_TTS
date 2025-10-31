# Railway Dockerfile - Python API only
FROM python:3.11-slim

WORKDIR /app

# Copy requirements first for caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy API code
COPY api/ ./api/

# Expose port (Railway will set $PORT)
EXPOSE 8000

# Start command
CMD cd api && uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}
