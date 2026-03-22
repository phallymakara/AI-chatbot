import os
import logging
from dotenv import load_dotenv
from azure.search.documents import SearchClient
from azure.core.credentials import AzureKeyCredential
from azure.search.documents.models import VectorizedQuery

# Load local environment configuration
load_dotenv()

# Azure AI Search connection and index details
endpoint = os.getenv("AZURE_SEARCH_ENDPOINT")
key = os.getenv("AZURE_SEARCH_KEY")
index_name = os.getenv("AZURE_SEARCH_INDEX")

search_client = None

# Initialize the SearchClient if all required credentials are present
if not all([endpoint, key, index_name]):
    logging.error(" Azure Search environment variables are missing!")
    logging.error(f"Endpoint: {'Found' if endpoint else 'MISSING'}")
    logging.error(f"Key: {'Found' if key else 'MISSING'}")
    logging.error(f"Index: {'Found' if index_name else 'MISSING'}")
else:
    try:
        search_client = SearchClient(
            endpoint=endpoint,
            index_name=index_name,
            credential=AzureKeyCredential(key)
        )
        logging.info(" SearchClient successfully initialized.")
    except Exception as e:
        logging.error(f" Failed to initialize SearchClient: {str(e)}")

def upload_documents(documents):
    """Uploads a list of document chunks to the Azure AI Search index.

    Args:
        documents (list[dict]): A list of dictionaries representing document chunks.

    Returns:
        list: The result of the upload operation.
    """
    if not search_client:
        raise RuntimeError("SearchClient is not initialized. Check your environment settings.")
    
    try:
        # Batch upload documents to the configured search index
        result = search_client.upload_documents(documents)
        return result
    except Exception as e:
        logging.error(f"Error uploading documents: {e}")
        raise

def delete_document_chunks(filename_prefix):
    """Deletes all chunks from the search index that match the given filename prefix.

    Args:
        filename_prefix (str): The prefix (filename) to match for deletion.

    Returns:
        int: The number of chunks deleted.
    """
    if not search_client:
        raise RuntimeError("SearchClient is not initialized.")

    # Search for and collect document IDs that match the filename prefix
    results = search_client.search(
        search_text=filename_prefix,
        select=["id"]
    )

    ids = [{"id": r["id"]} for r in results]

    if ids:
        # Purge identified chunks from the search index
        search_client.delete_documents(ids)

    return len(ids)

def search_documents(vector, query_text, tenant_id=None, top_k=3):
    """Performs a vector search on the AI Search index to find the most relevant document chunks.

    Args:
        vector (list[float]): The query vector embedding.
        query_text (str): The original query text.
        tenant_id (str, optional): The tenant ID to filter results.
        top_k (int, optional): The number of nearest neighbors to return. Defaults to 3.

    Returns:
        tuple[list[str], list[dict]]: A tuple containing a list of content strings and a list of source metadata.
    """
    if not search_client:
        raise RuntimeError("SearchClient is not initialized.")

    # Construct vector query parameters for the semantic search
    vector_query = VectorizedQuery(vector=vector, k_nearest_neighbors=top_k, fields="embedding")

    # Add tenant filtering if provided AND enabled in config
    # DISABLED: tenant_id field does not exist in the current Azure AI Search index
    enable_filter = False 
    filter_expr = f"tenant_id eq '{tenant_id}'" if (tenant_id and enable_filter) else None

    results = search_client.search(
        search_text=None,
        vector_queries=[vector_query],
        filter=filter_expr,
        top=top_k,
        select=["content", "source", "page"]
    )

    documents = []
    sources = []
    seen_sources = set()

    for result in results:
        documents.append(result["content"])
        
        source = result.get("source", "unknown")
        page = result.get("page", 1)
        # Deduplicate and track unique citation sources
        key_pair = (source, page)

        if key_pair not in seen_sources:
            seen_sources.add(key_pair)
            sources.append({
                "document": source,
                "page": page
            })

    return documents, sources