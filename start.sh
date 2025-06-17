#!/bin/bash

# Kill any existing processes
pkill -f vite
pkill -f serve
pkill -f ngrok
pkill -f ts-node-dev

# Start backend on port 3001
cd backend
export PORT=3001
npm run dev &
BACKEND_PID=$!

# Wait for backend to start
sleep 2

# Start frontend in production mode
cd ../frontend
npm run build
npx serve dist -p 3000 &
FRONTEND_PID=$!

# Wait for frontend to start
sleep 2

# Start ngrok for frontend
ngrok http 3000 &
NGROK_PID=$!

# Save PIDs to file for later cleanup
echo $BACKEND_PID > .pids
echo $FRONTEND_PID >> .pids
echo $NGROK_PID >> .pids

echo "All services started!"
echo "Backend running on port 3001"
echo "Frontend running on port 3000"
echo "Check ngrok interface at http://127.0.0.1:4040 for the public URL" 