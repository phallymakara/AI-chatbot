# AI Chatbot System

A full-stack AI chatbot platform built with **FastAPI**, **React**, and modern AI Azure services.
The system supports document ingestion, knowledge retrieval, and conversational interaction through a web interface.

This project is designed with a **modular architecture** separating backend services, frontend interface, and ingestion pipelines to support scalability and maintainability.

---

# System Architecture

The system consists of three main components:

1. **Backend API**
   - Built with **FastAPI**
   - Handles authentication, chatbot logic, API endpoints, and AI service communication.

2. **Frontend Application**
   - Built with **React**
   - Provides user interface for chatbot interactions and admin management.

3. **Document Ingestion Pipeline**
   - Processes and prepares documents for AI retrieval.

---

# Project Structure

```
AI-Chatbot/
│
├── backend/
│   ├── app/
│   │   ├── api/           # API endpoint definitions
│   │   ├── auth/          # Authentication logic
│   │   ├── core/          # Core configuration and utilities
│   │   ├── database/      # Database connection and models
│   │   ├── ingestion/     # Document ingestion logic
│   │   ├── models/        # Pydantic / data models
│   │   ├── routes/        # API route handlers
│   │   └── services/      # Business logic and integrations
│   │
│   ├── documents/         # Knowledge base documents
│   └── venv/              # Python virtual environment (ignored in Git)
│
├── frontend/
│   ├── public/            # Static frontend assets
│   └── src/
│       ├── api/           # API request services
│       ├── assets/        # Images, icons, styles
│       ├── auth/          # Authentication logic
│       ├── components/    # Reusable UI components
│       ├── controllers/   # Application controllers
│       ├── models/        # Frontend data models
│       └── views/         # Application pages
│           ├── admin/
│           ├── auth/
│           ├── shared/
│           └── user/
│
└── ingestion_functions/
    ├── ingestion/         # Document ingestion utilities
    └── services/          # Processing services
```

---

# Key Features

- AI-powered conversational chatbot
- Document ingestion pipeline
- Modular backend architecture
- React-based user interface
- Authentication system
- API-driven communication
- Separation of admin and user interfaces
- Extensible service architecture

---

# Technologies Used

### Backend

- Python
- FastAPI
- Pydantic
- Uvicorn
- OpenAI API
- HTTPX

### Frontend

- React
- JavaScript / JSX
- CSS

### AI & Processing

- OpenAI API
- Document ingestion pipeline

---

# Installation Guide

## 1. Clone the Repository

```bash
git clone https://github.com/phallymakara/AI-Chatbot.git
cd AI-Chatbot
```

---

# Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate the environment:

Mac / Linux

```bash
source venv/bin/activate
```

Windows

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run the FastAPI server:

```bash
uvicorn main:app --reload
```

Backend will run at:

```
http://localhost:8000
```

API documentation:

```
http://localhost:8000/docs
```

---

# Frontend Setup

Navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Frontend will run at:

```
http://localhost:5173
```

---

# Environment Variables

Create a `.env` file in the backend directory:

```
OPENAI_API_KEY=your_api_key
DATABASE_URL=your_database_connection
```

---

# Development Workflow

1. Start backend server
2. Start frontend development server
3. Upload documents through ingestion pipeline
4. Interact with chatbot through frontend interface

---

# Future Improvements

- Vector database integration
- Multi-tenant architecture
- Role-based access control
- Deployment using Docker
- Cloud deployment (Azure)
- Real-time chat streaming
- Monitoring and logging

---

# License

Copyright (c) 2026 PHALLY MAKARA and Team.

Unauthorized distribution or commercial use without permission from the authors is prohibited.

---

# Authors

- **PHALLY MAKARA** – Developer
- **Team Members** – Contributors

Developed as part of an AI Chatbot System project.
