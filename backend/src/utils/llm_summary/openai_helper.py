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

# Main function to test
def main():
    company_name = "Nvidia"
    business_data = """

Result for for Nvidia:
```json
{
  "industryName": "Semiconductors",
  "stages": [
    {
      "stage": "Research and Development",
      "activities": [
        "Designing graphics processing units (GPUs)",
        "Developing application programming interfaces (APIs) for data science",
        "Creating system on a chip units (SoCs) for mobile and automotive markets",
        "Advancing artificial intelligence (AI) hardware and software",
        "Collaborating on open-source projects like Newton physics engine"
      ],
      "companies": [
        "Google DeepMind",
        "Disney Research",
        "Microsoft"
      ]
    },
    {
      "stage": "Manufacturing",
      "activities": [
        "Outsourcing hardware manufacturing to third-party fabs",
        "Ensuring quality control and testing of manufactured products",
        "Managing supply chain logistics for component sourcing",
        "Implementing sustainable manufacturing practices",
        "Collaborating with manufacturing partners for new technologies"
      ],
      "companies": [
        "Taiwan Semiconductor Manufacturing Company (TSMC)",
        "Samsung Electronics",
        "Micron Technology"
      ]
    },
    {
      "stage": "Marketing and Sales",
      "activities": [
        "Promoting products through social media and events",
        "Developing marketing campaigns for new product launches",
        "Building strategic partnerships with industry leaders",
        "Providing customer support and technical assistance",
        "Engaging in market research to understand consumer needs"
      ],
      "companies": [
        "ASUS",
        "Dell",
        "HP Inc."
      ]
    },
    {
      "stage": "Distribution and Retail",
      "activities": [
        "Managing distribution networks for global reach",
        "Partnering with retailers for product availability",
        "Ensuring timely delivery of products to customers",
        "Providing after-sales support and warranty services",
        "Monitoring inventory levels and supply chain efficiency"
      ],
      "companies": [
        "Best Buy",
        "Newegg",
        "Amazon"
      ]
    }
  ]
}
"""
    
    # Get business summary from OpenAI
    summary = get_openai_valueChain(company_name, business_data)
    
    print("Result:")
    print(summary)

# Run the test
if __name__ == "__main__":
    main()