from openai import AsyncAzureOpenAI
from dotenv import load_dotenv
import os

load_dotenv()

client = AsyncAzureOpenAI(
    api_key=os.getenv("AZURE_OPENAI_API_KEY"),
    api_version="2024-12-01-preview",
    azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
)

DEPLOYMENT = os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME")


async def ask_llm_stream(prompt: str):
    """Sends a prompt to the LLM and yields the response as a stream of tokens.

    Args:
        prompt (str): The prompt to send to the LLM.

    Yields:
        str: The next token in the response stream.
    """
    stream = await client.chat.completions.create(
        model=DEPLOYMENT,
        stream=True,
        messages=[
            {
                "role": "system",
                "content": (
                    "You are a helpful assistant. You must answer the user's question "
                    "using ONLY the provided context and documents. Do not use your "
                    "internal knowledge to supplement your response. If the information "
                    "is not explicitly stated in the context, you must state that you "
                    "do not have that information.\n\n"
                    "LANGUAGE INSTRUCTIONS:\n"
                    "1. Detect the language of the user's question (e.g., Khmer or English).\n"
                    "2. Always respond in the SAME language as the user's question.\n"
                    "3. If the answer is found in the documents (regardless of the document's language), "
                    "translate it accurately into the user's language for the response."
                )
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
    )

    async for chunk in stream:
        if chunk.choices:
            delta = chunk.choices[0].delta
            if delta and delta.content:
                yield delta.content