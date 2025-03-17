import os
import requests
import json
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Get API Key from environment variable
CORESIGNAL_API_KEY = os.getenv("CORESIGNAL_API_KEY")

BASE_URL = "https://api.coresignal.com/cdapi/v1/professional_network/company"

def get_company_id(company_name):
    """Fetch the most relevant company ID for a given company name."""
    headers = {
        "Authorization": f"Bearer {CORESIGNAL_API_KEY}",
        "Content-Type": "application/json"
    }

    search_url = f"{BASE_URL}/search/filter"
    search_payload = {"name": company_name}

    response = requests.post(search_url, json=search_payload, headers=headers)

    if response.status_code != 200:
        print("Error fetching company details:", response.text)
        return None

    try:
        company_ids = response.json()  # API returns an array of IDs directly
        if not company_ids:
            print(f"No company found for {company_name}")
            return None
        return company_ids[0]  # Return only the first company ID
    except requests.exceptions.JSONDecodeError:
        print("Invalid JSON response received:\n", response.text)
        return None

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
    company_name = "PayPal Holdings Inc"

    # Step 1: Get the first company ID
    company_id = get_company_id(company_name)

    if company_id:
        print(f"Selected Company ID for {company_name}: {company_id}")

        # Step 2: Fetch details using the selected ID
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
        print("No valid company ID found.")
