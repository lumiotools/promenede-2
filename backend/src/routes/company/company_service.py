from concurrent.futures import ThreadPoolExecutor, as_completed
import os

from src.routes.company.company_processor import prepare_company_response
from src.utils.coresignal.company import get_company_details, get_company_id
from src.utils.crunchbase.company import get_organization_data
from src.utils.yahoo.shareholder import get_shareholder_info
from src.utils.brandfetch.brandLogo import get_company_logo
from src.utils.llmInfo.llm import fetch_company_data as fetch_llm_company_data
from src.utils.contactout.people import get_people_experience_and_education
from src.utils.website_screenshot.screenshot import get_website_screenshot
from src.routes.company.llmhelpers import enrich_data_parallel

# Maximum number of concurrent workers for thread pools
max_workers = 10

async def fetch_company_data(company_name, company_url):
    """
    Orchestrates the fetching of company data from various sources and compiles the response.
    """
    # Initialize default empty structures to avoid NoneType errors
    coresignal_data = {}
    crunchbase_data = {"cards": {"fields": {}}}
    yahooData = {}
    company_image_url = ""
    
    # Try to get CoreSignal data
    try:
        company_enrichment_id = get_company_id(company_url)
        print("enrichment id", company_enrichment_id)
        if company_enrichment_id:
            coresignal_data = get_company_details(company_enrichment_id) or {}
            # coresignal_data = convert_null_to_none(coresignal_data)
    except Exception as e:
        print(f"Error getting CoreSignal data: {e}")
        coresignal_data = {}
    
    if not coresignal_data:
        print("No CoreSignal data found")
    
    # Try to get company name from either source
    if coresignal_data and coresignal_data.get("company_name"):
        company_name = coresignal_data.get("company_name", company_name)
    
    company_full_url = coresignal_data.get("website", "")
    
    # Execute the functions concurrently
    with ThreadPoolExecutor() as executor:
        # Define the functions to fetch data
        def fetch_crunchbase_data():
            try:
                crunchbase_url = coresignal_data.get("crunchbase_url", "")
                if crunchbase_url:
                    crunchbase_company_name = crunchbase_url.split("/")[-1]
                    print("crunchbase url", crunchbase_url, " Company name", crunchbase_company_name)
                    return get_organization_data(crunchbase_company_name) or {"cards": {"fields": {}}}
                else:
                    # Fallback to original company name
                    return get_organization_data(company_name) or {"cards": {"fields": {}}}
            except Exception as e:
                print(f"Error getting Crunchbase data: {e}")
                return {"cards": {"fields": {}}}
        
        def fetch_company_logo():
            try:
                return get_company_logo(company_name)
            except Exception as e:
                print(f"Error getting company logo: {e}")
                return ""
        
        # Start the operations and map them to their futures
        future_to_data = {
            executor.submit(fetch_crunchbase_data): "crunchbase",
            executor.submit(fetch_company_logo): "logo"
        }
        
        # Collect results as they complete
        for future in as_completed(future_to_data):
            data_type = future_to_data[future]
            try:
                if data_type == "crunchbase":
                    crunchbase_data = future.result()
                    print("crunchbase data", crunchbase_data)
                    
                    # Once we have crunchbase data, we can fetch Yahoo data
                    def fetch_yahoo_data():
                        try:
                            from src.routes.company.helpers import get_ticker
                            stock_name = get_ticker(crunchbase_data, coresignal_data)
                            print("stock name", stock_name)
                            if stock_name:
                                return get_shareholder_info(stock_name) or {}
                            return {}
                        except Exception as e:
                            print(f"Error getting Yahoo data: {e}")
                            return {}
                    
                    future_yahoo = executor.submit(fetch_yahoo_data)
                    yahooData = future_yahoo.result()
                    print("yahoo data", yahooData)
                elif data_type == "logo":
                    company_image_url = future.result()
            except Exception as e:
                print(f"Error processing {data_type} data: {e}")
    
    # Get LLM data with safe fallbacks
    try:
        llmData = fetch_llm_company_data(company_name, 10000, "gpt-4o-mini")
    except Exception as e:
        print(f"Error getting LLM data: {e}")
        llmData = {
            "leadership_executives": [],
            "strategic_alliances": [],
            "strategic_development": [],
            "company_strategy": [],
            "market_size": {},
            "regulations": []
        }
    
    # Process key members in parallel
    key_members = process_key_members(llmData.get("leadership_executives", []), company_name)
    
    # Prepare the comprehensive response
    response_data = prepare_company_response(
        company_name,
        company_full_url,
        coresignal_data,
        crunchbase_data,
        yahooData,
        llmData,
        key_members,
        company_image_url
    )
    
    # Enrich the data in parallel
    response_data = enrich_data_parallel(response_data, company_name, coresignal_data, max_workers)
    
    return {"success": True, "company_name": company_name, "data": response_data,"coresignal_data":coresignal_data,"crunchbase_data":crunchbase_data}

def process_key_members(leadership_executives, company_name):
    """
    Process key members in parallel using ThreadPoolExecutor
    """
    key_members = []
    
    def process_member(member_data):
        i, member = member_data
        try:
            linkedin_url, experience, education = get_people_experience_and_education(
                member.get("name", ""), 
                member.get("position", ""), 
                company_name
            )
            return {
                "member_id": i,
                "member_full_name": member.get("name", ""),
                "member_position_title": member.get("position", ""),
                "member_linkedin_url": linkedin_url,
                "member_experience": experience,
                "member_education": education
            }
        except Exception as e:
            print(f"Error processing member {i}: {e}")
            # Return a partial record with error information
            return {
                "member_id": i,
                "member_full_name": member.get("name", ""),
                "member_position_title": member.get("position", ""),
                "member_linkedin_url": "",
                "member_experience": [],
                "member_education": [],
                "error": str(e)
            }
    
    try:
        if not leadership_executives:
            print("No leadership executives data found")
            return key_members
            
        print(f"Processing {len(leadership_executives)} key members in parallel")
        
        # Create a thread pool for parallel execution
        with ThreadPoolExecutor(max_workers=max_workers) as executor:
            # Submit all members to the executor
            future_to_member = {
                executor.submit(process_member, (i, member)): i 
                for i, member in enumerate(leadership_executives)
            }
            
            # Collect results as they complete
            for future in as_completed(future_to_member):
                try:
                    result = future.result()
                    if result:  # Only append if we got a valid result
                        key_members.append(result)
                        print(f"Processed member {result.get('member_id')}: {result.get('member_full_name')}")
                except Exception as e:
                    member_index = future_to_member[future]
                    print(f"Error in processing future for member {member_index}: {str(e)}")
        
        print(f"Completed processing {len(key_members)} key members")
    except Exception as e:
        print(f"Error in parallel processing of key members: {e}")
        
    return key_members

def convert_null_to_none(data):
    """
    Convert None values to empty strings or appropriate default values
    """
    from src.routes.company.helpers import convert_null_to_none
    return convert_null_to_none(data)