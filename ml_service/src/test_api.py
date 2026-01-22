"""
Minimal test API to verify Render deployment works
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
import os

app = FastAPI(title="CourtEdge ML Test")

# CORS
CORS_ORIGINS = os.getenv('CORS_ORIGINS', '*').split(',')
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for auth
class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    name: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class AuthResponse(BaseModel):
    success: bool
    token: str | None = None
    user: dict | None = None
    error: str | None = None

@app.get("/")
async def root():
    return {"message": "CourtEdge ML Service - Test API", "status": "online"}

@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "environment": os.getenv("ENVIRONMENT", "development"),
        "python_version": "3.11",
        "service": "courtedge-ml-test"
    }

@app.post("/auth/register")
async def register(data: RegisterRequest):
    """Mock registration endpoint"""
    return {
        "success": True,
        "token": "mock-jwt-token-12345",
        "user": {
            "id": "demo-user-id",
            "email": data.email,
            "name": data.name,
            "created_at": "2026-01-22T00:00:00Z"
        }
    }

@app.post("/auth/login")
async def login(data: LoginRequest):
    """Mock login endpoint"""
    return {
        "success": True,
        "token": "mock-jwt-token-12345",
        "user": {
            "id": "demo-user-id",
            "email": data.email,
            "name": "Demo User",
            "created_at": "2026-01-22T00:00:00Z"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
