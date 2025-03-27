import os
import requests
from dotenv import load_dotenv

# Load environment variables from the .env file
load_dotenv()

# Retrieve the Brandfetch API key from the environment variables
BRANDFETCH_API_KEY = os.getenv("BRANDFETCH_API_TOKEN")

# Base URL for Brandfetch Search API
BRANDFETCH_API_URL = "https://api.brandfetch.io/v2/search/"
def get_first_logo(data):
    # If the data is available
    if data:
        # Return the 'icon' field from the first item in the list
        first_logo = data[0].get("icon", "No logo found")
        return first_logo
    return "No logo found"
# Function to get the company logo
def get_company_logo(company_name):
    # Construct the API URL with the company name
    url = f"{BRANDFETCH_API_URL}{company_name}"
    print("Get company logo of ",company_name)
    
    # Send the GET request to the Brandfetch API
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {BRANDFETCH_API_KEY}"
    }
    
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()  # Raise an error for bad responses (4xx, 5xx)
        
        # Parse the JSON response
        data = response.json()
        # print("data",data)
        logo=get_first_logo(data)
        # Check if logos exist and return the first logo URL
        return logo
    except requests.exceptions.RequestException as e:
        return f"Error fetching logo: {e}"

# Example usage
if __name__ == "__main__":
    company_name = "coca-cola-india"  # Example company name
    logo_url = get_company_logo(company_name)
    print(f"Logo URL for {company_name}: {logo_url}")
