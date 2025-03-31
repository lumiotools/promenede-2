import os
import json
from dotenv import load_dotenv
import openai
import datetime
from concurrent.futures import ThreadPoolExecutor

from src.utils.brandfetch.brandLogo import get_company_logo

# Load environment variables
load_dotenv()

# Get OpenAI API key
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# Initialize OpenAI client
openai.api_key = OPENAI_API_KEY

client = openai.OpenAI(api_key=OPENAI_API_KEY)

def get_openai_business(company_name, business_data):
    system_prompt = f"""
You are given the following company fundamentals and business data for the company: {company_name}.

Please provide a comprehensive summary covering the following areas:

1. **Business Description**: A concise description of the company, including its history, mission, vision, founding details, key milestones, and purpose in the market.

2. **Business Model**: A clear explanation of how the company generates revenue, its core operations, business segments, key strategies, and distribution channels. Include any notable investments (like R&D or innovation), sustainability efforts, or initiatives that differentiate it from competitors.

3. **Products and Brands**: Return a single Markdown-formatted string with **exactly 5 entries**. Format each entry as follows:
   - Start with the product/brand name in bold (using **Name**)
   - Follow with a brief description
   - Ensure each entry is on its own line with proper markdown line breaks
   - Group similar offerings under general categories where appropriate

4. **Customers**: Return a single Markdown-formatted string with **exactly 5 entries**. Format each entry as follows:
   - Start with the customer segment name in bold (using **Segment**)
   - Follow with a brief description of that segment's demographics, industries, or how they use the company's offerings
   - Ensure each entry is on its own line with proper markdown line breaks

Strictly follow the JSON structure below, and ensure proper markdown formatting with line breaks:

```json
{{
  "business_description": "string",
  "business_model": "string",
  "products_brands": "**Product 1** Description for product 1\\n\\n**Product 2** Description for product 2\\n\\n**Product 3** Description for product 3\\n\\n**Product 4** Description for product 4\\n\\n**Product 5** Description for product 5",
  "customers": "**Segment 1** Description for segment 1\\n\\n**Segment 2** Description for segment 2\\n\\n**Segment 3** Description for segment 3\\n\\n**Segment 4** Description for segment 4\\n\\n**Segment 5** Description for segment 5"
}}
```

Ensure that markdown line breaks are properly implemented using double newlines (\\n\\n) between entries so they render as separate paragraphs in markdown. The example format above shows how products and customers should be formatted with proper line breaks.
"""

    response = client.chat.completions.create(
        model="gpt-4o-mini",  # You can use 'gpt-4o-mini' if needed
        response_format={ "type": "json_object" },
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": json.dumps(business_data, indent=2)}
        ]
    )
    
    # Get the response from the model and parse it
    content =json.loads(response.choices[0].message.content)
    return content

def get_openai_companyTimeline(company_name, business_data):
    time=datetime.datetime.now()
    system_prompt = f"""
You are given the following company timeline for {company_name}.
Today's date is {time}

Extract the 10-12 most recent events, milestones, or product launches from the company's history. Focus on significant developments from the past 5 years.

Return ONLY a valid JSON object with the following structure:

```json
{{
  "company_timeline": [
    {{
      "date": "MM/YYYY",
      "event": "Event Title",
      "description": "Concise description of the event and its significance."
    }},
    {{
      "date": "MM/YYYY",
      "event": "Event Title",
      "description": "Concise description of the event and its significance."
    }},
    ...
  ]
}}
```

Requirements:
1. Format all dates in US standard (MM/YYYY) format
2. List events in reverse chronological order (newest first)
3. Ensure each event is unique and significant 
4. Include only factual, verifiable events (no speculative information)
5. Keep descriptions under 200 characters while being informative
6. Ensure the JSON is properly formatted with no syntax errors
7. Return between 10-12 timeline entries, prioritizing the most significant and recent events
8. Sort in Descending Order

DO NOT include any explanatory text outside the JSON structure.
"""

    response = client.chat.completions.create(
        model="gpt-4o-mini",  # You can use 'gpt-4o-mini' if needed
        response_format={ "type": "json_object" },
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": json.dumps(business_data, indent=2)}
        ]
    )
    
    # Get the response from the model and parse it
    content =json.loads(response.choices[0].message.content)
    return content

def get_openai_productTimeline(company_name, business_data):
    time=datetime.datetime.now()
    time=time.strftime('%Y-%m-%d')
    system_prompt = f"""
    You are given the following product timeline for the company: {company_name}, focusing on the last 3 years from today. Today's date is {time}.

    For each product launch or significant product-related event within the past 3 years, provide the following details in a strict JSON format:

    1. **Date**: The exact date (in 'yyyy-Month' format) when the product was launched or the event occurred.
    2. **Product Name**: The name of the product or service that was launched or updated.
    3. **Description**: A concise description of the product, its purpose, and its impact.
    4. **Key Features**: A list of key features of the product, highlighting its main innovations and improvements.

Strictly follow the below JSON format for the response:
```json
{{
       "product_timeline":{{
           "product_name": "string", 
           "date": "string", 
           "description": "string", 
           "key_features":["string","string"...]
       }}

}}
Please ensure the descriptions are concise but informative. """

    response = client.chat.completions.create(
        model="gpt-4o-mini",  # You can use 'gpt-4o-mini' if needed
        response_format={ "type": "json_object" },
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": json.dumps(business_data, indent=2)}
        ]
    )
    
    # Get the response from the model and parse it
    content =json.loads(response.choices[0].message.content)
    return content

def get_openai_marketLeadership(company_name, business_data):
    time=datetime.datetime.now()
    time=time.strftime('%Y-%m-%d')
    system_prompt = f"""
    You are given the market leadership data for the company: {company_name}, focusing on the past 5 years from today. Today's date is {time}.

    For each year in the last 3 years, provide the following details in a strict JSON format:

    1. **Date**: The exact date (in 'yyyy-Month' format) of the milestone or event related to the company's market position.
    2. **Industry**: The industry or sector in which the company operates (e.g., Technology, Healthcare, Finance).
    3. **Rank Category**: The rank of the company within its specific market category (e.g., 'Top 5 in smartphones', 'Top 3 in cloud computing').
    4. **Global Rank**: The company's global rank based on relevant metrics like market share, revenue, or product sales (e.g., 'Ranked #1 globally in smartphone sales').
    5. **Description**: A brief description of the company's market leadership, including key factors that have contributed to its position.
Strictly follow the below JSON format for the response:
```json
{{
       "market_leadership":{{
           "date": "string", 
           "industry": "string", 
           "rank_category": "number", 
           "rank_global":"number",
           "description":"string"
       }}

}}
Please ensure the descriptions are concise but informative. """

    response = client.chat.completions.create(
        model="gpt-4o-mini",  # You can use 'gpt-4o-mini' if needed
        response_format={ "type": "json_object" },
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": json.dumps(business_data, indent=2)}
        ]
    )
    
    # Get the response from the model and parse it
    content =json.loads(response.choices[0].message.content)
    return content

def get_openai_keyTechnology(company_name, business_data):
    time=datetime.datetime.now()
    time=time.strftime('%Y-%m-%d')
    system_prompt = f"""
    You are given the key technologies data for the company: {company_name}. Today's date is {time}.

    For each technology, please provide the following details in a strict JSON format:

    1. **Technology Name**: The name of the technology.
    2. **Description**: A brief description of the technology and its impact on the company's products or services.
    3. **Date**: The exact date when the technology was reported or introduced (in 'yyyy-Month' format).
```json
{{
       "key_technologies":{{
           "date": "string", 
           "technology": "string", 
           "description":"string"
       }}

}}
Please ensure the descriptions are concise but informative. """

    response = client.chat.completions.create(
        model="gpt-4o-mini",  # You can use 'gpt-4o-mini' if needed
        response_format={ "type": "json_object" },
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": json.dumps(business_data, indent=2)}
        ]
    )
    
    # Get the response from the model and parse it
    content =json.loads(response.choices[0].message.content)
    return content

def get_openai_productsServices(company_name, business_data):
    time=datetime.datetime.now()
    time=time.strftime('%Y-%m-%d')
    system_prompt = f"""
    You are given the key products and services data for the company: {company_name}. Today's date is {time}.

      Provide the latest 20 products or services that the company {company_name} has introduced or is currently offering, in descending order from today. Today's date is {time}.

    For each product or service, please provide the following details in a strict JSON format:

    1. **name**: The name of the product or service.
    2. **description**: A brief description of the product or service and its impact on the company's portfolio or market position.

    Please ensure that the descriptions are concise but informative, focusing on the latest offerings from the company.
```json
{{
       "products_services":{{
           "name": "string", 
           "description":"string"
       }}

}}
Please ensure the descriptions are concise but informative. """

    response = client.chat.completions.create(
        model="gpt-4o-mini",  # You can use 'gpt-4o-mini' if needed
        response_format={ "type": "json_object" },
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": json.dumps(business_data, indent=2)}
        ]
    )
    
    # Get the response from the model and parse it
    content =json.loads(response.choices[0].message.content)
    return content

def get_openai_maStrategy(company_name, business_data):
    time=datetime.datetime.now()
    time=time.strftime('%Y-%m-%d')
    system_prompt = f"""
   You are given the M&A (Mergers and Acquisitions) strategy data for the company: {company_name}. Today's date is {time}.

    Provide the latest 10 M&A deals that the company {company_name} has made over the last 3 years, starting from the most recent. Today's date is {time}.

    For each M&A deal, please provide the following details in a strict JSON format:

    1. **Deal Name**: The name or title of the deal.
    2. **Description**: A brief description of the deal and its strategic importance to the company.
    3. **Deal Type**: The type of deal (e.g., acquisition, merger, joint venture).
    4. **Deal Date**: The date the deal was announced or completed in (yyyy-Month-Day format).
    5. **Deal Value**: The value of the deal in USD or the currency involved.

    Please ensure that you return exactly 10 M&A deals from the last 3 years, sorted from the most recent to the oldest. Ensure the format strictly follows the instructions and the information is relevant to the last 3 years only.
JSON Format is:
```json
{{
       "ma_deals": {{
        "deal_name": "string", 
        "description": "string", 
        "deal_type": "string", 
        "deal_date": "yyyy-Month-Day", 
        "deal_value": "string"
    }}

}}
Please ensure the descriptions are concise but informative. """

    response = client.chat.completions.create(
        model="gpt-4o-mini",  # You can use 'gpt-4o-mini' if needed
        response_format={ "type": "json_object" },
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": json.dumps(business_data, indent=2)}
        ]
    )
    
    # Get the response from the model and parse it
    content =json.loads(response.choices[0].message.content)
    return content


def get_openai_financial_comparables(company_name, business_data):
    time=datetime.datetime.now()
    time=time.strftime('%Y-%m-%d')
    system_prompt = f"""
    You are given the financial comparables data for the company: {company_name}. Today's date is {time}.

    Provide the financial comparables for the company {company_name} over the last 5 years, starting from the most recent information first. Today's date is {time}.

    For each financial comparable, please provide the following details in a strict JSON format:

    1. **date**: The date the information is for (in yyyy-Month-Day format).
    2. **revenue**: The revenue for the company in USD or the relevant currency.
    3. **last_valuation**: The last valuation of the company in USD or the relevant currency.
    4. **last_funding**: The date of the last funding round and the amount raised (if available).
    5. **description**: A brief description of the company's financial performance for that date.

    Please ensure that you return the most relevant financial information from the last 5 years, with the most recent information first, sorted in descending order by date. Ensure that the format strictly follows the instructions and the information is relevant to the last 5 years only.

JSON Format is:
```json
{{
    "financial_comparables": {{
        "date": "yyyy-Month-Day", 
        "revenue": "string", 
        "last_valuation": "string", 
        "last_funding": "string", 
        "description": "string"
    }}

}}
Please ensure the descriptions are concise but informative. """

    response = client.chat.completions.create(
        model="gpt-4o-mini",  # You can use 'gpt-4o-mini' if needed
        response_format={ "type": "json_object" },
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": json.dumps(business_data, indent=2)}
        ]
    )
    
    # Get the response from the model and parse it
    content =json.loads(response.choices[0].message.content)
    return content

def fetch_logos_for_companies(companies):
    with ThreadPoolExecutor() as executor:
        # Execute get_company_logo for each company in parallel
        results = list(executor.map(get_company_logo, companies))
    return results

# Helper function to process the value chain and add logos for each company
def process_value_chain_with_logos(value_chain_data):
    # Ensure value_chain_data is a dictionary and contains the 'value_chain' key
    if isinstance(value_chain_data, dict) and "value_chain" in value_chain_data:
        value_chain_data = value_chain_data["value_chain"]

        # Check if 'industryName' and 'stages' are in the value_chain
        if isinstance(value_chain_data, dict) and "industryName" in value_chain_data and "stages" in value_chain_data:
            stages = value_chain_data["stages"]
            
            # Check if 'stages' is a list and iterate over it
            if isinstance(stages, list):
                all_companies = []
                for stage in stages:
                    all_companies.extend(stage["companies"])

                # Fetch logos for companies in parallel
                logos = fetch_logos_for_companies(all_companies)

                # Map logos to the companies
                company_logo_map = {company: logo for company, logo in zip(all_companies, logos)}

                # Add logos to each stage in the value chain data
                for stage in stages:
                    stage['company_logos'] = [company_logo_map.get(company, "No logo found") for company in stage["companies"]]

                # Wrap the result inside a dictionary with 'value_chain' key
                return {"value_chain": value_chain_data}
            else:
                raise ValueError("Invalid structure: 'stages' must be a list.")
        else:
            raise ValueError("Invalid structure: 'value_chain' must have 'industryName' and 'stages' keys.")
    else:
        raise ValueError("Invalid structure: 'value_chain_data' must be a dictionary with a 'value_chain' key.")

def get_openai_valueChain(company_name, business_data):
    time=datetime.datetime.now()
    time=time.strftime('%Y-%m-%d')
    system_prompt = f"""
    You are given the value chain data for the company: {company_name}. Today's date is {time}.

    Provide the value chain information for the company {company_name}, including stages and activities over its business operations. Today's date is {time}.

    For each stage in the value chain, please provide the following details in a strict JSON format:

    1. **Stage**: The name of the value chain stage (e.g., Research and Development, Manufacturing, Marketing).
    2. **Activities**: A list of activities involved in that stage. Include a minimum of 4 activities and a maximum of 6 activities.
    3. **Companies**: A list of companies (by name) involved in each stage. For example, tools used, suppliers, or partners. You should return 3 to 5 companies involved in each stage, not the company's own name, but the companies that contribute to that particular stage.

    Please ensure that you return the most relevant value chain information for the company {company_name}, with the most recent information first, sorted in descending order by date. Ensure that the format strictly follows the instructions and the information is relevant to the company's value chain.

JSON Format is:
```json
{{
    "value_chain": {{
    industryName: string;
    stages{{
    "stage": "string", 
        "activities": ["string", "string", "string", "string", "string", "string"], 
        "companies": ["string", "string", "string", "string", "string"]
    }}
        
    }}
}}
Please ensure the descriptions are concise but informative. """

    response = client.chat.completions.create(
        model="gpt-4o-mini",  # You can use 'gpt-4o-mini' if needed
        response_format={ "type": "json_object" },
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": json.dumps(business_data, indent=2)}
        ]
    )
    
    # Get the response from the model and parse it
    content =json.loads(response.choices[0].message.content)
    processed_data = process_value_chain_with_logos(content)
    return processed_data

def add_logo_to_companies(data):
    # Extract companies_info from the input data
    companies_info = data.get('companies_info', [])

    # Create a function to add the logo to each company info
    def fetch_logo_for_company(company):
        if isinstance(company, dict):  # Ensure it's a dictionary
            logo = get_company_logo(company['name'])
            company['logo'] = logo
            return company
        else:
            print(f"Unexpected data format for company: {company}")
            return company  # Return the company unmodified if not a dictionary
    
    # Use ThreadPoolExecutor to fetch logos in parallel
    with ThreadPoolExecutor() as executor:
        companies_with_logos = list(executor.map(fetch_logo_for_company, companies_info))
    
    # Return the updated structure with the logos added
    data['companies_info'] = companies_with_logos
    return data

def get_openai_peer_developments(company_name, business_data):
    time=datetime.datetime.now()
    time=time.strftime('%Y-%m-%d')
    system_prompt = f"""
You are given the data . Today's date is {time}.

For each company, please provide the following details in a strict JSON format:

1. **name**: The name of the company.
2. **founded_year**: The year the company was founded (approximate).
3. **total_funding**: The total funding raised by the company (approximate).
4. **currency**: The currency of the fundings
5. **web_traffic**: The estimated web traffic for the company (approximate monthly visits).
  
Please ensure that you return the most relevant company data, with the most recent information first, sorted in descending order by date. Ensure that the format strictly follows the instructions and the information is relevant to the company's profile.

JSON Format is:
```json
{{
    "companies_info": {{
        "name": "string", 
        "founded_year": "number", 
        "currency": "string",
        "total_funding": "number", 
        "web_traffic": "number"
    }}
}}
Please ensure the descriptions are concise but informative.
"""

    response = client.chat.completions.create(
        model="gpt-4o-mini",  # You can use 'gpt-4o-mini' if needed
        response_format={ "type": "json_object" },
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": json.dumps(business_data, indent=2)}
        ]
    )
    
    # Get the response from the model and parse it
    content =json.loads(response.choices[0].message.content)
    processedData=add_logo_to_companies(content)
    print("peer developments",processedData)
    return processedData

def add_logo_url_to_competitive_analysis(competitive_analysis_data):
    # Function to fetch the logo for each company using the get_company_logo helper function
    def fetch_logo_for_company(company_name):
        return get_company_logo(company_name)
    
    # Use ThreadPoolExecutor to fetch logos in parallel
    with ThreadPoolExecutor() as executor:
        # Extract company names from the competitive analysis data
        company_names = [entry['company_name'] for entry in competitive_analysis_data['competitive_analysis']]
        
        # Fetch logos in parallel
        logos = list(executor.map(fetch_logo_for_company, company_names))
    
    # Loop through each entry and add the corresponding logo URL
    for idx, entry in enumerate(competitive_analysis_data['competitive_analysis']):
        entry['logo_url'] = logos[idx]  # Assign the fetched logo URL to each entry
    
    return competitive_analysis_data
def get_openai_peer_competitorAnalysis(company_name, business_data):
    # print("hit")
    time=datetime.datetime.now()
    time=time.strftime('%Y-%m-%d')
    system_prompt = f"""

Generate a competitive analysis report for Company: {company_name} based on the input competitor data. You need to create a JSON report with 3 fields for each of the competitors, resulting in a total of 9 entries.

The fields for {company_name} should be determined dynamically based on the company's industry, market focus, or main services. These fields will be specific to {company_name} and should be applied consistently across all competitors.

For example, if {company_name} is a payment processor, the fields could include "Payment Processing", "User Experience", and "Security". If {company_name} is an e-commerce platform, the fields could include "Customer Satisfaction", "Product Selection", and "Supply Chain Efficiency".

For each competitor, include 3 entries—one for each of the fields related to {company_name}'s focus areas. This means you'll generate 9 unique entries in total, with each field being evaluated for each competitor.

Each entry should contain:
1. **Company Name**: The name of the competitor, formatted in the brand's style.
2. **Field**: A key area where {company_name} is focused.
3. **Score**: A score between 0 and 100 indicating the competitor's performance in that field.
4. **Description**: A brief explanation of why the competitor excels in that field.

The **description** should explain what the competitor is doing better in each field and why they excel in that area.

**Strictly Follow This JSON Format for output**:
```json
{{
   "competitive_analysis": [
       {{
           "company_name": "string", // Competitor's name in their brand style
           "field": "string", // Area of expertise (e.g., AI Integration)
           "score": number, // 0-100 score reflecting the competitor's performance
           "description": "string" // Why the competitor excels in this field
       }}
   ]
}}
```"""
    competitors_str = str(business_data)
    response = client.chat.completions.create(
        model="gpt-4o-mini",  # You can use 'gpt-4o-mini' if needed
        response_format={ "type": "json_object" },
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": competitors_str}
        ]
    )
    
    # Get the response from the model and parse it
    content =json.loads(response.choices[0].message.content)
    # print("content",content)
    processedData=add_logo_url_to_competitive_analysis(content)
    return processedData



def get_openai_executive_summary(company_name, business_data):
    # Construct the system prompt
    system_prompt = f"""
You are an AI assistant tasked with generating a concise executive summary for the company "{company_name}" in markdown format string. The summary should be focused on providing key information in a compact format, without extra introductory headers or summaries. Please ensure the content is formatted for a limited vertical space (16:9 aspect ratio) but more horizontal space. The summary should include:

- **Company Overview**: Briefly describe the company's core products and services.
- **Revenue Streams**: List the main sources of revenue (e.g., hardware, software, services).
- **Key Financials**: Include relevant financial metrics 
- **Growth Opportunities**: Mention any areas where the company has potential for growth.
- **Challenges**: Highlight key challenges the company is facing.

The output should be concise and well-structured using markdown with bullet points, ensuring clarity and readability. Keep it short enough to fit a 16:9 aspect ratio display. Donot give any heading and summary. Keep it more descriptive and less points
"""


    # Send request to OpenAI for the executive summary
    response = client.chat.completions.create(
        model="gpt-4o-mini", 
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": json.dumps(business_data, indent=2)}
        ]
    )

    # Extract and return the response
    return response.choices[0].message.content

def get_openai_companyDetail(company_name):
    # print("hit")
    time=datetime.datetime.now()
    time=time.strftime('%Y-%m-%d')
    system_prompt = f"""
    You are an AI assistant tasked with providing key details about the company "{company_name}".
    Today's date is {time}.

    **Objective**:
    - Provide the **CEO's name** of the company.
    - Provide the **incorporation date** of the company.

    **Strictly Follow This JSON Format for output**:
    ```json
    {{
       "company_detail": [
           {{
               "incorporation": "string", // Date of incorporation (e.g., 'YYYY-MM-DD')
               "ceo": "string" // Full name of the current CEO
           }}
       ]
    }}
    ```

    **Notes**:
    - Make sure the output strictly follows the provided JSON format.
    - Use the available data in the `business_data` to retrieve the CEO name and incorporation date.
    """
    response = client.chat.completions.create(
        model="gpt-4o-mini",  # You can use 'gpt-4o-mini' if needed
        response_format={ "type": "json_object" },
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": company_name}
        ]
    )
    
    # Get the response from the model and parse it
    content =json.loads(response.choices[0].message.content)
    return content


# Main function to test
def main():
    company_name = "Nike"
    business_data = """
        "executive_summary": {
            "industry": "Computers and Electronics Manufacturing",
            "topic_tags": [
                "electronics",
                "computers electronics and technology > consumer electronics (in united states)",
                "innovative product development",
                "world-class operations",
                "retail",
                "telephone support",
                "apple",
                "iphone",
                "mac",
                "ipad",
                "apple watch",
                "manufacturing-industrial",
                "technology",
                "application-software",
                "consumer-electronics",
                "consumer-software",
                "wearables",
                "artificial intelligence (ai)",
                "consumer electronics",
                "hardware",
                "mobile devices",
                "operating systems"
            ],
            "valuation": "",
            "equity_funding_total": "",
            "funding_total": "",
            "description": "",
            "financial_highlights": {
                "operating_revenue": [
                    {
                        "value": 391035000000.0,
                        "currency": "USD",
                        "date": "2024-09-28"
                    },
                    {
                        "value": 85777000000.0,
                        "currency": "USD",
                        "date": "2024-06-29"
                    },
                    {
                        "value": 90753000000.0,
                        "currency": "USD",
                        "date": "2024-03-30"
                    }
                ],
                "operating_profit": [
                    {
                        "value": 180683000000.0,
                        "currency": "USD",
                        "date": "2024-09-28"
                    },
                    {
                        "value": 39678000000.0,
                        "currency": "USD",
                        "date": "2024-06-29"
                    },
                    {
                        "value": 42271000000.0,
                        "currency": "USD",
                        "date": "2024-03-30"
                    }
                ],
                "ebitda": [
                    {
                        "value": 123216000000.0,
                        "currency": "USD",
                        "date": "2024-09-28"
                    },
                    {
                        "value": 25352000000.0,
                        "currency": "USD",
                        "date": "2024-06-29"
                    },
                    {
                        "value": 27900000000.0,
                        "currency": "USD",
                        "date": "2024-03-30"
                    }
                ],
                "net_income": [
                    {
                        "value": 93736000000.0,
                        "currency": "USD",
                        "date": "2024-09-28"
                    },
                    {
                        "value": 21448000000.0,
                        "currency": "USD",
                        "date": "2024-06-29"
                    },
                    {
                        "value": 23636000000.0,
                        "currency": "USD",
                        "date": "2024-03-30"
                    }
                ],
                "per": {
                    "value": 38.43256548831337,
                    "closing_price": 233.6699981689453,
                    "eps": 6.08,
                    "date": "2024-10-29"
                }
            }
        },


"""
    
    # Get business summary from OpenAI
    # summary = get_openai_peer_competitorAnalysis(company_name, ['adidas', 'anta', 'asics'])
    summary=get_openai_companyDetail(company_name)
    
    print("Result:")
    # Assuming summary is the dictionary you are working with
    print(summary['company_detail'][0].get("ceo", ""))


# Run the test
if __name__ == "__main__":
    main()