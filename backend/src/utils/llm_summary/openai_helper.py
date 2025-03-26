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
           "descriptoin": "string", 
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
    business_data = """## Detailed Timeline for Apple Inc.

### Recent Milestones (2022-2025)

- **March 2022**: Apple announced the **iPhone SE (3rd generation)** and **iPad Air (5th generation)**, focusing on improved performance and camera capabilities.
- **June 2022**: At the **WWDC 2022**, Apple introduced **iOS 16**, **iPadOS 16**, and **macOS Ventura**, highlighting new features like a redesigned lock screen and enhanced multitasking.
- **September 2022**: Apple launched the **iPhone 14 series**, including the iPhone 14, iPhone 14 Pro, and iPhone 14 Pro Max, with significant camera upgrades and a new notch design.
- **October 2022**: Apple released the **iPad (10th generation)** and **iPad Pro (6th generation)**, featuring improved displays and performance.
- **January 2023**: Apple reported a **record quarterly revenue of $117.15 billion** for Q1 2023, despite global economic challenges.
- **March 2023**: Apple unveiled the **Mac Studio** and **Studio Display**, targeting creative professionals with powerful computing and high-quality display options.
- **June 2023**: At **WWDC 2023**, Apple introduced **iOS 17**, **iPadOS 17**, and **macOS Sonoma**, focusing on AI-driven features and enhanced user experiences.
- **September 2023**: Apple launched the **iPhone 15 series**, featuring new designs, improved cameras, and enhanced durability.
- **October 2023**: Apple released the **iPad (9th generation)** and **iPad Pro (7th generation)**, with updates to performance and display technology.
- **March 2024**: Apple reported a **fiscal year revenue of $391.04 billion**, solidifying its position as a technology leader.
- **September 2024**: Apple announced the **iPhone 16 series**, with a focus on AI capabilities and advanced camera systems.
- **March 2025**: Apple's market capitalization reached over **$3.74 trillion**, maintaining its status as one of the world's most valuable companies.

### Partnerships/Acquisitions

- **2022**: Apple partnered with **TSMC** to develop advanced chip technology, enhancing its semiconductor capabilities.
- **2023**: Apple expanded its partnership with **Major League Baseball (MLB)** to include exclusive streaming rights for Friday Night Baseball, further integrating Apple TV+ into sports broadcasting.
- **2024**: Apple acquired **Miraheze**, a company specializing in AI-driven audio processing, to enhance its audio technology capabilities.

### Company Growth

- **Revenue Growth**: Apple's annual revenue has consistently increased, reaching $391.04 billion in 2024, driven by strong sales of iPhones and services like Apple Music and Apple TV+.
- **Market Share**: Apple remains the largest vendor of mobile phones and tablet computers globally, with significant market share in the personal computer sector.
- **Employee Count**: As of 2024, Apple employs over 180,000 people worldwide, reflecting its expanding operations and product lines.

### Recent Innovations

- **AI Integration**: Apple has been integrating AI across its products, including AI-driven camera features in iPhones and AI-enhanced audio"""
    
    # Get business summary from OpenAI
    summary = get_openai_companyTimeline(company_name, business_data)
    
    print("Result:")
    print(summary)

# Run the test
if __name__ == "__main__":
    main()