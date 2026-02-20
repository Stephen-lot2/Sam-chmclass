#!/bin/bash

echo "========================================"
echo "Samuel ChemLab - Fix Script"
echo "========================================"
echo ""

echo "Step 1: Checking Node.js..."
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed!"
    echo "Please install Node.js from https://nodejs.org"
    exit 1
fi
node --version
echo "✓ Node.js is installed"
echo ""

echo "Step 2: Cleaning old files..."
rm -rf node_modules
rm -rf .vite
rm -rf dist
rm -f package-lock.json
echo "✓ Cleaned old files"
echo ""

echo "Step 3: Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install dependencies!"
    exit 1
fi
echo "✓ Dependencies installed"
echo ""

echo "Step 4: Starting development server..."
echo ""
echo "========================================"
echo "Server will start now!"
echo "Open your browser to: http://localhost:5173"
echo "Press Ctrl+C to stop the server"
echo "========================================"
echo ""

npm run dev
