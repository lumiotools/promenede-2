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

# Main function to test
def main():
    company_name = "Nvidia"
    business_data = """

Over the last five years, Nvidia has been involved in several strategic partnerships and acquisitions, though specific details on recent M&A deals are limited in the provided search results. However, Nvidia has been actively expanding its technology portfolio through various collaborations and innovations. Here are some notable strategic moves and partnerships, presented in a JSON format for clarity:

```json
[
  {
    "Deal Name": "NVIDIA and Google DeepMind Collaboration on Newton",
    "Description": "NVIDIA collaborates with Google DeepMind and Disney Research to develop Newton, an open-source physics engine for robotics simulation, enhancing robot learning capabilities.",
    "Deal Type": "Joint Venture",
    "Deal Date": "2025-03",
    "Deal Value": "Not disclosed"
  },
  {
    "Deal Name": "NVIDIA Isaac GR00T N1 Announcement",
    "Description": "NVIDIA introduces the Isaac GR00T N1, the world's first open humanoid robot foundation model, to accelerate robotics development.",
    "Deal Type": "Product Launch",
    "Deal Date": "2025-03",
    "Deal Value": "Not disclosed"
  },
  {
    "Deal Name": "NVIDIA's Acquisition of Arm Limited (Failed)",
    "Description": "NVIDIA's proposed acquisition of Arm Limited from SoftBank was terminated in February 2022 due to regulatory hurdles.",
    "Deal Type": "Failed Acquisition",
    "Deal Date": "2022-02",
    "Deal Value": "Approximately $40 billion"
  },
  {
    "Deal Name": "NVIDIA's Acquisition of DeepMap",
    "Description": "NVIDIA acquires DeepMap, a company specializing in high-definition mapping technology for autonomous vehicles.",
    "Deal Type": "Acquisition",
    "Deal Date": "2021-06",
    "Deal Value": "Not disclosed"
  },
  {
    "Deal Name": "NVIDIA's Acquisition of Arm Limited (Announced)",
    "Description": "NVIDIA announces its intention to acquire Arm Limited from SoftBank, aiming to expand its presence in the semiconductor industry.",
    "Deal Type": "Announced Acquisition",
    "Deal Date": "2020-09",
    "Deal Value": "Approximately $40 billion"
  }
]
```

**Note**: The most recent M&A deal involving Nvidia is not explicitly listed in the search results, but the company has been actively involved in strategic partnerships and product launches. The failed acquisition of Arm Limited is one of the most significant M&A attempts in recent years. For more detailed and up-to-date information on Nvidia's M&A activities, additional sources may be necessary.
"""
    
    # Get business summary from OpenAI
    summary = get_openai_maStrategy(company_name, business_data)
    
    print("Result:")
    print(summary)

# Run the test
if __name__ == "__main__":
    main()