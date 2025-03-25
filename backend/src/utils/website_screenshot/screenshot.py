import requests
import os
import base64
from dotenv import load_dotenv
load_dotenv()

APIFLASH_API_KEY = os.getenv("APIFLASH_API_KEY")

def get_website_screenshot(website_url):
    
    response = requests.get(
        f"https://api.apiflash.com/v1/urltoimage?access_key={APIFLASH_API_KEY}&wait_until=page_loaded&url={website_url}",
    )
    if response.status_code == 200:
        return base64.b64encode(response.content).decode('utf-8')
    return None