#!/bin/bash

# Kill all processes
pkill -f vite
pkill -f serve
pkill -f ngrok
pkill -f ts-node-dev

# Remove PID file if it exists
rm -f .pids

echo "All services stopped!" 