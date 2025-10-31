#!/bin/bash
# Railway build script - Python API only

echo "🐍 Installing Python dependencies..."
pip install --break-system-packages -r requirements.txt

echo "✅ Build complete!"
