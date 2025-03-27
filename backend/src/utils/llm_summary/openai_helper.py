import os
import json
from dotenv import load_dotenv
import openai
import datetime

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
1. **Business Description**: A brief description of the company, including its history, mission, and vision.
2. **Business Model**: A clear and concise explanation of how the company generates revenue, its core operations, and the key strategies it follows.
3. **Products and Brands**: A list of the major products and brands the company offers.
4. **Customers**: A description of the company's target customers, key demographics, and market segments.

Strictly follow the below JSON format for the response:

```json
{{
       {{
           "business_description": "string", 
           "business_model": "string", 
           "products_brands": "["string", "string", ...]", 
           "customers": ["string", "string", ...]
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

def get_openai_companyTimeline(company_name, business_data):
    time=datetime.datetime.now()
    system_prompt = f"""
You are given the following company timeline for the company: {company_name}.
Todays'time is {time}

Provide the 6 most recent and latest events, milestones, or product launches that have occurred in the company's history.
For each event, provide the following details in a strict JSON format:

1. **Date**: The date or year of the event.
2. **Event**: A brief title or name of the event.
3. **Description**: A short description of the event and its impact on the company.

Strictly follow the below JSON format for the response:

```json
{{
       "company_timeline":{{
           "date": "string", 
           "event": "string", 
           "description": "string", 
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

    1. **Date**: The date the information is for (in yyyy-Month-Day format).
    2. **Revenue**: The revenue for the company in USD or the relevant currency.
    3. **Last Valuation**: The last valuation of the company in USD or the relevant currency.
    4. **Last Funding**: The date of the last funding round and the amount raised (if available).
    5. **Description**: A brief description of the company's financial performance for that date.

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

# Main function to test
def main():
    company_name = "Nvidia"
    business_data = """

Here is the financial information for Nvidia over the last few years, focusing on the most recent data available:

```json
[
  {
    "Date": "2025-02-28",
    "Revenue": "US$130.57 billion",
    "Last Valuation": "Not explicitly stated, but market cap is typically around $1 trillion USD",
    "Last Funding": "Nvidia is a publicly traded company and does not require funding rounds like startups.",
    "Description": "Nvidia reported a significant increase in revenue for FY 2025, driven by strong demand for AI and gaming products."
  },
  {
    "Date": "2024-02-28",
    "Revenue": "US$76.67 billion",
    "Last Valuation": "Market cap around $900 billion USD",
    "Last Funding": "N/A",
    "Description": "Nvidia's FY 2024 revenue was marked by growth in AI and data center segments."
  },
  {
    "Date": "2023-02-28",
    "Revenue": "US$26.97 billion",
    "Last Valuation": "Market cap fluctuated around $500 billion USD",
    "Last Funding": "N/A",
    "Description": "FY 2023 saw a decline in revenue due to challenges in the gaming and consumer markets."
  },
  {
    "Date": "2022-02-28",
    "Revenue": "US$26.91 billion",
    "Last Valuation": "Market cap around $600 billion USD",
    "Last Funding": "N/A",
    "Description": "Nvidia's FY 2022 revenue was stable, with growth in data center and AI segments."
  },
  {
    "Date": "2021-02-28",
    "Revenue": "US$16.68 billion",
    "Last Valuation": "Market cap around $500 billion USD",
    "Last Funding": "N/A",
    "Description": "FY 2021 marked significant growth for Nvidia, driven by gaming and data center demand."
  }
]
```

**Note**: The valuation figures are approximate and based on market capitalization, which can fluctuate. Nvidia, being a publicly traded company, does not engage in funding rounds like startups. The revenue figures are based on fiscal year data, which typically ends in January or February for Nvidia. The most recent financial data available is for FY 2025, with revenue reaching $130.57 billion[2].
"""
    
    # Get business summary from OpenAI
    summary = get_openai_financial_comparables(company_name, business_data)
    
    print("Result:")
    print(summary)

# Run the test
if __name__ == "__main__":
    main()