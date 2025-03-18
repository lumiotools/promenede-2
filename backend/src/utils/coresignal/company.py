import os
import requests
import json
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Get API Key from environment variable
CORESIGNAL_API_KEY = os.getenv("CORESIGNAL_API_KEY")

BASE_URL = "https://api.coresignal.com/cdapi/v1/professional_network/company"

def get_company_ids(company_name):
    """Fetch all relevant company IDs for a given company name."""
    headers = {
        "Authorization": f"Bearer {CORESIGNAL_API_KEY}",
        "Content-Type": "application/json"
    }
    
    search_url = f"{BASE_URL}/search/filter"
    search_payload = {"name": company_name}
    
    response = requests.post(search_url, json=search_payload, headers=headers)
    print("response id",response.json())
    
    if response.status_code != 200:
        print("Error fetching company details:", response.text)
        return []
    
    try:
        company_ids = response.json()
        if not company_ids:
            print(f"No company found for {company_name}")
            return []
        return company_ids
    except requests.exceptions.JSONDecodeError:
        print("Invalid JSON response received:\n", response.text)
        return []

def get_company_details(company_id):
    """Fetch full company details using the company ID."""
    headers = {
        "Authorization": f"Bearer {CORESIGNAL_API_KEY}",
    }
    
    collect_url = f"{BASE_URL}/collect/{company_id}"
    response = requests.get(collect_url, headers=headers)
    
    if response.status_code != 200:
        print(f"Error fetching details for ID {company_id}:", response.text)
        return None
    
    try:
        return response.json()
    except requests.exceptions.JSONDecodeError:
        print(f"Invalid JSON response for ID {company_id}:\n", response.text)
        return None

if __name__ == "__main__":
    company_name = "https://www.paypal.com/home"

    # Step 1: Get all company IDs
    company_ids = get_company_ids(company_name)

    if company_ids:
        print(f"Found {len(company_ids)} company IDs for {company_name}: {company_ids}")
        
        for company_id in company_ids:
            print(f"Fetching details for Company ID: {company_id}")
            company_data = get_company_details(company_id)
            
            if company_data:
                result = {
                    "company_name": company_name,
                    "company_id": company_id,
                    "company_details": company_data
                }
                
                filename = f"{company_name.replace(' ', '_').lower()}_{company_id}.json"
                with open(filename, "w", encoding="utf-8") as json_file:
                    json.dump(result, json_file, indent=4)
                
                print(f"Company details saved to {filename}")
    else:
        print("No valid company IDs found.")
