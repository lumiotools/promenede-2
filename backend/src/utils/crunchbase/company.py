import os
import requests
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

def get_organization_data(company_name: str):
    """
    Fetches organization data from Crunchbase using the API.
    The company name is dynamically set and converted to lowercase.
    """
    # Get the API key from environment variables
    api_key = os.getenv("CRUNCHBASE_API_KEY")
    
    if not api_key:
        print("Error: CRUNCHBASE_API_KEY not found in environment variables.")
        return
    
    # Format the company name (convert to lowercase)
    company_name = company_name.lower()

    # Construct the URL
    url = f'https://api.crunchbase.com/v4/data/entities/organizations/{company_name}?card_ids=fields'
    
    # Set the headers for the request
    headers = {
        'X-cb-user-key': api_key,
        'accept': 'application/json'
    }

    # Send GET request to Crunchbase API
    response = requests.get(url, headers=headers)

    # Check the response status
    if response.status_code == 200:
        # Print the response data (JSON format)
        print("Organization Data:", response.json())
    else:
        print(f"Error {response.status_code}: {response.text}")

# Example usage: Call the function with the desired company name
get_organization_data('PayPal')  # You can change the company name here
