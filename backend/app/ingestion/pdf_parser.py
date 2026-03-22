import pdfplumber

def parse_pdf(file_path):
    """Parses a PDF file and extracts text from each page.

    Args:
        file_path (str): The path to the PDF file.

    Returns:
        list: A list of dictionaries containing page number and text.
    """
    pages = []

    with pdfplumber.open(file_path) as pdf:

        for i, page in enumerate(pdf.pages):

            text = page.extract_text()

            if text:
                pages.append({
                    "page": i + 1,
                    "text": text
                })

    return pages