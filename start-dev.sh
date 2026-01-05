#!/bin/bash

echo "🚀 Starting Raiku Development Environment"
echo "=========================================="
echo ""

# Kill previous instances
echo "🔄 Cleaning up previous instances..."
pkill -f "node server.js" 2>/dev/null
pkill -f "vite" 2>/dev/null
sleep 1

# Start backend server in background
echo "🖥️  Starting Express Backend (Port 3001)..."
node server.js &
BACKEND_PID=$!
sleep 2

# Check if backend started
if ps -p $BACKEND_PID > /dev/null; then
   echo "✅ Backend server started (PID: $BACKEND_PID)"
else
   echo "❌ Backend failed to start"
   exit 1
fi

# Start Vite dev server
echo "⚡ Starting Vite Frontend (Port 5173/5174)..."
npm run dev

# Cleanup on exit
trap "echo ''; echo '🛑 Shutting down...'; kill $BACKEND_PID 2>/dev/null; exit" INT TERM
