import os
import asyncio
import re
from app.ingestion.pdf_parser import parse_pdf
from app.ingestion.docx_parser import parse_docx
from app.ingestion.web_parser import extract_text_from_url
from app.ingestion.chunker import chunk_text
from app.ingestion.embed_pipeline import generate_embeddings
from app.services.search_service import upload_documents

async def process_document(file_path: str, tenant_id: str):
    """Orchestrates the document ingestion pipeline: parsing, chunking, embedding, and uploading.

    Args:
        file_path (str): The local path to the file to process.
        tenant_id (str): The tenant/user ID for multi-user support.

    Returns:
        int: The number of chunks successfully uploaded to the search index.
    """
    # Route parsing logic based on document file extension
    if file_path.endswith(".pdf"):
        data = parse_pdf(file_path)

    elif file_path.endswith(".docx"):
        data = parse_docx(file_path)

    else:
        raise ValueError("Unsupported file type")

    # Decompose document text into manageable semantic chunks
    chunks = chunk_text(data)

    # Generate vector embeddings for all chunks in a batch operation
    embedded_chunks = await generate_embeddings(chunks)

    documents = []

    base_filename = os.path.basename(file_path)
    clean_name = re.sub(r'[^a-zA-Z0-9]', '_', base_filename)

    # Format embedded chunks into the expected Azure AI Search document schema
    for i, item in enumerate(embedded_chunks):

        documents.append({
            "id": f"chunk_{clean_name}_{i}",
            "content": item["text"],
            "embedding": item["embedding"],
            "source": base_filename,
            "page": item["page"] or 1
        })

    # Synchronize processed documents with the Azure AI Search index
    upload_documents(documents)

    return len(documents)

async def process_url(url: str, title: str, tenant_id: str = "tenantA"):
    """Orchestrates the URL ingestion pipeline: scraping, chunking, embedding, and uploading.

    Args:
        url (str): The URL of the webpage to process.
        title (str): The display title/name for the URL.
        tenant_id (str): The tenant/user ID for multi-user support.

    Returns:
        int: The number of chunks successfully uploaded to the search index.
    """
    # Extract text from the webpage
    text_content = extract_text_from_url(url)

    if not text_content or not text_content.strip():
        raise ValueError("Failed to extract any content from the URL")

    # Wrap the extracted text into the expected chunking format
    data = [{"text": text_content, "page": 1}]

    # Decompose document text into manageable semantic chunks
    chunks = chunk_text(data)

    # Generate vector embeddings for all chunks in a batch operation
    embedded_chunks = await generate_embeddings(chunks)

    documents = []

    # Create a safe base filename/source identifier from the URL
    safe_title = re.sub(r'[^a-zA-Z0-9]', '_', title)
    source_identifier = url

    # Format embedded chunks into the expected Azure AI Search document schema
    for i, item in enumerate(embedded_chunks):
        documents.append({
            "id": f"link_{safe_title}_{i}",
            "content": item["text"],
            "embedding": item["embedding"],
            "source": source_identifier,
            "page": item["page"] or 1
        })

    # Synchronize processed documents with the Azure AI Search index
    upload_documents(documents)

    return len(documents)