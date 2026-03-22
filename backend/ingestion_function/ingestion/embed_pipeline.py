import os
import logging
from dotenv import load_dotenv
from openai import AzureOpenAI

# Environment configuration for Azure OpenAI
load_dotenv()

# Retrieve service endpoint and deployment details
endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
api_key = os.getenv("AZURE_OPENAI_KEY")
deployment_name = os.getenv("AZURE_OPENAI_EMBEDDING_DEPLOYMENT")
api_version = os.getenv("AZURE_OPENAI_API_VERSION", "2023-05-15")

# Client initialization
client = None

# Validate environment variables before initializing the AzureOpenAI client
if not all([endpoint, api_key, deployment_name]):
    logging.error(" Embedding Pipeline variables are missing!")
    logging.error(f"Endpoint: {'Found' if endpoint else 'MISSING'}")
    logging.error(f"Key: {'Found' if api_key else 'MISSING'}")
    logging.error(f"Deployment: {'Found' if deployment_name else 'MISSING'}")
else:
    try:
        client = AzureOpenAI(
            azure_endpoint=endpoint,
            api_key=api_key,
            api_version=api_version
        )
        logging.info(f" Embedding client initialized with deployment: {deployment_name}")
    except Exception as e:
        logging.error(f" Failed to initialize AzureOpenAI client: {e}")

def generate_embeddings(chunks):
    """Converts a list of text chunks into vector embeddings using Azure OpenAI.

    Args:
        chunks (list[str]): A list of text chunks to embed.

    Returns:
        list[list[float]]: A list of vector embeddings.
    """
    # Ensure the Azure OpenAI client is ready
    if client is None or not deployment_name:
        logging.error("Embedding configuration is incomplete. Cannot generate embeddings.")
        raise ValueError("Missing embedding deployment configuration. Please check environment variables.")

    try:
        # Cast input to list if a single string is provided
        if isinstance(chunks, str):
            chunks = [chunks]

        # Request vector embeddings from the Azure OpenAI service
        response = client.embeddings.create(
            input=chunks,
            model=deployment_name
        )
        
        # Extract and return the raw embedding vectors
        return [data.embedding for data in response.data]

    except Exception as e:
        logging.error(f" Error during embedding generation: {e}")
        raise