import os
from supabase import create_client, Client
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables from the root .env file
root_env_path = Path(__file__).parent.parent / '.env'
load_dotenv(dotenv_path=root_env_path, override=True)

# Try reading backend specific vars, fallback to frontend vars if not defined
url: str = os.environ.get("SUPABASE_URL") or os.environ.get("VITE_SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY") or os.environ.get("VITE_SUPABASE_ANON_KEY")

if not url or not key:
    raise ValueError("Supabase URL and Key must be provided in the .env file")

supabase: Client = create_client(url, key)
