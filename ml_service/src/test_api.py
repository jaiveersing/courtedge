"""
Minimal test API to verify Render deployment works
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
