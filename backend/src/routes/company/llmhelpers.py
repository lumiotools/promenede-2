import os
import requests
from functools import reduce
from dataclasses import dataclass
from typing import Any, Callable, Dict, List, Optional, Tuple, Union
from concurrent.futures import ThreadPoolExecutor, as_completed


from src.utils.llm_summary.openai_helper import get_openai_business, get_openai_companyDetail, get_openai_companyTimeline, get_openai_executive_summary, get_openai_financial_comparables, get_openai_keyTechnology, get_openai_maStrategy, get_openai_marketLeadership, get_openai_peer_competitorAnalysis, get_openai_peer_developments, get_openai_productTimeline, get_openai_productsServices, get_openai_valueChain
from src.utils.llm_summary.perplexity_info import generate_perplexity_KeyTechnologies, generate_perplexity_MarketLeadership, generate_perplexity_businessDetail, generate_perplexity_companyTimeline, generate_perplexity_financial_comparables, generate_perplexity_maStrategy, generate_perplexity_peer_developments, generate_perplexity_productTimeline, generate_perplexity_productsServices, generate_perplexity_value_chain

from src.routes.company.helpers import get_top_companies_by_similarity, safe_call
from src.utils.llm_summary.employeer_reviews import get_employee_reviews_summary, get_employee_ratings_summary, get_areas_of_improvement
from src.utils.llmInfo.competitive_analysis import get_competitive_analysis
from src.utils.llmInfo.opportunity_areas import get_opportunity_areas
from src.utils.llmInfo.product_services import get_product_services
from src.utils.llm_summary.employee_trend import get_employee_trend_summary
from src.utils.llmInfo.market_map import get_market_map


@dataclass
class EnrichmentTask:
    """Class for organizing data enrichment tasks."""
    name: str
    perplexity_func: Optional[Callable] = None
    perplexity_args: Tuple = ()
    openai_func: Optional[Callable] = None
    openai_args: Tuple = ()
    default_value: Any = None
    requires_perplexity: bool = True
    
    def __post_init__(self):
        # For tasks that don't require perplexity, set a flag
        if self.perplexity_func is None:
            self.requires_perplexity = False

def enrich_data_parallel(response_data: Dict, company_name: str, coresignal_data: Dict, max_workers: int = 5):
    """
    Enriches response data by calling Perplexity and OpenAI APIs in parallel.
    
    The function works in two phases:
    1. Execute all Perplexity API calls in parallel
    2. Once Perplexity data is available, execute OpenAI calls in parallel
    
    Args:
        response_data: The base data structure to enrich
        company_name: Name of the company
        coresignal_data: CoreSignal data for the company
        max_workers: Maximum number of concurrent worker threads
        
    Returns:
        Dict: Enriched response data
    """
    print(f"Starting parallel data enrichment for {company_name}")
    
    # Initialize tasks list
    tasks = []
    
    # Phase 1: Define all tasks
    tasks = [
        # Simple tasks (only one function call)
        EnrichmentTask(
            name="employee_reviews_summary",
            openai_func=get_employee_reviews_summary,
            openai_args=(company_name, response_data["organization"]["employee_reviews2"]),
            default_value="",
            requires_perplexity=False
        ),
        EnrichmentTask(
            name="competitive_analysis",
            openai_func=get_competitive_analysis,
            openai_args=(company_name, response_data["competitive_analysis"]),
            default_value="",
            requires_perplexity=False
        ),
        EnrichmentTask(
            name="opportunity_areas",
            openai_func=get_opportunity_areas,
            openai_args=(company_name, response_data["executive_summary"]["topic_tags"]),
            default_value=[],
            requires_perplexity=False
        ),
        EnrichmentTask(
            name="product_services",
            openai_func=get_product_services,
            openai_args=(company_name, response_data["products_services"]["services"]),
            default_value="",
            requires_perplexity=False
        ),
        EnrichmentTask(
            name="employee_trend_department",
            openai_func=get_employee_trend_summary,
            openai_args=(
                company_name, 
                response_data["organization"]["employees_trend"]["breakdown_by_department"],
                response_data["organization"]["employees_trend"]["breakdown_by_department_by_month"]
            ),
            default_value="",
            requires_perplexity=False
        ),
        EnrichmentTask(
            name="employee_trend_count",
            openai_func=get_employee_trend_summary,
            openai_args=(
                company_name, 
                response_data["organization"]["employees_trend"]["count_by_month"],
                response_data["organization"]["employees_trend"]["count_change"]
            ),
            default_value="",
            requires_perplexity=False
        ),
        EnrichmentTask(
            name="employee_ratings_summary",
            openai_func=get_employee_ratings_summary,
            openai_args=(company_name, response_data["organization"]["employee_reviews2"]),
            default_value="",
            requires_perplexity=False
        ),
        EnrichmentTask(
            name="employee_ratings_improvements",
            openai_func=get_areas_of_improvement,
            openai_args=(company_name, response_data["organization"]["employee_reviews2"]),
            default_value="",
            requires_perplexity=False
        ),
        EnrichmentTask(
            name="market_map",
            openai_func=get_market_map,
            openai_args=(company_name, response_data["market_info"]["market_map"]),
            default_value={},
            requires_perplexity=False
        ),
        
        # Complex tasks (perplexity + openai)
        EnrichmentTask(
            name="business_detail",
            perplexity_func=generate_perplexity_businessDetail,
            perplexity_args=(company_name, response_data['company_overview']),
            openai_func=get_openai_business,
            openai_args=(company_name, None),  # Will be updated with perplexity result
            default_value={"business_description": "", "business_model": "", "products_brands": "", "customers": ""}
        ),
        EnrichmentTask(
            name="company_timeline",
            perplexity_func=generate_perplexity_companyTimeline,
            perplexity_args=(company_name,),
            openai_func=get_openai_companyTimeline,
            openai_args=(company_name, None),  # Will be updated with perplexity result
            default_value={"company_timeline": []}
        ),
        EnrichmentTask(
            name="product_timeline",
            perplexity_func=generate_perplexity_productTimeline,
            perplexity_args=(company_name,),
            openai_func=get_openai_productTimeline,
            openai_args=(company_name, None),  # Will be updated with perplexity result
            default_value={"product_timeline": []}
        ),
        EnrichmentTask(
            name="market_leadership",
            perplexity_func=generate_perplexity_MarketLeadership,
            perplexity_args=(company_name,),
            openai_func=get_openai_marketLeadership,
            openai_args=(company_name, None),  # Will be updated with perplexity result
            default_value={"market_leadership": {}}
        ),
        EnrichmentTask(
            name="key_technology",
            perplexity_func=generate_perplexity_KeyTechnologies,
            perplexity_args=(company_name,),
            openai_func=get_openai_keyTechnology,
            openai_args=(company_name, None),  # Will be updated with perplexity result
            default_value={"key_technologies": {}}
        ),
        EnrichmentTask(
            name="products_services_detail",
            perplexity_func=generate_perplexity_productsServices,
            perplexity_args=(company_name,),
            openai_func=get_openai_productsServices,
            openai_args=(company_name, None),  # Will be updated with perplexity result
            default_value={"products_services": ""}
        ),
        EnrichmentTask(
            name="ma_strategy",
            perplexity_func=generate_perplexity_maStrategy,
            perplexity_args=(company_name,),
            openai_func=get_openai_maStrategy,
            openai_args=(company_name, None),  # Will be updated with perplexity result
            default_value={"ma_deals": []}
        ),
        EnrichmentTask(
            name="value_chain",
            perplexity_func=generate_perplexity_value_chain,
            perplexity_args=(company_name,),
            openai_func=get_openai_valueChain,
            openai_args=(company_name, None),  # Will be updated with perplexity result
            default_value={"value_chain": {}}
        ),
        EnrichmentTask(
            name="financial_comparables",
            perplexity_func=generate_perplexity_financial_comparables,
            perplexity_args=(company_name,),
            openai_func=get_openai_financial_comparables,
            openai_args=(company_name, None),  # Will be updated with perplexity result
            default_value={"financial_comparables": {}}
        )
    ]
    
    # Add tasks that require special handling
    competitors = coresignal_data.get("competitors", "")
    print("competitors",competitors)
    if competitors:
        try:
            top_peer = get_top_companies_by_similarity(competitors, 3)
            print("Top peer companies:", top_peer)
            
            # Add peer developments task
            tasks.append(
                EnrichmentTask(
                    name="peer_developments",
                    perplexity_func=generate_perplexity_peer_developments,
                    perplexity_args=(company_name, top_peer),
                    openai_func=get_openai_peer_developments,
                    openai_args=(company_name, None),  # Will be updated with perplexity result
                    default_value={"companies_info": {}}
                )
            )
            
            # Add competitor analysis task (direct OpenAI call)
            tasks.append(
                EnrichmentTask(
                    name="competitive_analysis_detail",
                    openai_func=get_openai_peer_competitorAnalysis,
                    openai_args=(company_name, top_peer),
                    default_value={"competitive_analysis": {}},
                    requires_perplexity=False
                )
            )
        except Exception as e:
            print(f"Error processing competitors for peer analysis: {e}")
    
    # Add executive summary task (handled separately after all data is collected)
    tasks.append(
        EnrichmentTask(
            name="executive_summary",
            openai_func=get_openai_executive_summary,
            openai_args=(company_name, response_data["executive_summary"]),
            default_value="",
            requires_perplexity=False
        )
    )
    
    # Add company detail task (direct OpenAI call)
    tasks.append(
        EnrichmentTask(
            name="company_detail",
            openai_func=get_openai_companyDetail,
            openai_args=(company_name,),
            default_value={"company_detail": [{"ceo": "", "incorporation": ""}]},
            requires_perplexity=False
        )
    )
    
    # Phase 2: Execute Perplexity calls in parallel
    perplexity_results = {}
    perplexity_tasks = [task for task in tasks if task.requires_perplexity]
    
    if perplexity_tasks:
        print(f"Starting {len(perplexity_tasks)} Perplexity API calls in parallel")
        
        def execute_perplexity_task(task):
            try:
                if task.perplexity_func:
                    print(f"Executing Perplexity task: {task.name}")
                    result = safe_call(task.perplexity_func, *task.perplexity_args, default=task.default_value)
                    return task.name, result
                return task.name, None
            except Exception as e:
                print(f"Error in Perplexity task {task.name}: {e}")
                return task.name, None
        
        with ThreadPoolExecutor(max_workers=max_workers) as executor:
            future_to_task = {executor.submit(execute_perplexity_task, task): task for task in perplexity_tasks}
            
            for future in as_completed(future_to_task):
                try:
                    task_name, result = future.result()
                    perplexity_results[task_name] = result
                    print(f"Completed Perplexity task: {task_name}")
                except Exception as e:
                    task = future_to_task[future]
                    print(f"Exception in Perplexity task {task.name}: {e}")
    
    # Phase 3: Execute OpenAI calls in parallel
    results = {}
    openai_tasks = []
    
    # Prepare OpenAI tasks with Perplexity results if needed
    for task in tasks:
        if task.requires_perplexity:
            perplexity_result = perplexity_results.get(task.name)
            if not perplexity_result:
                print(f"Skipping OpenAI task {task.name} due to missing Perplexity data")
                continue
                
            # Update the OpenAI args with the Perplexity result
            updated_args = list(task.openai_args)
            # Find the None argument and replace it with the Perplexity result
            for i, arg in enumerate(updated_args):
                if arg is None:
                    updated_args[i] = perplexity_result
                    break
            task.openai_args = tuple(updated_args)
        
        # Add task to the OpenAI execution list
        openai_tasks.append(task)
    
    print(f"Starting {len(openai_tasks)} OpenAI API calls in parallel")
    
    def execute_openai_task(task):
        try:
            print(f"Executing OpenAI task: {task.name}")
            result = safe_call(task.openai_func, *task.openai_args, default=task.default_value)
            return task.name, result
        except Exception as e:
            print(f"Error in OpenAI task {task.name}: {e}")
            return task.name, task.default_value
    
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        future_to_task = {executor.submit(execute_openai_task, task): task for task in openai_tasks}
        
        for future in as_completed(future_to_task):
            try:
                task_name, result = future.result()
                results[task_name] = result
                print(f"Completed OpenAI task: {task_name}")
            except Exception as e:
                task = future_to_task[future]
                print(f"Exception in OpenAI task {task.name}: {e}")
                results[task_name] = task.default_value
    
    # Phase 4: Update response_data with results
    try:
        # Handle simple task results
        response_data["organization"]["employee_reviews2"]["reviews_summary"] = results.get("employee_reviews_summary", "")
        response_data["competitive_analysis"]["competitive_analysis"] = results.get("competitive_analysis", "")
        response_data["opportunities_risks"]["opportunities"] = results.get("opportunity_areas", [])
        response_data["products_services"]["services"] = results.get("product_services", "")
        response_data["organization"]["employees_trend"]["department_summary"] = results.get("employee_trend_department", "")
        response_data["organization"]["employees_trend"]["count_summary"] = results.get("employee_trend_count", "")
        response_data["organization"]["employee_reviews2"]["ratings_summary"] = results.get("employee_ratings_summary", "")
        response_data["organization"]["employee_reviews2"]["areas_of_improvements"] = results.get("employee_ratings_improvements", "")
        response_data["market_info"]["market_map"] = results.get("market_map", {})
        
        # Handle business detail
        if business_detail := results.get("business_detail"):
            response_data["executive_summary"]['description'] = business_detail.get("business_description", "")
            response_data["company_overview"]['description_enriched'] = business_detail.get("business_description", "")
            response_data["company_overview"]['business_model'] = business_detail.get("business_model", "")
            response_data["company_overview"]['products_brands'] = business_detail.get("products_brands", "")
            response_data["company_overview"]['customers'] = business_detail.get("customers", "")
        
        # Handle company timeline
        if company_timeline := results.get("company_timeline"):
            response_data["company_timeline"] = company_timeline.get("company_timeline", [])
        
        # Handle product timeline
        if product_timeline := results.get("product_timeline"):
            response_data['products_services']['launch_timeline'] = product_timeline.get('product_timeline', [])
        
        # Handle market leadership
        if market_leadership := results.get("market_leadership"):
            response_data["market_leadership"] = market_leadership.get('market_leadership', {})
        
        # Handle key technology
        if key_technology := results.get("key_technology"):
            response_data["key_technology"] = key_technology.get('key_technologies', {})
        
        # Handle products and services
        if products_services := results.get("products_services_detail"):
            response_data["products_services"]["services"] = products_services.get('products_services', "")
        
        # Handle M&A strategy
        if ma_strategy := results.get("ma_strategy"):
            response_data['ma_activity']['ma_deals'] = ma_strategy.get('ma_deals', [])
        
        # Handle value chain
        if value_chain := results.get("value_chain"):
            response_data['market_info']['value_chain'] = value_chain.get('value_chain', {})
        
        # Handle financial comparables
        if financial_comparables := results.get("financial_comparables"):
            response_data['competitive_analysis']['financial_comparables'] = financial_comparables.get('financial_comparables', {})
        
        # Handle peer developments
        if peer_developments := results.get("peer_developments"):
            response_data['competitive_analysis']['peer_developments'] = peer_developments.get('companies_info', {})
        
        # Handle competitive analysis detail
        if competitive_analysis := results.get("competitive_analysis_detail"):
            response_data["competitive_analysis"]["competitive_analysis"] = competitive_analysis.get("competitive_analysis", {})
        
        # Set business model in strategy section
        response_data["strategy"]['businessModel'] = response_data["company_overview"]['business_model']
        
        # Handle executive summary
        if executive_summary := results.get("executive_summary"):
            response_data["executive_summary"]["executive_summary"] = executive_summary
        
        # Handle company detail
        if company_detail := results.get("company_detail"):
            company_detail_info = company_detail.get('company_detail', [{}])[0] if company_detail.get('company_detail') else {}
            response_data["company_profile"]["firmographic"]["ceo"] = company_detail_info.get("ceo", "")
            response_data["company_profile"]["firmographic"]["incorporation_date"] = company_detail_info.get("incorporation", "")
    
    except Exception as e:
        print(f"Error updating response data with results: {e}")
    
    print("Completed parallel data enrichment")
    return response_data
