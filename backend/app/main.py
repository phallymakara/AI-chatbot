from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from app.routes.chat import router as chat_router
from app.routes.upload import router as upload_router
from app.middleware.auth import get_current_user
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)

app = FastAPI()

# Configure CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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