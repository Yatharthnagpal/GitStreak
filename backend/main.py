import os
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")

load_dotenv()

from config import settings
from routers import auth, commits, presets, stats

app = FastAPI(
    title="GitStreak API",
    description="Precision GitHub Contribution Engine & Activity Scheduler Backend",
    version="2.0.0",
)

# CORS Middleware Configuration
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
    settings.FRONTEND_URL,
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router)
app.include_router(commits.router)
app.include_router(presets.router)
app.include_router(stats.router)

@app.get("/api/health")
async def health_check():
    return {
        "status": "ok",
        "app": "GitStreak",
        "version": "2.0.0",
        "engine": "Python FastAPI",
    }

@app.get("/")
async def root():
    return {
        "message": "GitStreak API is online.",
        "documentation": "/docs",
        "health": "/api/health",
    }
