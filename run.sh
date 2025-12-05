#!/bin/bash

cd server && python app.py &
BACKEND_PID=$!

cd client && npm run dev &
FRONTEND_PID=$!

wait $BACKEND_PID $FRONTEND_PID
