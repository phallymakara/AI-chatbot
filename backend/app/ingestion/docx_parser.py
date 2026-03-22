from docx import Document

def parse_docx(file_path: str):
    """Parses a Word document (.docx) and extracts its text.

    Args:
        file_path (str): The path to the docx file.

    Returns:
        str: The extracted text from the document.
    """
    doc = Document(file_path)

    text = "\n".join(
        paragraph.text for paragraph in doc.paragraphs
    )

    return text