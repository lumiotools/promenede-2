import requests
import json

# SEC requires a User-Agent header
HEADERS = {"User-Agent": "my_company_bot (+my_email@example.com)"}

def get_company_filings(cik):
    """
    Fetches recent SEC filings for a given company CIK.
    
    :param cik: The 10-digit CIK (including leading zeros)
    :return: JSON response containing recent filings
    """
    url = f"https://data.sec.gov/submissions/CIK{cik}.json"
    response = requests.get(url, headers=HEADERS)
    
    if response.status_code == 200:
        return response.json()
    else:
        print("Error:", response.status_code, response.text)
        return None

def get_company_facts(cik):
    """
    Fetches financial statement data for a given company CIK.
    
    :param cik: The 10-digit CIK (including leading zeros)
    :return: JSON response containing financial statements
    """
    url = f"https://data.sec.gov/api/xbrl/companyfacts/CIK{cik}.json"
    response = requests.get(url, headers=HEADERS)
    
    if response.status_code == 200:
        return response.json()
    else:
        print("Error:", response.status_code, response.text)
        return None

def get_financial_metric(cik, metric="Revenues"):
    """
    Fetches a specific financial metric (e.g., Revenue, Net Income) from SEC filings.
    
    :param cik: The 10-digit CIK (including leading zeros)
    :param metric: The financial metric to retrieve (default: "Revenues")
    :return: Dictionary with available financial data
    """
    data = get_company_facts(cik)
    if data and "us-gaap" in data:
        if metric in data["us-gaap"]:
            return data["us-gaap"][metric]["units"]
        else:
            print(f"Metric '{metric}' not found for CIK {cik}")
    return None

# Example Usage
cik_number = "0001633917"  # PayPal's CIK (must be 10-digit with leading zeros)
filings_data = get_company_filings(cik_number)
financial_data = get_company_facts(cik_number)
revenue_data = get_financial_metric(cik_number, "Revenues")

# Print extracted data
print("\nLatest SEC Filings:\n", json.dumps(filings_data["filings"]["recent"], indent=2))
print("\nFinancial Data:\n", json.dumps(financial_data, indent=2))
print("\nRevenue Data:\n", json.dumps(revenue_data, indent=2))
