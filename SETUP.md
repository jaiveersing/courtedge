# CourtEdge Development Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ 
- Python 3.11+
- PostgreSQL 15+
- Redis 7+
- Docker (optional but recommended)

### 1. Install Dependencies

```powershell
# Install frontend & backend dependencies
npm install

# Install Python ML service dependencies
cd ml_service
pip install -r requirements.txt
cd ..
```

### 2. Environment Setup

Copy `.env.example` to `.env` and configure:

```powershell
cp .env.example .env
```

Key variables to set:
- `JWT_SECRET` - Generate with: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`
- `DB_PASSWORD` - Your PostgreSQL password
- `SERVER_BASE44_APP_ID` - Your Base44 app ID
- `SERVER_BASE44_API_KEY` - Your Base44 API key

### 3. Database Setup

**Option A: Docker (Recommended)**
```powershell
docker-compose up -d postgres redis
```

**Option B: Local Installation**
```powershell
# Create database
psql -U postgres -c "CREATE DATABASE courtedge;"

# Run migrations
psql -U postgres -d courtedge -f server/database/schema.sql
```

### 4. ML Models Training

```powershell
cd ml_service
python train_all_models.py
cd ..
```

This will create trained models in `ml_service/models/`.

### 5. Start Development Servers

**Option A: Docker Compose (All Services)**
```powershell
docker-compose up
```

**Option B: Manual (Separate Terminals)**

Terminal 1 - ML Service:
```powershell
cd ml_service
python start_ml_service.py
```

Terminal 2 - Backend API:
```powershell
node server/index.js
```

Terminal 3 - Frontend:
```powershell
npm run dev
```

### 6. Access Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- ML API: http://localhost:8000
- ML API Docs: http://localhost:8000/docs

## 🧪 Testing

### Run All Tests
```powershell
npm test
```

### Run Tests with Coverage
```powershell
npm test -- --coverage
```

### Run ML Service Tests
```powershell
cd ml_service
pytest tests/ -v
```

### Run Specific Test File
```powershell
npm test -- src/__tests__/App.test.tsx
```

## 🔍 Code Quality

### Linting
```powershell
npm run lint
npm run lint:fix  # Auto-fix issues
```

### Formatting
```powershell
npm run format        # Format all files
npm run format:check  # Check formatting
```

### Type Checking
```powershell
npm run type-check
```

## 📦 Building for Production

### Build Frontend
```powershell
npm run build
```

Output will be in `dist/` directory.

### Build Docker Images
```powershell
docker-compose build
```

## 🐛 Debugging

### Backend Debugging
Add breakpoints in VS Code and use the Node.js debugger:
```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Backend",
  "program": "${workspaceFolder}/server/index.js"
}
```

### Frontend Debugging
Use Chrome DevTools or VS Code's debugger for Chrome extension.

### ML Service Debugging
```powershell
cd ml_service
python -m pdb start_ml_service.py
```

## 🔧 Common Issues

### Port Already in Use
```powershell
# Find process using port
netstat -ano | findstr :5173
netstat -ano | findstr :3000
netstat -ano | findstr :8000

# Kill process
taskkill /PID <PID> /F
```

### Database Connection Failed
- Verify PostgreSQL is running
- Check connection string in `.env`
- Ensure database exists: `psql -U postgres -l`

### ML Models Not Loading
- Ensure models are trained: `python ml_service/train_all_models.py`
- Check `ml_service/models/` directory exists
- Verify Python dependencies: `pip install -r ml_service/requirements.txt`

### Redis Connection Failed
- Start Redis: `docker-compose up -d redis` or install locally
- Check Redis is running: `redis-cli ping`

## 📚 Additional Documentation

- [API Documentation](./API.md)
- [ML Service Guide](./ml_service/README.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [Contributing Guidelines](./CONTRIBUTING.md)

## 🆘 Getting Help

- Check existing issues on GitHub
- Review documentation in `/docs`
- Ask in Discord/Slack (if applicable)
- Email: support@courtedge.app
