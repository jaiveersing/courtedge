#!/bin/bash

echo "🚀 CourtEdge Quick Start"
echo "================================"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
RED='\033[0;31m'
NC='\033[0m'

# Function to check command
check_command() {
    if command -v $1 &> /dev/null; then
        echo -e "${GREEN}✅ $1 found${NC}"
        return 0
    else
        echo -e "${RED}❌ $1 not found${NC}"
        return 1
    fi
}

# Check dependencies
echo -e "${YELLOW}Checking dependencies...${NC}"
check_command python3 || exit 1
check_command node || exit 1
check_command npm || exit 1

echo ""
echo -e "${CYAN}Starting services...${NC}"
echo ""

# Start ML service in background
echo -e "${YELLOW}Starting ML Service (port 8000)...${NC}"
cd ml_service
python3 src/api.py &
ML_PID=$!
cd ..
sleep 3
echo -e "${GREEN}✅ ML Service started (PID: $ML_PID)${NC}"

# Start backend in background
echo -e "${YELLOW}Starting Backend (port 3000)...${NC}"
cd server
node index.js &
BACKEND_PID=$!
cd ..
sleep 2
echo -e "${GREEN}✅ Backend started (PID: $BACKEND_PID)${NC}"

# Start frontend
echo -e "${YELLOW}Starting Frontend (port 5173)...${NC}"
npm run dev &
FRONTEND_PID=$!
sleep 2
echo -e "${GREEN}✅ Frontend started (PID: $FRONTEND_PID)${NC}"

echo ""
echo "================================"
echo -e "${GREEN}✅ All services running!${NC}"
echo "================================"
echo ""
echo "Access points:"
echo -e "${CYAN}  Frontend:  http://localhost:5173${NC}"
echo -e "${CYAN}  Backend:   http://localhost:3000${NC}"
echo -e "${CYAN}  ML API:    http://localhost:8000${NC}"
echo -e "${CYAN}  ML Docs:   http://localhost:8000/docs${NC}"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait and cleanup on exit
trap "echo ''; echo 'Stopping services...'; kill $ML_PID $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT TERM

wait
