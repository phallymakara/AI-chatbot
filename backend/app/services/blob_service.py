import os
import logging
from datetime import datetime
from dotenv import load_dotenv
from azure.storage.blob import BlobServiceClient

# Load local environment variables
load_dotenv()

# Azure Storage connection details
connection_string = os.getenv("AZURE_STORAGE_CONNECTION_STRING")
container_name = os.getenv("AZURE_STORAGE_CONTAINER")

# Initialize the BlobServiceClient if the connection string is provided
if not connection_string:
    logging.error(" AZURE_STORAGE_CONNECTION_STRING is missing!")
    blob_service_client = None
else:
    blob_service_client = BlobServiceClient.from_connection_string(connection_string)

def upload_file_to_blob(file, tenant_id):
    """
    Upload FastAPI UploadFile directly to Azure Blob Storage.
    Args:
        file: The FastAPI UploadFile object.
        tenant_id: The unique ID for the company/tenant.
    """
    if not blob_service_client:
        raise RuntimeError("BlobServiceClient not initialized. Check connection string.")

    # Organize blobs into tenant-specific raw storage paths
    blob_name = f"{tenant_id}/raw/{file.filename}"

    blob_client = blob_service_client.get_blob_client(
        container=container_name,
        blob=blob_name
    )

    # Stream file content directly to Azure Blob Storage
    blob_client.upload_blob(file.file, overwrite=True)

    return {
        "filename": file.filename,
        "blob_path": blob_name,
        "url": blob_client.url
    }

def list_documents(tenant_id):
    """Lists all files uploaded for a specific tenant in Azure Blob Storage.

    Args:
        tenant_id (str): The unique ID for the tenant.

    Returns:
        list[dict]: A list of document metadata dictionaries.
    """
    if not blob_service_client:
        return []

    container_client = blob_service_client.get_container_client(container_name)
    # Filter blobs based on the tenant's raw data prefix
    blobs = container_client.list_blobs(name_starts_with=f"{tenant_id}/raw/")

    documents = []
    for i, blob in enumerate(blobs, start=1):
        created_date = blob.creation_time
        date_str = created_date.strftime("%Y-%m-%d") if created_date else datetime.now().strftime("%Y-%m-%d")

        documents.append({
            "id": i,
            "name": blob.name.split("/")[-1],
            "path": blob.name,
            "date": date_str,
            "status": "Uploaded"
        })

    return documents

def delete_document(filename, tenant_id):
    """Deletes a specific file from Azure Blob Storage.

    Args:
        filename (str): The name of the file to delete.
        tenant_id (str): The unique ID for the tenant.

    Returns:
        dict: A success message if the deletion was successful.
    """
    blob_name = f"{tenant_id}/raw/{filename}"
    blob_client = blob_service_client.get_blob_client(container=container_name, blob=blob_name)
    
    try:
        # Permanently remove the blob from storage
        blob_client.delete_blob()
        return {"message": "document deleted successfully", "filename": filename}
    except Exception as e:
        logging.error(f"Error deleting blob: {e}")
        raise

def get_blob_url(filename, tenant_id):
    """Retrieves the public URL for a specific blob in Azure Storage.

    Args:
        filename (str): The name of the file.
        tenant_id (str): The unique ID for the tenant.

    Returns:
        str: The full URL to the blob.
    """
    blob_name = f"{tenant_id}/raw/{filename}"
    blob_client = blob_service_client.get_blob_client(container=container_name, blob=blob_name)
    return blob_client.url