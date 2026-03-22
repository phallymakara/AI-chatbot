import os
import logging
from dotenv import load_dotenv
from azure.search.documents import SearchClient
from azure.core.credentials import AzureKeyCredential

# Environment configuration and Azure AI Search client initialization
load_dotenv()

endpoint = os.getenv("AZURE_SEARCH_ENDPOINT")
key = os.getenv("AZURE_SEARCH_KEY")
index_name = os.getenv("AZURE_SEARCH_INDEX")

search_client = None

# Validate search credentials and initialize the SearchClient
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
        raise RuntimeError("SearchClient is not initialized.")
    
    # Validate input data presence before attempting upload
    if not documents:
        logging.warning(" No documents provided for upload. Skipping indexing.")
        return None

    try:
        result = search_client.upload_documents(documents)
        logging.info(f" Successfully uploaded {len(documents)} chunks to Search.")
        return result
    except Exception as e:
        logging.error(f" Error uploading documents: {e}")
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

    # Query the search index for document IDs matching the filename prefix
    results = search_client.search(
        search_text=filename_prefix,
        select=["id"]
    )

    ids = [{"id": r["id"]} for r in results]

    if ids:
        search_client.delete_documents(ids)
        logging.info(f"Deleted {len(ids)} chunks for prefix: {filename_prefix}")

    return len(ids)

def search_documents(vector, query_text=None, top_k=3):
    """Performs a vector search on the AI Search index.

    Args:
        vector (list[float]): The query vector embedding.
        query_text (str, optional): The original query text. Defaults to None.
        top_k (int, optional): The number of nearest neighbors to return. Defaults to 3.

    Returns:
        tuple[list[str], list[dict]]: A tuple containing a list of content strings and a list of source metadata.
    """
    if not search_client:
        raise RuntimeError("SearchClient is not initialized.")

    from azure.search.documents.models import VectorizedQuery

    # Construct the vector query using the Modern SDK VectorizedQuery model
    vector_query = VectorizedQuery(
        vector=vector, 
        k_nearest_neighbors=top_k, 
        fields="embedding"
    )

    results = search_client.search(
        search_text=None,
        vector_queries=[vector_query],
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
        
        # Deduplicate citation metadata based on document and page number
        key_pair = (source, page)
        if key_pair not in seen_sources:
            seen_sources.add(key_pair)
            sources.append({
                "document": source,
                "page": page
            })

    return documents, sources