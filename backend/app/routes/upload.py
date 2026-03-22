from fastapi import APIRouter, UploadFile, BackgroundTasks, HTTPException, Depends
from pydantic import BaseModel
import os
import logging

# Core service integrations
from app.services.blob_service import upload_file_to_blob, delete_document, list_documents
from app.services.search_service import delete_document_chunks
from app.ingestion.pipeline import process_url
from app.middleware.auth import get_current_user, require_admin

# The ingestion logic is delegated to the Azure Blob Trigger function (blob_ingestion_trigger)
# which automatically processes files upon upload to the cloud storage container.

router = APIRouter(
    prefix="/documents",
    tags=["Documents"]
)

class LinkUploadRequest(BaseModel):
    name: str
    url: str

@router.post("/link")
async def upload_link(request: LinkUploadRequest, background_tasks: BackgroundTasks, user: dict = Depends(require_admin)):
    """
    Ingests a website URL by scraping its content and processing it.
    Requires admin privileges.
    """
    tenant_id = user.get("tid")

    try:
        # Process the URL immediately, or optionally move to a background task
        chunks_added = await process_url(request.url, request.name, tenant_id)

        return {
            "message": "URL successfully ingested and processed.",
            "name": request.name,
            "url": request.url,
            "chunks_added": chunks_added
        }
    except Exception as e:
        import traceback
        error_msg = f"URL ingestion failed: {str(e)}\n{traceback.format_exc()}"
        logging.error(error_msg)
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/upload")
async def upload_document(file: UploadFile, user: dict = Depends(require_admin)):
    """
    Uploads a file to Azure Blob Storage. 
    The Azure Function will pick it up automatically for ingestion.
    Requires admin privileges.
    """
    tenant_id = user.get("tid")

    try:
        # Transmit the UploadFile stream directly to the blob storage service
        result = upload_file_to_blob(file, tenant_id)

        return {
            "message": "Upload successful. Azure Function is processing the document.",
            "filename": file.filename,
            "blob_path": result.get("blob_path")
        }
    except Exception as e:
        logging.error(f"Upload failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("")
async def get_documents(user: dict = Depends(require_admin)):
    """Retrieves a list of all documents uploaded to Azure Blob Storage for the current tenant.
    Requires admin privileges.
    """
    tenant_id = user.get("tid")
    documents = list_documents(tenant_id)
    return {"documents": documents}

@router.delete("/{filename}")
async def remove_document(filename: str, user: dict = Depends(require_admin)):
    """Deletes a document from Azure Blob Storage and its corresponding chunks from Azure AI Search.
    Requires admin privileges.
    """
    tenant_id = user.get("tid")

    try:
        # Purge the source file from the Azure Blob Storage container
        try:
            delete_document(filename, tenant_id)
        except Exception as e:
            # Silently handle cases where blob doesn't exist (e.g., for URLs/links)
            logging.warning(f"Blob deletion skipped for {filename}: {e}")

        # Remove all associated vector chunks from the AI Search index using prefix matching
        deleted_chunks = delete_document_chunks(filename)

        return {
            "message": "Document and associated vectors removed",
            "filename": filename,
            "chunks_deleted": deleted_chunks
        }
    except Exception as e:
        logging.error(f"Delete failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))