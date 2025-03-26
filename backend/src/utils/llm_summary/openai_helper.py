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

# Main function to test
def main():
    company_name = "Apple"
    business_data = """Here is a detailed timeline of Apple Inc.'s recent product launches and significant product-related events over the past three years, from 2022 to 2025:

## Recent Product Launches

### 1. **iPhone 14 Series**
   - **Launch Date**: 2022-September
   - **Key Features**: 
     - **iPhone 14**: Improved cameras, faster A16 Bionic chip in Pro models, new 48MP main camera, and enhanced video recording capabilities.
     - **iPhone 14 Pro/Pro Max**: Always-On display, Dynamic Island for notifications, and a more efficient A16 Bionic chip.
   - **Description**: The iPhone 14 series marked significant improvements in camera technology and design, with the introduction of the Dynamic Island feature on Pro models.

### 2. **iPad (10th Generation)**
   - **Launch Date**: 2022-October
   - **Key Features**: 
     - Larger 10.9-inch display, USB-C port, and a more powerful A14 Bionic chip.
   - **Description**: This iPad model updated the entry-level iPad with modern features like USB-C and a larger display.

### 3. **Apple Watch Series 8 and Ultra**
   - **Launch Date**: 2022-September
   - **Key Features**: 
     - **Series 8**: Enhanced health features, including temperature sensing for women's health.
     - **Ultra**: Larger 49mm case, longer battery life, and designed for extreme sports.
   - **Description**: The Apple Watch Series 8 focused on health monitoring, while the Ultra model targeted athletes and outdoor enthusiasts.

### 4. **AirPods Pro 2**
   - **Launch Date**: 2022-September
   - **Key Features**: 
     - Improved noise cancellation, longer battery life, and a new H2 chip for better audio quality.
   - **Description**: The second generation of AirPods Pro enhanced audio quality and noise cancellation capabilities.

### 5. **MacBook Air (M2)**
   - **Launch Date**: 2022-June
   - **Key Features**: 
     - New M2 chip for improved performance, larger 13.6-inch display, and a more compact design.
   - **Description**: This MacBook Air model introduced the M2 chip, offering better performance and efficiency.

### 6. **iPhone 15 Series**
   - **Launch Date**: 2023-September
   - **Key Features**: 
     - **iPhone 15 Pro/Pro Max**: New titanium frame, improved cameras, and a faster A17 Bionic chip.
     - **USB-C port** across all models, replacing the Lightning port.
   - **Description**: The iPhone 15 series transitioned to USB-C, aligning with EU regulations, and introduced a titanium frame for Pro models.

### 7. **Apple Vision Pro**
   - **Launch Date**: Announced in 2023, expected release in 2024 or later
   - **Key Features**: 
     - Mixed reality capabilities, advanced eye-tracking technology, and a unique design.
   - **Description**:"""
    
    # Get business summary from OpenAI
    summary = get_openai_productTimeline(company_name, business_data)
    
    print("Result:")
    print(summary)

# Run the test
if __name__ == "__main__":
    main()