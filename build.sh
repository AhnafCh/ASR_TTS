#!/bin/bash
# Railway build script - Python API only

echo "🐍 Installing Python dependencies..."
python3 -m pip install --upgrade pip
python3 -m pip install -r requirements.txt

echo "✅ Build complete!"
