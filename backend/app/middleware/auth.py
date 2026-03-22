import jwt
import requests
import logging
import json
from functools import lru_cache
from fastapi import Request, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

# List of allowed Client IDs (Audience)
ALLOWED_CLIENT_IDS = [
    "46e7c75f-d5ec-4764-81ff-4c6da7fbeb05", # Chat-bot (Multi-tenant)
]

# Map of tenant IDs to their domains (Not strictly needed for standard Entra ID, but kept for CIAM if needed)
TENANT_CONFIGS = {
    "6b0558a7-0139-4e67-a91f-bc16474f0e09": {
        "domain": "login.microsoftonline.com",
    }
}

# Define security scheme for Swagger UI
security = HTTPBearer()

@lru_cache(maxsize=10)
def fetch_jwks(tenant_id: str):
    """
    Fetches the JWKS (Public Keys) for a specific tenant and caches the result.
    Works for both CIAM and standard Microsoft Entra ID.
    """
    # 1. Try to get domain from config (legacy support)
    config = TENANT_CONFIGS.get(tenant_id)
    
    if config:
        domain = config["domain"]
        if "ciamlogin.com" in domain:
            jwks_url = f"https://{domain}.ciamlogin.com/{tenant_id}/discovery/v2.0/keys"
        else:
            jwks_url = f"https://{domain}/{tenant_id}/discovery/v2.0/keys"
    else:
        # 2. Default to standard Microsoft Entra ID discovery URL
        jwks_url = f"https://login.microsoftonline.com/{tenant_id}/discovery/v2.0/keys"
    
    try:
        logging.info(f"Fetching JWKS from {jwks_url}")
        response = requests.get(jwks_url)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        logging.error(f"Failed to fetch JWKS from {jwks_url}: {e}")
        return {"keys": []}

def get_public_key(token):
    try:
        # 1. Inspect token header and payload (unverified) to find kid and tid
        unverified_header = jwt.get_unverified_header(token)
        unverified_payload = jwt.decode(token, options={"verify_signature": False})
        tenant_id = unverified_payload.get("tid")
        
        if not tenant_id:
            raise Exception("Token missing tenant ID (tid) claim.")

        # 2. Fetch the correct keys for this specific tenant
        jwks = fetch_jwks(tenant_id)
    except Exception as e:
        logging.error(f"Pre-verification token inspection failed: {e}")
        raise Exception(f"Invalid token structure or unknown tenant: {e}")

    # 3. Find the matching key from the tenant's JWKS
    for key in jwks.get("keys", []):
        if key["kid"] == unverified_header["kid"]:
            return jwt.algorithms.RSAAlgorithm.from_jwk(key)

    logging.error(f"kid {unverified_header.get('kid')} not found in JWKS for tenant {tenant_id}")
    raise Exception("Matching public key not found for token.")


def verify_token(token):
    try:
        # Get the tenant-specific public key
        public_key = get_public_key(token)

        # Decode and verify the token signature and audience
        decoded = jwt.decode(
            token,
            public_key,
            algorithms=["RS256"],
            audience=ALLOWED_CLIENT_IDS,
        )

        return decoded
    except Exception as e:
        logging.error(f"Token verification failed: {e}")
        raise e

def get_current_user(request: Request, token: HTTPAuthorizationCredentials = Depends(security)):
    """
    BYPASS AUTHENTICATION FOR TESTING.
    Returns a mock user instead of verifying the token.
    """
    user_info = {
        "sub": "mock-user-id",
        "email": "test@example.com",
        "tid": "mock-tenant-id",
        "roles": ["SystemAdmin", "TenantAdmin"]
    }
    
    print("\n" + "="*50)
    print("🔓 AUTHENTICATION BYPASSED (TEST MODE)")
    print(f"USER:   {user_info['email']}")
    print("="*50 + "\n")
    
    return user_info

def require_admin(user: dict = Depends(get_current_user)):
    """
    BYPASS ADMIN CHECK FOR TESTING.
    Always returns the user.
    """
    return user
