import asyncio
from app.services.embedding_service import create_embedding


async def embed_one(text, page):
    """Generates an embedding for a single piece of text and its page number.

    Args:
        text (str): The text to embed.
        page (int): The page number the text belongs to.

    Returns:
        dict: A dictionary containing the text, its embedding, and page number.
    """
    embedding = await create_embedding(text)
    return {
        "text": text,
        "embedding": embedding,
        "page": page
    }


async def generate_embeddings(chunks):
    """Generates embeddings for a list of text chunks concurrently.

    Args:
        chunks (list): A list of dictionaries, each containing 'text' and 'page'.

    Returns:
        list: A list of dictionaries with text, embeddings, and page numbers.
    """
    tasks = [
        embed_one(item["text"], item["page"])
        for item in chunks
    ]

    results = await asyncio.gather(*tasks)

    return results