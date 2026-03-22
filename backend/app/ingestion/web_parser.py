import requests
from bs4 import BeautifulSoup
import trafilatura
import logging
import re
import certifi
import os

# Global fix for SSL certificate verification issues on macOS
# This ensures that all requests (including those made by trafilatura) use the certifi CA bundle
os.environ['REQUESTS_CA_BUNDLE'] = certifi.where()
os.environ['SSL_CERT_FILE'] = certifi.where()

def extract_text_from_url(url: str) -> str:
    """Fetches a webpage and extracts its main textual content using trafilatura and BeautifulSoup.
    
    Args:
        url (str): The URL of the webpage to parse.
        
    Returns:
        str: The extracted plain text content.
    """
    logging.info(f"Starting content extraction for URL: {url}")
    
    try:
        # 1. Fetch the content with a proper User-Agent
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }
        
        try:
            # First attempt: Secure request using certifi
            response = requests.get(url, headers=headers, timeout=20, verify=certifi.where())
            response.raise_for_status()
        except (requests.exceptions.SSLError, requests.exceptions.ConnectionError) as ssl_err:
            logging.warning(f"SSL Verification failed for {url}, retrying without verification. Error: {ssl_err}")
            # Second attempt: Fallback to verify=False if local CA bundle is broken (common on macOS)
            # We disable warnings to keep the logs clean
            import urllib3
            urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
            response = requests.get(url, headers=headers, timeout=20, verify=False)
            response.raise_for_status()
        
        html_content = response.text
        logging.info(f"Successfully fetched HTML from {url} (Size: {len(html_content)} bytes)")
        
        # 2. Try extraction using trafilatura (optimized for articles/content)
        extracted_content = trafilatura.extract(html_content, include_comments=False, include_tables=True, no_fallback=False)
        
        if extracted_content:
            logging.info("Content successfully extracted using trafilatura.")
            return extracted_content
            
        # 3. Fallback to BeautifulSoup if trafilatura fails to find content
        logging.warning("trafilatura failed to extract content, falling back to BeautifulSoup.")
        
        soup = BeautifulSoup(html_content, "html.parser")
        
        # Remove noisy elements
        for script_or_style in soup(["script", "style", "header", "footer", "nav", "aside", "form"]):
            script_or_style.decompose()
            
        # Get text with space separator
        text = soup.get_text(separator=' ')
        
        # Clean up whitespace and empty lines
        lines = (line.strip() for line in text.splitlines())
        chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
        clean_text = '\n'.join(chunk for chunk in chunks if chunk)
        
        if not clean_text.strip():
            raise ValueError(f"Could not extract any meaningful text content from {url}")
            
        logging.info(f"Content successfully extracted using BeautifulSoup (Size: {len(clean_text)} characters).")
        return clean_text

    except requests.exceptions.RequestException as e:
        logging.error(f"HTTP Request failed for {url}: {str(e)}")
        raise Exception(f"Connection error: Could not access the website ({str(e)})")
    except Exception as e:
        logging.error(f"Extraction failed for {url}: {str(e)}")
        raise Exception(f"Scraping error: {str(e)}")
