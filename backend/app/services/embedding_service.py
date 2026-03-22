import os
from dotenv import load_dotenv
from openai import AsyncAzureOpenAI

load_dotenv()

client = AsyncAzureOpenAI(
    api_key=os.getenv("AZURE_OPENAI_API_KEY"),
    api_version="2024-02-01",
    azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
)

async def create_embedding(text: str):
    """Generates a vector embedding for the given text using Azure OpenAI.

    Args:
        text (str): The text to embed.

    Returns:
        list[float]: The vector embedding, or None if the text is empty.
    """
    text = str(text).strip()

    if not text:
        return None

    response = await client.embeddings.create(
        model=os.getenv("AZURE_OPENAI_EMBEDDING_DEPLOYMENT"),
        input=text
    )

    return response.data[0].embedding