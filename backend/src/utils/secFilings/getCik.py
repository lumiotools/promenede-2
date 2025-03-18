import requests

def get_cik_by_company_name(company_name: str):
    """
    Fetches the CIK number of a company from the SEC EDGAR API.
    This will perform a case-insensitive search for the company name.
    """
    # SEC's API endpoint for company tickers
    url = "https://www.sec.gov/files/company_tickers.json"
    
    # Custom headers including the User-Agent
    headers = {
        "User-Agent": "LumioAI-Bot/1.0 (contact: subhajit@teamlumio.ai)"
    }

    # Send the request
    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        # Get the companies dictionary
        companies = response.json()
        
        # Search for the company by title (case insensitive and partial match)
        for key, value in companies.items():
            if company_name.lower() in value['title'].lower():  # Partial match for the name
                return value['cik_str']
        
        print(f"Company '{company_name}' not found.")
        return None
    else:
        print(f"Error {response.status_code}: {response.text}")
        return None

# Example usage:
company_name = "PayPal"  # Company name to search
cik = get_cik_by_company_name(company_name)

if cik:
    print(f"CIK for {company_name}: {str(cik).zfill(10)}")  # Zero-pad the CIK to 10 digits
else:
    print(f"CIK not found for {company_name}.")
