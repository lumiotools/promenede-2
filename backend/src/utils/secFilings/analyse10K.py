import requests
import json
import time
from bs4 import BeautifulSoup
from src.utils.openai.openai import chat_with_gpt_json
import re
import concurrent.futures

# SEC API Headers
HEADERS = {
    "User-Agent": "LumioAI-Bot/1.0 (contact: subhajit@teamlumio.ai)"
}

# SYSTEM PROMPTS for GPT Analysis
PROMPTS = {
    "firmographic": """Extract the following details from the given 10-K filing:
- Company Name
- Incorporation Details (State, Fiscal Year End, IRS ID)
- Headquarters Address (Street, City, State, Zip)
- CEO Name (include full name and any titles)
- Revenue (Annual, include currency symbol and specify millions/billions, e.g., "$500 million")
- Full-Time Employees (FTE, include exact number if available)
- Products/Services Offered (include a brief 1-2 sentence description for each major product/service)

For all numerical values, include the currency symbol (e.g., $, €, £) and specify the magnitude (e.g., millions, billions).
Return the response in JSON format.""",

    "key_financials": """Extract the following financial metrics from the given 10-K filing:
- Operating Revenue (include currency symbol and magnitude, e.g., "$2.5 billion")
- Operating Profit (include currency symbol and magnitude, e.g., "$500 million")
- EBITDA (include currency symbol and magnitude)
- Profit After Tax (PAT) (include currency symbol and magnitude)
- Price-to-Earnings Ratio (PER, only if public, include the exact ratio number)
- Revenue Growth Percentage (include the % symbol and time period, e.g., "15% year-over-year")
- Number of Users/Customers (if available, include exact numbers and growth trends)
- Gross Margin Percentage (include the % value)
- Market Capitalization (if available, include currency symbol and magnitude)

For each metric, include which fiscal year or period it applies to. Always include the currency symbol and specify whether values are in thousands, millions, or billions.
Return the response in JSON format.""",

    "shareholders": """Extract the top shareholders and their shareholding details from the given 10-K filing.
Return the response in JSON format with fields:
- Shareholder Name
- Number of Shares (include exact figure if available)
- Percentage Ownership (include % of total)
- Type of Shareholder (Institutional, Insider, Retail)
- Position/Relation (for insiders, specify their position in the company)
- Value of Holding (if available, include currency symbol and magnitude)
- Voting Rights (if different from economic rights)
- Notable Changes (any significant recent changes in shareholding)

Include any additional information available about major shareholders, such as when they acquired their stake or any special rights they may have.
Return the response in JSON format.""",

    "company_overview": """Extract the following company details from the 10-K:
- Business Model (provide a concise 2-3 sentence explanation)
- Products and Brands (list each major product/brand with a brief description, market position, and key features)
- Key Customers (include customer names, sectors, and approximate percentage of revenue if available)
- Market Segments (identify the key market segments the company operates in)
- Competitive Advantages (what the company cites as its differentiators)
- Geographic Presence (key regions/countries where the company operates)

For products and brands, include not just the name but also what each product does, its target market, and any notable performance metrics.
Return the response in JSON format.""",

    "financial_summary": """Provide a structured financial summary for the last 3 years, including:
- Annual Revenue (include currency symbol, magnitude, and year-over-year change, e.g., "$5.2 billion in 2023, up 7% from 2022")
- Net Income/Profit (include currency symbol, magnitude, and year-over-year change)
- Gross Margin Percentages (for each year with % symbol)
- Operating Expenses (include currency symbol and magnitude, broken down by major categories if available)
- Cash Flow from Operations (include currency symbol and magnitude)
- Capital Expenditures (include currency symbol and magnitude)
- Research & Development Spending (include currency symbol and magnitude)
- Debt Levels (include currency symbol, magnitude, and any significant changes)
- Earnings Per Share (include currency symbol and exact figure)

Present this information for each of the last 3 fiscal years, with exact figures including currency symbols (e.g., $, €, £) and specifying whether values are in thousands, millions, or billions.
Return the response in JSON format with a separate object for each fiscal year.""",

    "market_landscape": """Extract the competitive market position of the company from the 10-K.
Return key details like:
- Competitive Position (include market share percentages if available and ranking among competitors)
- Major Competitors (name specific competitors and their relative strengths)
- Industry Leadership (specific areas where the company leads or has advantages)
- Market Size (include total addressable market with currency and magnitude, e.g., "$50 billion market")
- Market Growth Rate (include percentages and time periods)
- Market Trends (include specific trends with supporting data where available)
- Technology Disruptions (how emerging technologies are affecting the market)
- Geographical Market Distribution (key regions and their importance)

For each point, include specific data points, metrics, and examples from the filing rather than general statements.
Return the response in JSON format.""",

    "mna_details": """Extract details of recent mergers and acquisitions (M&A) from the 10-K filing.
Return key details such as:
- Recent Acquisitions (company names, dates, and acquisition values with currency and magnitude)
- M&A Strategy (stated strategic objectives for acquisitions)
- Key Acquisition Highlights (what capabilities, technologies, or market access was gained)
- Integration Status (progress of integrating acquired companies)
- Financial Impact (how acquisitions affected revenue, costs, or profitability)
- Goodwill and Intangibles (amounts recognized from acquisitions with currency and magnitude)
- Failed or Cancelled Acquisitions (if mentioned)
- Future M&A Plans or Focus Areas (if indicated)

Include the specific purchase price for each acquisition with currency symbol and magnitude (e.g., "$750 million").
Return the response in JSON format.""",

    "regulatory_risks": """Extract key regulatory risks from the 10-K filing, including:
- Compliance and Legal Issues (specific regulations, laws, or pending legislation)
- Industry Regulations (sector-specific rules and their potential impact)
- Business Risks (regulatory factors that could impact operations)
- Privacy and Data Protection (specific laws like GDPR, CCPA with potential impact)
- International Regulatory Exposure (country-specific regulatory challenges)
- Ongoing Investigations or Litigation (any significant regulatory actions or lawsuits)
- Environmental Regulations (climate-related rules or sustainability requirements)
- Financial Reporting Requirements (accounting standards changes or compliance issues)

For each risk, include specific regulations by name, potential financial impact if quantified, and any mitigation strategies mentioned.
Return the response in JSON format.""",

    "opportunities_risks": """Extract strategic growth opportunities and risks from the 10-K filing.
Return details on:
- Growth Opportunities (specific new markets, products, or services with potential size in currency and magnitude)
- Key Market Risks (specific threats with potential impact quantified where possible)
- Technology Opportunities (emerging technologies the company is leveraging)
- Technology Risks (disruptive technologies that could negatively impact the business)
- Geographic Expansion Plans (specific regions with market size and growth potential)
- Geographic Risks (political, economic, or social challenges in key markets)
- Competitive Pressures (specific competitors or new entrants posing threats)
- Product Innovation Pipeline (new offerings in development with expected launch timelines)
- Customer Concentration Risk (percentage of revenue from top customers)
- Supply Chain Opportunities and Risks (including dependencies and diversification efforts)

For each item, include specific metrics, timelines, and financial projections where available with proper currency symbols and magnitude indicators (millions/billions).
Return the response in JSON format."""
}

# Executive Summary Prompt
EXECUTIVE_SUMMARY_PROMPT = """
Based on the following structured data extracted from a 10-K filing, generate a comprehensive executive summary of the company.

The summary should be approximately 500-750 words and include:
1. A brief company overview (what they do, where they operate, scale of operations)
2. Key financial highlights and performance (revenue, profit, growth trends)
3. Main products/services and market position
4. Major competitive advantages and challenges
5. Key strategic opportunities and risks
6. Recent M&A activity (if applicable)
7. Regulatory considerations
8. Future outlook

Focus on the most important insights from each section. Use specific data points with proper currency symbols and magnitude indicators. Structure the summary in clear paragraphs with a logical flow.

DATA:
{data}

Return the response as a JSON object with a single key "executive_summary" containing the summary text.
"""

def get_latest_10K_url(cik):
    """Fetches the latest 10-K filing URL from SEC."""
    url = f"https://data.sec.gov/submissions/CIK{cik}.json"
    
    try:
        response = requests.get(url, headers=HEADERS)
        response.raise_for_status()

        data = response.json()
        filings = data["filings"]["recent"]

        for i, form in enumerate(filings["form"]):
            if form == "10-K":
                accession_number = filings["accessionNumber"][i].replace("-", "")
                document = filings["primaryDocument"][i]
                filing_url = f"https://www.sec.gov/Archives/edgar/data/{cik}/{accession_number}/{document}"
                return filing_url

    except requests.exceptions.RequestException as e:
        print(f"Error fetching 10-K: {e}")
    
    return None


def extract_10K_text(filing_url):
    """Downloads and extracts text from the 10-K filing."""
    print(f"Downloading 10-K from: {filing_url}")

    # Respect SEC rate limits
    time.sleep(2)

    try:
        response = requests.get(filing_url, headers=HEADERS)
        response.raise_for_status()

        # Parse HTML and extract clean text
        soup = BeautifulSoup(response.text, "html.parser")
        text_content = soup.get_text(separator="\n", strip=True)

        return text_content

    except requests.exceptions.RequestException as e:
        print(f"Failed to download 10-K: {e}")
        return None


def clean_gpt_json_response(response_data):
    """Extracts and cleans the JSON response from GPT and fixes malformed JSON."""
    if not response_data:
        return {}

    # Check if response_data is already a dictionary with a "response" key
    if isinstance(response_data, dict):
        if "response" in response_data:
            # If response is already a dictionary, return it directly
            if isinstance(response_data["response"], dict):
                return response_data["response"]
            
            # If response is a string, try to parse it as JSON
            elif isinstance(response_data["response"], str):
                raw_json_response = response_data["response"]
            else:
                print(f"Unexpected response format: {type(response_data['response'])}")
                return {}
        else:
            # If the dictionary doesn't have a "response" key, return it as is
            return response_data
    else:
        # If response_data is a string, try to parse it directly
        raw_json_response = response_data

    # If we have a string response, clean and parse it
    if isinstance(raw_json_response, str):
        # Remove markdown formatting (```json ... ```)
        if "```json" in raw_json_response and "```" in raw_json_response:
            cleaned_json_response = raw_json_response.split("```json", 1)[1].split("```", 1)[0].strip()
        elif raw_json_response.startswith("```") and raw_json_response.endswith("```"):
            cleaned_json_response = raw_json_response.strip("```").strip()
        else:
            cleaned_json_response = raw_json_response.strip()

        try:
            return json.loads(cleaned_json_response)  # Convert to dictionary
        except json.JSONDecodeError as e:
            print(f"JSON Decode Error: {e}. Attempting auto-correction...")

            # **Fix Common JSON Errors**
            # 1. Replace single quotes with double quotes (for property names)
            cleaned_json_response = re.sub(r"(?<!\\)'", '"', cleaned_json_response)

            # 2. Ensure property names are enclosed in double quotes
            cleaned_json_response = re.sub(r'(\w+):', r'"\1":', cleaned_json_response)

            try:
                return json.loads(cleaned_json_response)
            except json.JSONDecodeError as e:
                print(f"Failed to auto-correct JSON: {e}")
                return {"error": "Failed to parse response", "raw_text": raw_json_response[:500] + "..."}
    
    # Fallback in case we can't determine the type
    print(f"Unhandled response type: {type(raw_json_response)}")
    return {}


def process_section(section, prompt, text_content):
    """Process a single section with GPT"""
    print(f"Processing: {section}")
    try:
        # Add JSON format instruction to system prompt
        system_prompt = prompt + "\n\nYour response must be in valid JSON format."
        response = chat_with_gpt_json(system_prompt, text_content)
        return section, clean_gpt_json_response(response)
    except Exception as e:
        print(f"Error processing section {section}: {e}")
        return section, {"error": f"Failed to process: {str(e)}"}


def generate_executive_summary(extracted_data):
    """Generate an executive summary based on all extracted data"""
    print("Generating executive summary...")
    
    try:
        # Format the data as a simplified JSON string for the summary prompt
        data_json = json.dumps(extracted_data, indent=2)
        
        # Create the prompt with the data embedded
        summary_prompt = EXECUTIVE_SUMMARY_PROMPT.format(data=data_json)
        
        # Call GPT to generate the summary
        system_prompt = "You are a financial analyst assistant. Create a concise but comprehensive executive summary based on the provided 10-K data."
        response = chat_with_gpt_json(system_prompt, summary_prompt)
        
        # Extract and clean the summary
        summary_data = clean_gpt_json_response(response)
        
        # Check if we have the executive_summary key
        if "executive_summary" in summary_data:
            return summary_data["executive_summary"]
        else:
            # If the response doesn't have the key, return the whole response
            return summary_data
            
    except Exception as e:
        print(f"Error generating executive summary: {e}")
        return {"error": f"Failed to generate executive summary: {str(e)}"}


def analyze_10K_filing(cik, max_workers=5, generate_summary=True):
    """
    Extracts structured data from the 10-K using GPT with parallel processing.
    
    Args:
        cik (str): Company CIK number
        max_workers (int): Maximum number of parallel API calls
        generate_summary (bool): Whether to generate an executive summary
        
    Returns:
        dict: Extracted data from 10-K filing with optional executive summary
    """
    filing_url = get_latest_10K_url(cik)
    if not filing_url:
        print("No recent 10-K filing found.")
        return None

    text_content = extract_10K_text(filing_url)
    if not text_content:
        print("Failed to extract 10-K text.")
        return None

    extracted_data = {"company": {}, "sections": {}}

    # Process sections in parallel
    with concurrent.futures.ThreadPoolExecutor(max_workers=max_workers) as executor:
        # Submit all tasks and create a mapping of futures to section names
        future_to_section = {
            executor.submit(process_section, section, prompt, text_content): section
            for section, prompt in PROMPTS.items()
        }
        
        # Process results as they complete
        for future in concurrent.futures.as_completed(future_to_section):
            section, result = future.result()
            extracted_data["sections"][section] = result

    # Add metadata
    extracted_data["company"]["ticker"] = cik
    extracted_data["company"]["cik"] = cik
    extracted_data["filing_url"] = filing_url
    
    # Generate executive summary if requested
    if generate_summary:
        summary = generate_executive_summary(extracted_data)
        extracted_data["executive_summary"] = summary
    
    return extracted_data


# Example Usage
if __name__ == "__main__":
    cik_number = "0001633917"  # PayPal's CIK
    
    # Get the data with executive summary
    company_data = analyze_10K_filing(cik_number, generate_summary=True)
    
    # Save to JSON file
    if company_data:
        output_file = "company_profile.json"
        with open(output_file, "w", encoding="utf-8") as f:
            json.dump(company_data, f, indent=2)
        print(f"Company profile saved as {output_file}")
        
        # Print executive summary
        if "executive_summary" in company_data:
            print("\n==== EXECUTIVE SUMMARY ====\n")
            if isinstance(company_data["executive_summary"], str):
                print(company_data["executive_summary"])
            else:
                print(json.dumps(company_data["executive_summary"], indent=2))