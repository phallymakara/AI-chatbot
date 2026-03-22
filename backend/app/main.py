from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware # FastAPI middleware for Cross-Origin Resource Sharing
from app.routes.chat import router as chat_router
from app.routes.upload import router as upload_router
from app.middleware.auth import get_current_user
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)

app = FastAPI()

# Configure CORS middleware to permit requests from the frontend application
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Broad origin permit for the chatbot frontend
    allow_credentials=True,
    allow_methods=["*"],  # Permit all standard HTTP methods
    allow_headers=["*"],  # Permit all standard HTTP headers
)

app.include_router(chat_router, dependencies=[Depends(get_current_user)])
app.include_router(upload_router, dependencies=[Depends(get_current_user)])

@app.get("/")
def health_check():
    """Returns the current status of the HR Chatbot API."""
    return {"status": "HR Chatbot API running"}

@app.get("/api/test")
async def test_api(user=Depends(get_current_user)):
    return {
        "message": "Secure API working",
        "user": user
    }