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
# Main function to test
def main():
    company_name = "Apple"
    business_data = """

As of 2025, Apple Inc. is continuously innovating and expanding its technological offerings. While specific details on the latest technologies might not be fully disclosed, here are ten key technologies Apple has been working on or has recently developed, focusing on publicly available information:

```json
[
  {
    "Technology Name": "Apple Intelligence",
    "Description": "A new AI-driven feature set expected to enhance user experience across Apple devices, potentially integrating AI capabilities into various products.",
    "Reported At": "2025-March"
  },
  {
    "Technology Name": "AirPods Pro 2 with Hearing Aid and Hearing Test Features",
    "Description": "An update to AirPods Pro 2 that includes features for hearing aid compatibility and hearing tests, enhancing accessibility.",
    "Reported At": "2024-September"
  },
  {
    "Technology Name": "Active Noise Cancellation in AirPods 4",
    "Description": "An advancement in noise cancellation technology for AirPods, improving audio quality and user experience.",
    "Reported At": "2024-September"
  },
  {
    "Technology Name": "Apple Vision Pro",
    "Description": "A mixed reality headset that combines AR and VR capabilities, marking Apple's entry into the immersive technology market.",
    "Reported At": "2023-June"
  },
  {
    "Technology Name": "M2 Ultra Chip",
    "Description": "A powerful chip designed for high-performance computing, used in Mac products like the Mac Studio.",
    "Reported At": "2023-January"
  },
  {
    "Technology Name": "Apple M1 Ultra Chip",
    "Description": "A high-performance chip for Mac products, offering enhanced processing and graphics capabilities.",
    "Reported At": "2022-March"
  },
  {
    "Technology Name": "Apple Watch Series 8 with Crash Detection",
    "Description": "A feature that detects severe car crashes and automatically contacts emergency services, enhancing safety.",
    "Reported At": "2022-September"
  },
  {
    "Technology Name": "Apple M2 Chip",
    "Description": "A second-generation chip for Mac and iPad products, offering improved performance and efficiency.",
    "Reported At": "2022-June"
  },
  {
    "Technology Name": "Apple M1 Pro and M1 Max Chips",
    "Description": "High-performance chips designed for professional-grade Mac products, offering enhanced processing and graphics capabilities.",
    "Reported At": "2021-October"
  },
  {
    "Technology Name": "Apple M1 Chip",
    "Description": "A revolutionary chip marking Apple's transition to in-house silicon for Mac products, enhancing performance and efficiency.",
    "Reported At": "2020-November"
  }
]
```

These technologies highlight Apple's focus on AI, chip design, augmented reality, and enhanced user experiences across its product lineup. However, note that some of these technologies might not be the very latest, as Apple often announces new developments at specific events like WWDC or product launches.
"""
    
    # Get business summary from OpenAI
    summary = get_openai_keyTechnology(company_name, business_data)
    
    print("Result:")
    print(summary)

# Run the test
if __name__ == "__main__":
    main()