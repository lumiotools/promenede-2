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

# Main function to test
def main():
    company_name = "Apple"
    business_data = """

Here is the market leadership data for Apple Inc. over the past three years, focusing on the specified aspects:

### 2024
- **Industry**: Technology Hardware, Storage & Peripherals
- **Rank Category**: Largest vendor of mobile phones and tablet computers
- **Global Rank**: Largest technology company by revenue
- **Description**: In 2024, Apple maintained its position as the largest technology company by revenue, with $391.04 billion in revenue. It continued to lead as the largest vendor of mobile phones and tablet computers, driven by the success of its iPhone and iPad lines. Apple's strong brand loyalty and innovative products, such as the Apple Watch and AirPods, contributed to its market leadership.

### 2023
- **Industry**: Technology Hardware, Storage & Peripherals
- **Rank Category**: Largest vendor of mobile phones and tablet computers
- **Global Rank**: Largest company by market capitalization
- **Description**: In 2023, Apple was the largest company by market capitalization and maintained its dominance in the mobile phone and tablet markets. Its ecosystem of interconnected devices and services, including Apple Music and Apple TV+, further solidified its market position. The company's focus on innovation and user experience helped it stay ahead of competitors.

### 2022
- **Industry**: Technology Hardware, Storage & Peripherals
- **Rank Category**: Largest vendor of mobile phones and tablet computers
- **Global Rank**: Among the top companies by market capitalization
- **Description**: In 2022, Apple continued to be a leader in the technology sector, with significant market share in mobile phones and tablets. Its strong brand and continuous innovation in products like the iPhone and Mac helped maintain its position. Apple's services segment, including Apple Music and Apple TV+, also contributed to its market leadership by providing a comprehensive ecosystem for users.

### 2021
- **Industry**: Technology Hardware, Storage & Peripherals
- **Rank Category**: Largest vendor of mobile phones and tablet computers
- **Global Rank**: Among the top companies by market capitalization
- **Description**: In 2021, Apple remained a dominant force in the technology industry, driven by the success of its hardware products and expanding services. The company's ability to integrate its devices and services seamlessly enhanced user experience, contributing to its market leadership.

### 2020
- **Industry**: Technology Hardware, Storage & Peripherals
- **Rank Category**: Largest vendor of mobile phones and tablet computers
- **Global Rank**: Among the top companies by market capitalization
- **Description**: In 2020, Apple continued to lead in the technology sector, with its iPhone and iPad sales driving revenue growth. The company's focus on innovation and its expanding services segment helped maintain its market position despite global challenges like the COVID-19 pandemic.

For the years beyond the past three, Apple has consistently been a leader in the technology industry, with significant market capitalization and revenue. However, specific detailed rankings for each year beyond 2022 are not provided in the search results. 

### Additional Notes
- **Market Capitalization**: As of December 2024, Apple was valued at over $3.74 trillion, making it one of the most valuable companies globally[2].
- **Revenue and Market Share**: Apple's revenue and market share in various categories have consistently positioned it as a leader in the technology sector[2][3].
"""
    
    # Get business summary from OpenAI
    summary = get_openai_marketLeadership(company_name, business_data)
    
    print("Result:")
    print(summary)

# Run the test
if __name__ == "__main__":
    main()