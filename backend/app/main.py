# /app/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from .api import router as api_router
from .core.config import get_settings

settings = get_settings()
app = FastAPI(title="Cards API")

origins = [
    "http://localhost:3000",      # Next.js dev server
    "http://localhost:6405",      # Docker-mapped frontend port
    "http://frontend:3000",       # Docker service name
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")
app.mount(
    "/static/cards",
    StaticFiles(directory=f"{settings.upload_dir}/cards"),  # Use f-string
    name="cards"
)