import io
import logging
from PyPDF2 import PdfReader
from docx import Document

def extract_text_from_blob(blob_stream, blob_name: str) -> str:
    """Detects file type by extension and extracts text from the blob stream.

    Args:
        blob_stream (bytes): The raw blob data.
        blob_name (str): The name of the blob (used for extension detection).

    Returns:
        str: The extracted text content.
    """
    extension = blob_name.split('.')[-1].lower()
    text = ""

    try:
        if extension == 'pdf':
            logging.info(f" Parsing PDF: {blob_name}")
            reader = PdfReader(io.BytesIO(blob_stream))
            for page in reader.pages:
                text += page.extract_text() + "\n"
        
        elif extension == 'docx':
            logging.info(f" Parsing Word Doc: {blob_name}")
            doc = Document(io.BytesIO(blob_stream))
            for para in doc.paragraphs:
                text += para.text + "\n"
        
        elif extension == 'txt':
            logging.info(f" Parsing Text file: {blob_name}")
            text = blob_stream.decode('utf-8', errors='ignore')
            
        else:
            logging.warning(f" Unsupported file type: .{extension}")
            
    except Exception as e:
        logging.error(f" Error parsing {blob_name}: {str(e)}")
        
    return text.strip()