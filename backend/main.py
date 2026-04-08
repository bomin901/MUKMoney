from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from backend.database import engine, Base
from backend.routes import preferences, recommendation, records

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="MUKMoney API")

# Configure CORS for Vite dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount uploads directory
app.mount("/uploads", StaticFiles(directory="backend/uploads"), name="uploads")

# Include routers
app.include_router(preferences.router, prefix="/api/preferences", tags=["Preferences"])
app.include_router(recommendation.router, prefix="/api/recommend", tags=["Recommendation"])
app.include_router(records.router, prefix="/api", tags=["Records"])
