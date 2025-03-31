import datetime
from src.utils.perplexity.perplexity import ask_perplexity


def generate_perplexity_businessDetail(company_name, user_data):
    """
    Generates a detailed prompt for getting comprehensive information about a company,
    including description, business model, products, brands, and customers.
    """
    # Detailed system prompt to get comprehensive information about the company
    system_prompt = f"""Provide a detailed overview of the {company_name}. Include the following aspects:\n"
        "1. Company Description: A brief overview of the company, its history, and its mission.\n"
        "2. Business Model: An explanation of how the company generates revenue and its core operations.\n"
        "3. Products and Brands: A list of the company's key products, services, and any associated brands.\n"
        "4. Customers: An outline of the company's target customers, market segmentation, and customer demographics.\n"
        "Be detailed and cover each aspect comprehensively."""
    
    print("perplexity business request for ",company_name)
    response = ask_perplexity(system_prompt, user_data)
    return response


def generate_perplexity_companyTimeline(company_name):
    time=datetime.datetime.now()
    time=time.strftime('%Y-%m-%d')

    """
    Generates a detailed prompt for getting the latest timeline of a company,
    focusing on recent milestones, product launches, partnerships, and future plans.
    """
    # Updated system prompt to get the latest company timeline
    system_prompt = f"""Provide a detailed timeline for {company_name}, focusing on the latest developments in the past few years. 
Today's date is {time}

Create a comprehensive timeline with 10-12 unique and significant events from the past 3 years. All dates must follow US standard format (MM/YYYY).

Include a balanced mix of the following categories, with proper dates:

1. Major Product Launches or Updates: New products, services, or significant updates to existing offerings.

2. Business Expansion: Market entries, new office openings, or geographic expansion initiatives.

3. Financial Milestones: Significant funding rounds, revenue achievements, or stock performance events.

4. Acquisitions & Partnerships: Strategic acquisitions, mergers, or key partnership announcements.

5. Leadership Changes: CEO transitions, board appointments, or other executive leadership changes.

6. Innovation & Research: Technological breakthroughs, patents, or R&D achievements.

7. Corporate Social Responsibility: Sustainability initiatives, charitable efforts, or social impact programs.

8. Industry Recognition: Major awards, rankings, or third-party recognition.

9. Operational Changes: Restructuring, new business models, or significant operational improvements.

10. Workforce Developments: Significant hiring milestones, workplace policies, or culture initiatives.

11. Regulatory & Compliance: Key regulatory developments, compliance achievements, or legal milestones.

12. Future Strategy: Announced future plans, roadmaps, or strategic direction shifts.

For each timeline point, include:
- Exact date in MM/YYYY format
- A concise but informative headline
- 1-2 sentences providing context and significance of the event
- When appropriate, include quantitative data (growth percentages, dollar amounts, user numbers)

Focus primarily on verifiable events from the past 5 years, with 1-2 points about announced future plans or upcoming initiatives.
"""

    print(f"Generating 10-12 unique timeline points for {company_name}")
    # Assuming `ask_perplexity` is a function that sends the prompt to the Perplexity API and returns the response.
    response = ask_perplexity(system_prompt, company_name)
    return response

def generate_perplexity_productTimeline(company_name):
    time=datetime.datetime.now()
    time=time.strftime('%Y-%m-%d')
    # print(time)

    """
    Generates a detailed prompt for getting the latest timeline of a company,
    focusing on recent milestones, product launches, partnerships, and future plans.
    """
    # Updated system prompt to get the latest company timeline
    system_prompt = f"""
    Provide a detailed product timeline for the company {company_name}, focusing on the most recent product launches and product-related events in the past 3 years from today
    Today's date is {time}.

    For each product, please include the following details:
    1. **Product Name**: The name of the product.
    2. **Launch Date**: The date or year when the product was launched (e.g., 'yyyy-Month').
    3. **Key Features**: The key features or innovations introduced with this product (if applicable) and also the features of the product.
    4. **Description**: A brief description of the product and its significance.
"""

    print(f"Generating latest product timeline for {company_name}")
    # Assuming `ask_perplexity` is a function that sends the prompt to the Perplexity API and returns the response.
    response = ask_perplexity(system_prompt, company_name)
    return response

def generate_perplexity_MarketLeadership(company_name):
    time=datetime.datetime.now()
    time=time.strftime('%Y-%m-%d')
    # print(time)

    """
    Generates a detailed prompt for getting the latest timeline of a company,
    focusing on recent milestones, product launches, partnerships, and future plans.
    """
    # Updated system prompt to get the latest company timeline
    system_prompt = f"""
    Provide the market leadership data for the company {company_name} over the past 5 years from today in descending order. Focus on the following aspects:
    Today's date is {time}.

    For each year in the past 5 years, please include the following details:
    1. **Date**: The exact date (in 'yyyy-Month' format) of the milestone or event related to the company's market position.
    2. **Industry**: The industry or sector in which the company operates .
    3. **Rank Category**: The rank of the company within its specific category .
    4. **Global Rank**: The global rank of the company based on revenue, market share, or other relevant metrics .
    5. **Description**: A brief description of the company's market leadership, explaining how it achieved its position and what differentiates it from competitors.

"""

    print(f"Generating latest market leadership for {company_name}")
    # Assuming `ask_perplexity` is a function that sends the prompt to the Perplexity API and returns the response.
    response = ask_perplexity(system_prompt, company_name)
    return response

def generate_perplexity_KeyTechnologies(company_name):
    time=datetime.datetime.now()
    time=time.strftime('%Y-%m-%d')
    # print(time)

    """
    Generates a detailed prompt for getting the latest timeline of a company,
    focusing on recent milestones, product launches, partnerships, and future plans.
    """
    # Updated system prompt to get the latest company timeline
    system_prompt = f"""
    Provide the latest 10 key technologies that the company {company_name} is working on or has recently developed or the company uses in descending order. Focus on the following aspects:
    Today's date is {time}.

    For each technology, please provide the following details in a strict JSON format:

    1. **Technology Name**: The name of the technology.
    2. **Description**: A brief description of the technology and its impact on the company's products or services.
    3. **Reported At**: The exact date when the technology was reported or introduced (in 'yyyy-Month' format).
"""

    print(f"Generating latest key technology for {company_name}")
    # Assuming `ask_perplexity` is a function that sends the prompt to the Perplexity API and returns the response.
    response = ask_perplexity(system_prompt, company_name)
    return response

def generate_perplexity_productsServices(company_name):
    time=datetime.datetime.now()
    time=time.strftime('%Y-%m-%d')
    # print(time)

    """
    Generates a detailed prompt for getting the latest timeline of a company,
    focusing on recent milestones, product launches, partnerships, and future plans.
    """
    # Updated system prompt to get the latest company timeline
    system_prompt = f"""
    Provide the latest 20 products or services that the company {company_name} has introduced or is currently offering, in descending order from today. Today's date is {time}.

    For each product or service, please provide the following details in a strict JSON format:

    1. **Product/Service Name**: The name of the product or service.
    2. **Description**: A brief description of the product or service and its impact on the company's portfolio or market position.

    Please ensure that the descriptions are concise but informative, focusing on the latest offerings from the company.
    """

    print(f"Generating products services for {company_name}")
    # Assuming `ask_perplexity` is a function that sends the prompt to the Perplexity API and returns the response.
    response = ask_perplexity(system_prompt, company_name)
    return response

def generate_perplexity_maStrategy(company_name):
    time=datetime.datetime.now()
    time=time.strftime('%Y-%m-%d')
    # print(time)

    """
    Generates a detailed prompt for getting the latest timeline of a company,
    focusing on recent milestones, product launches, partnerships, and future plans.
    """
    # Updated system prompt to get the latest company timeline
    system_prompt = f"""
    Provide all the Mergers and Acquisitions strategy for the company {company_name} over the last 5 years, with the most recent deal first. Today's date is {time}.
    
    For each Mergers and Acquisitions deal, please provide the following details in a strict JSON format:
    
    1. **Deal Name**: The name or title of the deal.
    2. **Description**: A brief description of the deal and its strategic importance to the company.
    3. **Deal Type**: The type of deal (e.g., acquisition, merger, joint venture).
    4. **Deal Date**: The date the deal was announced or completed in (yyyy-Month-Date)
    5. **Deal Value**: The value of the deal in USD or the currency involved.

    Please ensure that the descriptions are concise but informative, focusing on the most important strategic deals of the company.
    """

    print(f"Generating latest ma strategy for {company_name}")
    # Assuming `ask_perplexity` is a function that sends the prompt to the Perplexity API and returns the response.
    response = ask_perplexity(system_prompt, company_name)
    return response

def generate_perplexity_financial_comparables(company_name):
    time = datetime.datetime.now()
    time = time.strftime('%Y-%m-%d')
    
    # System prompt for getting financial comparables
    system_prompt = f"""
    Provide the all financial comparables for the company {company_name} over the last 5 years, with the most recent information first. Today's date is {time}.
    
    For each financial comparable, please provide the following details in a strict JSON format:

    1. **Date**: The date the information is for (in yyyy-Month-Day format).
    2. **Revenue**: The revenue for the company in USD or the relevant currency.
    3. **Last Valuation**: The last valuation of the company in USD or the relevant currency.
    4. **Last Funding**: The date of the last funding round and the amount raised (if available).
    5. **Description**: A brief description of the company's financial performance for that date.

    Please ensure that the descriptions are concise but informative, focusing on the most recent financial information of the company for the last 3 years, sorted in descending order by date.
    """

    print(f"Generating financial comparables for {company_name}")
    # Assuming `ask_perplexity` is a function that sends the prompt to the Perplexity API and returns the response.
    response = ask_perplexity(system_prompt, company_name)
    return response


def generate_perplexity_value_chain(company_name):
    time = datetime.datetime.now()
    time = time.strftime('%Y-%m-%d')
    
    # System prompt for getting the company's value chain
    system_prompt = f"""
    Provide the value chain information for the company {company_name} over its business operations. Today's date is {time}.
    
    The value chain information should be returned in a strict JSON format with the following details:

    1. **industryName**: The name of the industry the company operates in.
    2. **stages**: A list of stages involved in the company's value chain. For each stage, provide:
        - **stage**: The name of the value chain stage (e.g., Research and Development, Manufacturing, Marketing).
        - **activities**: A list of activities involved in that stage. Include a minimum of 4 activities and a maximum of 6.
        - **companies**: A list of companies (by name) involved in each stage. For example, tools used, suppliers, or partners. You should return 3 to 5 companies involved in each stage, not the company's own name, but the companies that contribute to that particular stage.

    Please ensure that the descriptions are concise but informative, focusing on the most important stages and activities within the company's value chain.
    """

    print(f"Generating value chain information for {company_name}")
    # Assuming `ask_perplexity` is a function that sends the prompt to the Perplexity API and returns the response.
    response = ask_perplexity(system_prompt, company_name)
    return response


def generate_perplexity_value_chain(company_name):
    time = datetime.datetime.now()
    time = time.strftime('%Y-%m-%d')
    
    # System prompt for getting the company's value chain
    system_prompt = f"""
    Provide the value chain information for the company {company_name} over its business operations. Today's date is {time}.
    
    The value chain information should be returned in a strict JSON format with the following details:

    1. **industryName**: The name of the industry the company operates in.
    2. **stages**: A list of stages involved in the company's value chain. For each stage, provide:
        - **stage**: The name of the value chain stage (e.g., Research and Development, Manufacturing, Marketing).
        - **activities**: A list of activities involved in that stage. Include a minimum of 4 activities and a maximum of 6.
        - **companies**: A list of companies (by name) involved in each stage. For example, tools used, suppliers, or partners. You should return 3 to 5 companies involved in each stage, not the company's own name, but the companies that contribute to that particular stage.

    Please ensure that the descriptions are concise but informative, focusing on the most important stages and activities within the company's value chain.
    """

    print(f"Generating value chain information for {company_name}")
    # Assuming `ask_perplexity` is a function that sends the prompt to the Perplexity API and returns the response.
    response = ask_perplexity(system_prompt, company_name)
    return response

def generate_perplexity_peer_developments(company_name, competitor_names):
    time = datetime.datetime.now()
    time = time.strftime('%Y-%m-%d')

    # System prompt for getting competitors' details
    system_prompt = f"""
    Provide the details for the company and competitors of the company {company_name}. Today's date is {time}.
    
    For each competitor in the list, please provide the following details in a strict JSON format:

    1. **name**: The name of the competitor company.
    2. **founded_year**: The year the competitor company was founded.
    3. **total_funding**: The total funding raised by the competitor company (in USD or the relevant currency).
    4. **web_traffic**: The estimated web traffic of the competitor company (monthly visits or other relevant metric).

    Please ensure that the descriptions are concise but informative, focusing on the most important details for each competitor.
    """

    competitors_str = ', '.join([company_name] + competitor_names)   # Convert competitor list into a comma-separated string

    print(f"Generating competitor information for {company_name} and competitors: {competitors_str}")
    # Assuming `ask_perplexity` is a function that sends the prompt to the Perplexity API and returns the response.
    response = ask_perplexity(system_prompt, competitors_str)
    print("perplexity peer response",response)
    return response

# Main function to test the company timeline generation
def main():
    company_name = "Paypal"  # You can replace this with any company name you want to analyze.
    
    # Get the timeline summary for the company
    company_timeline = generate_perplexity_peer_developments(company_name,['stripe', 'square', 'wepay', '2checkout', 'paytm'])
    
    # Print the detailed timeline of the company
    print(f"Result for for {company_name}:")
    print(company_timeline)

# Run the test
if __name__ == "__main__":
    main()


