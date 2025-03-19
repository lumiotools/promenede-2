import os
import requests
from dotenv import load_dotenv
import json

# Load environment variables from .env file
load_dotenv()

# Get the CORESIGNAL API key from the environment
CORESIGNAL_API_KEY = os.getenv("CORESIGNAL_API_KEY")

# Define the headers for the request
headers = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {CORESIGNAL_API_KEY}"
}

def get_company_id(website_url):
    url = f'https://api.coresignal.com/enrichment/companies?website={website_url}&lookalikes=false'
    
    print(f"Making request to CORESIGNAL enrichment API for website: {website_url}")
    
    # Make the first API request
    response = requests.get(url, headers=headers)
    
    print(f"Received response status code: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print("Response JSON data:", json.dumps(data, indent=4))
        
        if 'data' in data and 'id' in data['data']:
            company_id = data['data']['id']
            print(f"Company ID found: {company_id}")
            return company_id
        else:
            print("No ID found in the response data.")
            return None
    else:
        print(f"Error: {response.status_code} - {response.text}")
        return None

def get_company_details(company_id):
    url = f'https://api.coresignal.com/cdapi/v1/multi_source/company/collect/{company_id}'
    
    print(f"Making request to CORESIGNAL multisource API for company ID: {company_id}")
    
    # Make the second API request using the company id
    response = requests.get(url, headers=headers)
    
    print(f"Received response status code: {response.status_code}")
    
    if response.status_code == 200:
        company_details = response.json()
        print("Company details response JSON:", json.dumps(company_details, indent=4))
        return company_details
    else:
        print(f"Error: {response.status_code} - {response.text}")
        return None

def main():
    website_url = 'https://www.paypal.com/home'
    
    # Step 1: Get the company ID from the enrichment API
    company_id = get_company_id(website_url)
    # company_id=7723781
    
    if company_id:
        # Step 2: Get the company details from the multisource API
        company_details = get_company_details(company_id)
        print(company_details)
        
        if company_details:
            # Step 3: Save the data to a JSON file
            with open('company_details.json', 'w') as json_file:
                json.dump(company_details, json_file, indent=4)
            print("Company details saved to company_details.json.")
        else:
            print("Failed to retrieve company details.")
    else:
        print("Failed to retrieve company ID.")

# if __name__ == "__main__":
#     main()
