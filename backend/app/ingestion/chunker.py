from langchain_text_splitters import RecursiveCharacterTextSplitter


def chunk_text(data, chunk_size=800, overlap=150):
    """Splits text data into smaller chunks for processing.

    Args:
        data (str | list): The extracted text as a string (DOCX) or list of pages (PDF).
        chunk_size (int, optional): The maximum size of each chunk. Defaults to 800.
        overlap (int, optional): The number of characters to overlap between chunks. Defaults to 150.

    Returns:
        list: A list of dictionaries, each containing 'text' and 'page'.
    """
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=overlap
    )

    chunks = []

    # Process input data based on whether it is a collection of pages (PDF) or a single string (DOCX)
    if isinstance(data, list):

        for page in data:
            splits = splitter.split_text(page["text"])

            for chunk in splits:
                chunks.append({
                    "text": chunk,
                    "page": page["page"]
                })

    # Handle single-string document formats
    else:
        splits = splitter.split_text(data)

        for chunk in splits:
            chunks.append({
                "text": chunk,
                "page": None
            })

    return chunks