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
    system_prompt = f"""Provide a detailed timeline for the company {company_name}, focusing on the latest developments in the past few years. 
    Today's time is {time}
    Include the following aspects and also mention the proper dates with years and months:
        1. Recent Milestones: Key milestones in the last 3 years with months (e.g., product launches, market expansions, revenue growth).
        2. Partnerships/Acquisitions: Any major acquisitions or partnerships in recent years and their impact on the business.
        3. Company Growth: Information about the company's growth in the last few years in terms of market share, revenue, or employee count.
        4. Recent Innovations: Any recent innovations in products, services, or technology.
        5. Future Outlook: A look at the company's strategy or plans for the next few years (e.g., new products, markets, technology developments, sustainability efforts).
        6. Other Timeline: Cover some of the other notable timeline of the company in the recent 3 years
        Be detailed and focus primarily on the last 3 years, with an outlook for the future. """

    print(f"Generating latest company timeline for {company_name}")
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


# Main function to test the company timeline generation
def main():
    company_name = "Apple Inc."  # You can replace this with any company name you want to analyze.
    
    # Get the timeline summary for the company
    company_timeline = generate_perplexity_KeyTechnologies(company_name)
    
    # Print the detailed timeline of the company
    print(f"Company Timeline for {company_name}:")
    print(company_timeline)

# Run the test
if __name__ == "__main__":
    main()


