import json
import datetime
from concurrent.futures import ThreadPoolExecutor
from src.utils.openai.openai import chat_with_gpt_json


def fetch_company_data_parallel(company_name, max_tokens=10000, model="gpt-4o-mini"):
    """
    Fetches various company data in parallel using the chat_with_gpt_json helper function.
    
    Args:
        company_name (str): Name of the company
        max_tokens (int): Maximum tokens for GPT response
        model (str): GPT model to use
        
    Returns:
        dict: Combined results from all parallel requests (clean data only)
    """
    print(f"Starting data fetch for company: {company_name}")
    print(f"Using model: {model} with max tokens: {max_tokens}")
    
    current_date = datetime.datetime.now().strftime("%Y-%m-%d")
    
    # Define system prompts for each data type
    launch_timeline_prompt = (
        "You are an AI assistant that provides information about companies in JSON format. "
        "Return product launch timeline for the given company as JSON."
    )
    
    strategic_development_prompt = (
        "You are an AI assistant that provides information about companies in JSON format. "
        "Return strategic development information for the given company as JSON."
    )
    
    strategic_alliances_prompt = (
        "You are an AI assistant that provides information about companies in JSON format. "
        "Return strategic alliances for the given company as JSON."
    )
    
    market_size_prompt = (
        "You are an AI assistant that provides information about companies in JSON format. "
        "Return market size information for the given company's industry as JSON."
    )
    
    value_chain_prompt = (
        "You are an AI assistant that provides information about companies in JSON format. "
        "Return value chain information for the given company as JSON."
    )
    
    leadership_executives_prompt = (
        "You are an AI assistant that provides information about companies in JSON format. "
        "Return information about the leadership and executives of the given company as JSON."
    )
    
    company_strategy_prompt = (
        "You are an AI assistant that provides information about companies in JSON format. "
        "Return detailed company strategy information for the given company as JSON."
    )
    
    # Create content for each request with expected output structure
    launch_timeline_content = (
        f"Company Name: {company_name}\nCurrent Date: {current_date}\n"
        "Please provide the company's product launch timeline as JSON. "
        "Return an array of objects with the following structure: "
        "[{\"productName\": string, \"description\": string, \"referenceLink\": string}]"
    )
    
    strategic_development_content = (
        f"Company Name: {company_name}\nCurrent Date: {current_date}\n"
        "Please provide the company's strategic development information as JSON. "
        "Return an object with the following structure: "
        "{\"strategicFocusGoingForward\": string, \"years\": {\"YYYY\": {\"strategicFocus\": string, "
        "\"initiativesAndAchievements\": [{\"initiativeName\": string, \"description\": string, \"referenceLink\": string}]}}}"
    )
    
    strategic_alliances_content = (
        f"Company Name: {company_name}\nCurrent Date: {current_date}\n"
        "Please provide the company's strategic alliances as JSON. "
        "Return an array of objects with the following structure: "
        "[{\"name\": string, \"description\": string, \"date\": string, \"logo\": string}]"
    )
    
    market_size_content = (
        f"Company Name: {company_name}\nCurrent Date: {current_date}\n"
        "Please provide market size information for the company's industry as JSON. "
        "Return an object with the following structure: "
        "{\"industryName\": string, \"pastYearData\": {\"marketSize\": string, \"cagr\": string, "
        "\"explanation\": string, \"keyIndustryTrends\": [string], \"keyExcerpt\": string}, "
        "\"yearBeforeData\": {\"marketSize\": string, \"cagr\": string, \"explanation\": string, "
        "\"keyIndustryTrends\": [string], \"keyExcerpt\": string}, "
        "\"projectionFor2030\": {\"marketSize\": string, \"cagr\": string, \"explanation\": string, "
        "\"keyIndustryTrends\": [string], \"keyExcerpt\": string}}"
    )
    
    value_chain_content = (
        f"Company Name: {company_name}\nCurrent Date: {current_date}\n"
        "Please provide the company's value chain information as JSON. "
        "Return an object with the following structure: "
        "{\"summary\": string, \"primaryActivities\": [{\"name\": string, \"description\": string}], "
        "\"supportActivities\": [{\"name\": string, \"description\": string}], "
        "\"keyStrengths\": [string], \"keyChallenges\": [string]}"
    )
    
    leadership_executives_content = (
        f"Company Name: {company_name}\nCurrent Date: {current_date}\n"
        "Please provide information about the company's leadership and executives as JSON. "
        "Return an array of objects with the following structure: "
        "[{\"name\": string, \"position\": string, \"since\": string, \"background\": string, "
        "\"achievements\": [string], \"educationalBackground\": string}]"
    )
    
    company_strategy_content = (
        f"Company Name: {company_name}\nCurrent Date: {current_date}\n"
        "Please provide detailed company strategy information as JSON. "
        "Return an object with the following structure: "
        "{\"mission\": string, \"vision\": string, \"coreValues\": [string], "
        "\"businessModel\": string, \"growthStrategy\": string, \"competitiveAdvantage\": string, "
        "\"keyInitiatives\": [{\"name\": string, \"description\": string, \"expectedOutcome\": string}]}"
    )
    
    # Define tasks for parallel execution
    tasks = [
        (launch_timeline_prompt, launch_timeline_content, max_tokens, model, "launch_timeline"),
        (strategic_development_prompt, strategic_development_content, max_tokens, model, "strategic_development"),
        (strategic_alliances_prompt, strategic_alliances_content, max_tokens, model, "strategic_alliances"),
        (market_size_prompt, market_size_content, max_tokens, model, "market_size"),
        (value_chain_prompt, value_chain_content, max_tokens, model, "value_chain"),
        (leadership_executives_prompt, leadership_executives_content, max_tokens, model, "leadership_executives"),
        (company_strategy_prompt, company_strategy_content, max_tokens, model, "company_strategy")
    ]
    
    # Function to be executed in parallel for each task
    def execute_task(task_data):
        system_prompt, content, max_tokens, model, key = task_data
        print(f"Executing task: {key}")
        result = chat_with_gpt_json(
            system_prompt, 
            content, 
            max_tokens, 
            model, 
            column_limit=50
        )
        print(f"Task completed: {key}")
        return result, key
    
    # Create a thread pool for parallel execution
    print(f"Starting parallel execution with {len(tasks)} tasks")
    results = {}
    
    with ThreadPoolExecutor(max_workers=4) as executor:
        # Submit all tasks to the executor
        future_to_key = {executor.submit(execute_task, task): i for i, task in enumerate(tasks)}
        
        # Collect results as they complete
        for future in future_to_key:
            try:
                result, key = future.result()
                print(f"Processing result for {key}")
                
                # Extract only the response data if needed
                if isinstance(result, dict) and "response" in result:
                    # If the response includes metadata, extract just the actual response data
                    clean_result = result["response"]
                else:
                    # If it's already just the data, use it as is
                    clean_result = result
                
                # Add to results dictionary
                results[key] = clean_result
                print(f"Added result for {key}")
                
            except Exception as e:
                task_index = future_to_key[future]
                key = tasks[task_index][4]
                print(f"Error in task {key}: {str(e)}")
                # You might want to re-raise or handle the error differently
                results[key] = {"error": str(e)}
    
    print(f"Data collection complete for {company_name}")
    return results


def fetch_company_data(company_name, max_tokens=10000, model="gpt-4o-mini"):
    """
    Main function to fetch company data.
    This is a simple wrapper around fetch_company_data_parallel for backward compatibility.
    
    Args:
        company_name (str): Name of the company
        max_tokens (int): Maximum tokens for GPT response
        model (str): GPT model to use
        
    Returns:
        dict: Combined results from all parallel requests (clean data only)
    """
    print(f"\n{'='*50}")
    print(f"FETCHING DATA FOR {company_name.upper()}")
    print(f"{'='*50}\n")
    
    try:
        result = fetch_company_data_parallel(company_name, max_tokens, model)
        print(f"\n{'='*50}")
        print(f"DATA FETCH COMPLETED SUCCESSFULLY")
        print(f"{'='*50}\n")
        return result
    except Exception as e:
        print(f"\n{'='*50}")
        print(f"ERROR FETCHING DATA: {str(e)}")
        print(f"{'='*50}\n")
        raise


def clean_api_response(response_data):
    """
    Cleans the API response to extract only the relevant data,
    removing system prompts, tokens used, etc.
    
    Args:
        response_data (dict): The full response from the API
        
    Returns:
        dict: Clean data with only the response content
    """
    clean_data = {}
    
    for key, value in response_data.items():
        if isinstance(value, dict) and "response" in value:
            clean_data[key] = value["response"]
        else:
            clean_data[key] = value
            
    return clean_data


# Example usage:
if __name__ == "__main__":
    # Test with a company name
    company_name = "Tesla"
    print(f"Running example with company: {company_name}")
    
    try:
        # Fetch new data using the simplified, non-async approach
        company_data = fetch_company_data(company_name, 10000, "gpt-4o-mini")
        
        print("\nRESULTS PREVIEW:")
        # Print a preview of each data type
        for key, value in company_data.items():
            print(f"\n{key.upper()}:")
            preview = json.dumps(value, indent=2)[:500]  # First 500 chars
            print(f"{preview}...")
            
    except Exception as e:
        print(f"Error in main execution: {str(e)}")