import azure.functions as func
import logging
import os
import re
from dotenv import load_dotenv

# External dependencies and custom modules
from ingestion.parser import extract_text_from_blob
from ingestion.embed_pipeline import generate_embeddings
from services.search_service import upload_documents

# Environment configuration
load_dotenv()

app = func.FunctionApp()

@app.blob_trigger(
    arg_name="myblob",
    path="documents/{tenant_id}/raw/{name}",
    connection="AzureWebJobsStorage"  
)
def blob_ingestion_trigger(myblob: func.InputStream):
    """Azure Function triggered when a new blob is uploaded to the 'documents/{tenant_id}/raw/' path.
    Performs text extraction, chunking, embedding generation, and indexing in Azure AI Search.

    Args:
        myblob (func.InputStream): The blob stream from the trigger.
    """
    blob_name = myblob.name 
    logging.info(f" Processing triggered for blob: {blob_name}")

    # Extract tenant_id from blob path: documents/{tenant_id}/raw/{name}
    # Azure Function blob_trigger 'name' often includes the container and full path
    match = re.search(r"documents/([^/]+)/raw/", blob_name)
    tenant_id = match.group(1) if match else "unknown"

    try:
        # Extract raw text from the blob stream based on file extension
        blob_data = myblob.read()
        text = extract_text_from_blob(blob_data, blob_name)
        
        if not text or len(text.strip()) == 0:
            logging.warning(f" No text extracted. Skipping.")
            return

        # Partition text into fixed-size chunks with overlap for semantic continuity
        chunk_size = 1000
        overlap = 200
        chunks = [text[i:i + chunk_size] for i in range(0, len(text), chunk_size - overlap)]
        
        logging.info(f" Created {len(chunks)} chunks.")

        # Generate vector embeddings for all text chunks
        embeddings = generate_embeddings(chunks)

        # Prepare document objects for Azure AI Search, ensuring field compliance
        base_filename = os.path.basename(blob_name)
        clean_name = re.sub(r'[^a-zA-Z0-9]', '_', base_filename)
        
        search_documents = []
        for i, chunk in enumerate(chunks):
            # Map chunk data to the search index schema
            search_documents.append({
                "id": f"chunk_{clean_name}_{i}",
                "content": chunk,
                "embedding": embeddings[i],
                "source": base_filename,
                "page": 1
            })

        # Batch upload processed documents to the search index
        if search_documents:
            upload_documents(search_documents)
            logging.info(f" Successfully ingested: {base_filename}")
        else:
            logging.warning("No documents to upload.")

    except Exception as e:
        logging.error(f" Ingestion failed: {str(e)}")
        raise