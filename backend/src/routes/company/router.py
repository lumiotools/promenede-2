from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import os
import requests
from functools import reduce
from dotenv import load_dotenv
from src.utils.brandfetch.brandLogo import get_company_logo
from src.utils.llm_summary.openai_helper import get_openai_business, get_openai_companyTimeline, get_openai_executive_summary, get_openai_financial_comparables, get_openai_keyTechnology, get_openai_maStrategy, get_openai_marketLeadership, get_openai_peer_competitorAnalysis, get_openai_peer_developments, get_openai_productTimeline, get_openai_productsServices, get_openai_valueChain
from src.utils.llm_summary.perplexity_info import generate_perplexity_KeyTechnologies, generate_perplexity_MarketLeadership, generate_perplexity_businessDetail, generate_perplexity_companyTimeline, generate_perplexity_financial_comparables, generate_perplexity_maStrategy, generate_perplexity_peer_developments, generate_perplexity_productTimeline, generate_perplexity_productsServices, generate_perplexity_value_chain
from src.utils.llmInfo.llm import fetch_company_data
from src.utils.crunchbase.company import get_organization_data
from src.utils.secFilings.getCik import get_cik_by_company_name
from src.utils.secFilings.analyse10K import analyze_10K_filing
from src.utils.coresignal.company import get_company_details, get_company_id
from src.utils.yahoo.shareholder import get_shareholder_info
from src.routes.company.helpers import extract_financial_data, calculate_per, calculate_revenue_growth, get_ceo_names, get_employee_review_trend, get_acquisitions, extract_company_timeline, extract_product_details, extract_product_timeline, extract_strategic_development, extract_company_strategy, extract_customer_success, extract_value_chain, extract_market_map, extract_competitive_landscape, extract_financial_comparables, combine_funding_and_founding, combine_webtraffic_and_founding, extract_company_name_from_website, extract_regulation_info, extract_opportunities, extract_risks, extract_common_questions, generate_competitors_answer, generate_technologies_answer, convert_null_to_none, get_ticker, get_top_companies_by_similarity, get_unique_tags_from_coresignal

from src.utils.llm_summary.employeer_reviews import get_employee_reviews_summary, get_employee_ratings_summary, get_areas_of_improvement
from src.utils.llmInfo.competitive_analysis import get_competitive_analysis
from src.utils.llmInfo.opportunity_areas import get_opportunity_areas
from src.utils.llmInfo.product_services import get_product_services
from src.utils.llm_summary.employee_trend import get_employee_trend_summary
from src.utils.llmInfo.market_map import get_market_map
from src.utils.contactout.people import get_people_experience_and_education
from src.utils.website_screenshot.screenshot import get_website_screenshot
# Load environment variables from .env file
load_dotenv()

# Initialize the FastAPI router
router = APIRouter()

# Pydantic model to define the request body
class CompanyRequest(BaseModel):
    company_name: str
    company_url: str

@router.post("/")
async def get_company_data(request: CompanyRequest):
    """
    Takes a company name as input and returns comprehensive company data
    for report generation based on CoreSignal API and Crunchbase.
    Prioritizes CoreSignal and Crunchbase data over SEC data.
    """
    company_name = request.company_name
    company_url = request.company_url

    # Initialize default empty structures to avoid NoneType errors
    coresignal_data = {}
    crunchbase_data = {"cards": {"fields": {}}}
    yahooData = {}
    
    # Try to get CoreSignal data
    try:
        company_enrichment_id = get_company_id(company_url)
        print("enrichment id", company_enrichment_id)
        if company_enrichment_id:
            coresignal_data = get_company_details(company_enrichment_id) or {}
            coresignal_data = convert_null_to_none(coresignal_data)
    except Exception as e:
        print(f"Error getting CoreSignal data: {e}")
        coresignal_data = {}
    
    if not coresignal_data:
        print("No CoreSignal data found")
    
    # Try to get company name from either source
    if coresignal_data and coresignal_data.get("company_name"):
        company_name = coresignal_data.get("company_name", company_name)
    
    company_full_url=coresignal_data.get("website","")
    # Try to get Crunchbase data using the URL from CoreSignal if available
    crunchbase_data = {"cards": {"fields": {}}}
    # try:
    #     crunchbase_url = coresignal_data.get("crunchbase_url", "")
    #     if crunchbase_url:
    #         crunchbase_company_name = crunchbase_url.split("/")[-1]
    #         print("crunchbase url", crunchbase_url, " Company name", crunchbase_company_name)
    #         crunchbase_data = get_organization_data(crunchbase_company_name) or {"cards": {"fields": {}}}
    #     else:
    #         # Fallback to original company name
    #         crunchbase_data = get_organization_data(company_name) or {"cards": {"fields": {}}}
    #     print("crunchbase data", crunchbase_data)
    # except Exception as e:
    #     print(f"Error getting Crunchbase data: {e}")
    #     crunchbase_data = {"cards": {"fields": {}}}
    
    # Try to get Yahoo data
    try:
        stock_name = get_ticker(crunchbase_data,coresignal_data)
        print("stock name", stock_name)
        if stock_name:
            yahooData = get_shareholder_info(stock_name) or {}
        print("yahoo data", yahooData)
    except Exception as e:
        print(f"Error getting Yahoo data: {e}")
        yahooData = {}
    company_image_url=get_company_logo(company_name)
    
    # Get LLM data with safe fallbacks
    try:
        llmData = fetch_company_data(company_name, 10000, "gpt-4o-mini")
    except Exception as e:
        print(f"Error getting LLM data: {e}")
        llmData = {
            "leadership_executives": [],
            "launch_timeline": [],
            "strategic_alliances": [],
            "strategic_development": [],
            "company_strategy": [],
            "market_size": {},
            "value_chain": {},
            "regulations": []
        }
    
    # Get key members with safe fallbacks
    key_members = []
    try:
        for i, member in enumerate(llmData.get("leadership_executives", [])):
            try:
                linkedin_url, experience, education = get_people_experience_and_education(
                    member.get("name", ""), 
                    member.get("position", ""), 
                    company_name
                )
                key_members.append({
                    "member_id": i,
                    "member_full_name": member.get("name", ""),
                    "member_position_title": member.get("position", ""),
                    "member_linkedin_url": linkedin_url,
                    "member_experience": experience,
                    "member_education": education
                })
            except Exception as e:
                print(f"Error processing member {i}: {e}")
    except Exception as e:
        print(f"Error processing key members: {e}")
    
    # Safe data extraction helper functions
    def safe_get(data, *keys, default=None):
        """Safely navigate nested dictionaries and return default if any key is missing"""
        current = data
        for key in keys:
            if not isinstance(current, dict):
                return default
            current = current.get(key, {})
        return current if current != {} else default
    
    def safe_call(func, *args, default=None, **kwargs):
        """Safely call a function and return default if it raises an exception"""
        try:
            result = func(*args, **kwargs)
            return result if result is not None else default
        except Exception as e:
            print(f"Error calling {func.__name__}: {e}")
            return default
    
    # Prepare the comprehensive response with safe defaults
    response_data = {
        # 1. Executive Summary
        "executive_summary": {
            "industry": safe_get(coresignal_data, "industry", default=""),
            "topic_tags": safe_get(coresignal_data, "categories_and_keywords", default=[]),
            "valuation": safe_get(crunchbase_data, "cards", "fields", "valuation", default=""),
            "equity_funding_total": safe_get(crunchbase_data, "cards", "fields", "equity_funding_total", default=""),
            "funding_total": safe_get(crunchbase_data, "cards", "fields", "funding_total", default=""),
            #"description": safe_get(crunchbase_data, "cards", "fields", "short_description", default=""),
            "description": "",
            "financial_highlights": {
                "operating_revenue": safe_call(extract_financial_data, coresignal_data, "revenue", default={}),
                "operating_profit": safe_call(extract_financial_data, coresignal_data, "gross_profit", default={}),
                "ebitda": safe_call(extract_financial_data, coresignal_data, "ebit", default={}),
                "net_income": safe_call(extract_financial_data, coresignal_data, "net_income", default={}),
                "per": safe_call(calculate_per, coresignal_data, default={}),
            }
        },
        
        # 2. Company Profile
        "company_profile": {
            # a. Firmographic
            "firmographic": {
                "name": safe_get(coresignal_data, "company_name", default=""),
                "legal_name": safe_get(coresignal_data, "company_legal_name", default=""),
                "incorporation_date": safe_get(crunchbase_data, "cards", "fields", "founded_on", "value", default=""),
                "hq_address": safe_get(coresignal_data, "hq_location", default=""),
                "hq_city": safe_get(coresignal_data, "hq_city", default=""),
                "hq_state": safe_get(coresignal_data, "hq_state", default=""),
                "hq_country": safe_get(coresignal_data, "hq_country", default=""),
                "industry": safe_get(coresignal_data, "industry", default=""),
                "type": safe_get(coresignal_data, "type", default=""),
                "revenue_range": safe_get(coresignal_data, "revenue_annual_range", default={}),
                "employees_count": safe_get(coresignal_data, "employees_count", default=0),
                "products_services": safe_get(crunchbase_data, "cards", "fields", "categories", default=""),
                # "description": safe_get(coresignal_data, "description", default="")
                "description": "",
                "ceo":safe_call(get_ceo_names,coresignal_data,default=""),
                "tags":safe_call(get_unique_tags_from_coresignal,coresignal_data,default="")
            },
            
            # b. Key Financials
            "key_financials": {
                "income_statements": safe_get(coresignal_data, "income_statements", default=[]),
                "operating_revenue": safe_call(extract_financial_data, coresignal_data, "revenue", default={}),
                "operating_profit": safe_call(extract_financial_data, coresignal_data, "ebit", default={}),
                "ebitda": safe_call(extract_financial_data, coresignal_data, "ebitda", default={}),
                "net_income": safe_call(extract_financial_data, coresignal_data, "net_income", default={}),
                "per": safe_call(calculate_per, coresignal_data, default={}),
                "revenue_growth": safe_call(calculate_revenue_growth, coresignal_data, default={})
            },
            
            # c. Shareholders
            "shareholders": yahooData or {}
        },
        
        # 3. Company Overview
        "company_overview": {
            "business_model": "B2B" if safe_get(coresignal_data, "is_b2b") == 1 else "B2C",
            "products_brands": safe_get(crunchbase_data, "cards", "fields", "categories", default=""),
            "customers": safe_get(coresignal_data, "categories_and_keywords", default=[]),
            "description_enriched": "",
            "website_screenshot": safe_call(
                lambda url: f"data:image/png;base64,{get_website_screenshot(url)}" if url else "",
                company_full_url,
                default=""
            )
        },
        
        # 4. Financial Summary
        "financial_summary": safe_get(coresignal_data, "income_statements", default=[]),
        
        # 5. Web Traffic
        "web_traffic": {
            "monthly_visits": safe_get(coresignal_data, "total_website_visits_monthly", default=0),
            "visits_by_country": safe_get(coresignal_data, "visits_breakdown_by_country", default=[]),
            "visits_by_month": safe_get(coresignal_data, "total_website_visits_by_month", default=[]),
            "visits_change": safe_get(coresignal_data, "total_website_visits_change", default={}),
            "bounce_rate": safe_get(coresignal_data, "bounce_rate", default=0),
            "pages_per_visit": safe_get(coresignal_data, "pages_per_visit", default=0),
            "average_visit_duration": safe_get(coresignal_data, "average_visit_duration_seconds", default=0)
        },
        
        # 6. Company Group Structure
        "group_structure": {
            "parent_company": safe_get(coresignal_data, "parent_company_information", default={}),
            "subsidiaries": safe_get(crunchbase_data, "child_organizations", default=[])
        },
        
        # 7. Company Timeline
        "company_timeline": safe_call(extract_company_timeline, coresignal_data, crunchbase_data, default=[]),
        
        # 8-9. Products & Services and Launch Timeline
        "products_services": {
            "services": safe_get(crunchbase_data, "cards", "fields", "categories", default="") or 
                       safe_get(crunchbase_data, "cards", "fields", "category_groups", default=""),
            "details": safe_call(extract_product_details, coresignal_data, crunchbase_data, default={}),
            "launch_timeline": safe_get(llmData, "launch_timeline", default=[]),
            "pricing_available": safe_get(coresignal_data, "pricing_available", default=False),
            "free_trial_available": safe_get(coresignal_data, "free_trial_available", default=False),
            "demo_available": safe_get(coresignal_data, "demo_available", default=False),
            "product_reviews": {
                "count": safe_get(coresignal_data, "product_reviews_count", default=0),
                "score": safe_get(coresignal_data, "product_reviews_aggregate_score", default=0),
                "by_month": safe_get(coresignal_data, "product_reviews_score_by_month", default=[]),
                "distribution": safe_get(coresignal_data, "product_reviews_score_distribution", default={})
            }
        },
        
        # 10-12. Organization: Employees, Key Members, Leadership
        "organization": {
            "employees_trend": {
                "count_by_month": safe_get(coresignal_data, "employees_count_by_month", default=[]),
                "count_change": safe_get(coresignal_data, "employees_count_change", default={}),
                "breakdown_by_department": safe_get(coresignal_data, "employees_count_breakdown_by_department", default={}),
                "breakdown_by_department_by_month": safe_get(coresignal_data, "employees_count_breakdown_by_department_by_month", default={}),
                "breakdown_by_country": safe_get(coresignal_data, "employees_count_by_country", default=[]),
                "breakdown_by_region": safe_get(coresignal_data, "employees_count_breakdown_by_region", default={}),
                "breakdown_by_seniority": safe_get(coresignal_data, "employees_count_breakdown_by_seniority", default={})
            },
            "key_members": key_members,
            "leadership_executives": safe_get(llmData, "leadership_executives", default=[]),
            "leadership": {
                "key_executives": safe_get(coresignal_data, "key_executives", default=[]),
                "arrivals": safe_get(coresignal_data, "key_executive_arrivals", default=[]),
                "departures": safe_get(coresignal_data, "key_executive_departures", default=[]),
                "change_events": safe_get(coresignal_data, "key_employee_change_events", default=[])
            },
            
            # 13-15. Employee Reviews
            "employee_reviews2": {
                "count": safe_get(coresignal_data, "company_employee_reviews_count", default=0),
                "score": safe_get(coresignal_data, "company_employee_reviews_aggregate_score", default=0),
                "breakdown": safe_get(coresignal_data, "employee_reviews_score_breakdown", default={}),
                "distribution": safe_get(coresignal_data, "employee_reviews_score_distribution", default={}),
                "by_category": {
                    "business_outlook": safe_call(get_employee_review_trend, coresignal_data, "business_outlook", default={}),
                    "career_opportunities": safe_call(get_employee_review_trend, coresignal_data, "career_opportunities", default={}),
                    "ceo_approval": safe_call(get_employee_review_trend, coresignal_data, "ceo_approval", default={}),
                    "compensation_benefits": safe_call(get_employee_review_trend, coresignal_data, "compensation_benefits", default={}),
                    "culture_values": safe_call(get_employee_review_trend, coresignal_data, "culture_values", default={}),
                    "diversity_inclusion": safe_call(get_employee_review_trend, coresignal_data, "diversity_inclusion", default={}),
                    "recommend": safe_call(get_employee_review_trend, coresignal_data, "recommend", default={}),
                    "senior_management": safe_call(get_employee_review_trend, coresignal_data, "senior_management", default={}),
                    "work_life_balance": safe_call(get_employee_review_trend, coresignal_data, "work_life_balance", default={})
                }
            }
        },
        
        # 16. Strategic Alliance & Partnership
        "strategic_alliances": safe_get(llmData, "strategic_alliances", default=[]),
        
        # 17. Market Leadership
        "market_leadership": {
            "industry": safe_get(coresignal_data, "industry", default=""),
            "rank_category": safe_get(coresignal_data, "rank_category", default=0),
            "rank_global": safe_get(coresignal_data, "rank_global", default=0)
        },
        
        # 18. Key Technology
        "key_technology": {
            "technologies_used": safe_get(coresignal_data, "technologies_used", default=[]),
            "num_technologies": safe_get(coresignal_data, "num_technologies_used", default=0)
        },
        
        # 19-21. Strategic Development, Strategy, Customer Success
        "strategic_development": safe_get(llmData, "strategic_development", default=[]),
        "strategy": safe_get(llmData, "company_strategy", default=[]),
        "customer_success": safe_call(extract_customer_success, coresignal_data, crunchbase_data, default=[]),
        
        # 22-23. M&A
        "ma_activity": {
            "acquisitions": safe_call(get_acquisitions, coresignal_data, default=[]),
            "acquired_by": safe_get(coresignal_data, "acquired_by_summary", default={})
        },
        
        # 24-26. Market Info
        "market_info": {
            "size": safe_get(llmData, "market_size", default={}),
            "value_chain": safe_get(llmData, "value_chain", default={}),
            "market_map": safe_call(extract_market_map, coresignal_data, crunchbase_data, default={})
        },
        
        # 27-30. Competitive Analysis
        "competitive_analysis": {
            "landscape": safe_call(extract_competitive_landscape, coresignal_data, default={}),
            "competitors": safe_get(coresignal_data, "competitors", default=[]),
            "competitors_websites": safe_get(coresignal_data, "competitors_websites", default=[]),
            "financial_comparables": safe_call(extract_financial_comparables, coresignal_data, default={}),
            "peer_developments": {
                "funding_vs_founded": safe_call(combine_funding_and_founding, coresignal_data, crunchbase_data, default=[]),
                "webtraffic_vs_founded": safe_call(combine_webtraffic_and_founding, coresignal_data, default=[])
            }
        },
        
        # 31-35. Regulation, Opportunities/Risks, Q&A
        "regulations": safe_get(llmData, "regulations", default=[]),
        "opportunities_risks": {
            "opportunities": safe_call(extract_opportunities, coresignal_data, crunchbase_data, default=[]),
            "risks": safe_call(extract_risks, coresignal_data, crunchbase_data, default=[])
        },
        "qa": safe_call(extract_common_questions, coresignal_data, crunchbase_data, default=[]),
        
        # URLs for the frontend
        "urls": {
            "company_url": company_full_url,
            "image_url": company_image_url,
            "linkedin_url": safe_get(coresignal_data, "professional_network_url", default=""),
            "facebook_url": safe_get(coresignal_data, "facebook_url", default=[]),
            "twitter_url": safe_get(coresignal_data, "twitter_url", default=""),
            "youtube_url": safe_get(coresignal_data, "youtube_url", default=[]),
            "instagram_url": safe_get(coresignal_data, "instagram_url", default=[]),
            "github_url": safe_get(coresignal_data, "github_url", default=[]),
            "discord_url": safe_get(coresignal_data, "discord_url", default=[])
        }
    }
    
    # Safely call additional functions to enrich the data
    try:
        employeeReviewsSummary = safe_call(
            get_employee_reviews_summary, 
            company_name, 
            response_data["organization"]["employee_reviews2"],
            default=""
        )
        response_data["organization"]["employee_reviews2"]["reviews_summary"] = employeeReviewsSummary
    except Exception as e:
        print(f"Error getting employee reviews summary: {e}")
        response_data["organization"]["employee_reviews2"]["reviews_summary"] = ""
    
    # Handle competitive analysis
    try:
        competitiveAnalysis = safe_call(
            get_competitive_analysis, 
            company_name, 
            response_data["competitive_analysis"],
            default=""
        )
        response_data["competitive_analysis"]["competitive_analysis"] = competitiveAnalysis
    except Exception as e:
        print(f"Error getting competitive analysis: {e}")
        response_data["competitive_analysis"]["competitive_analysis"] = ""
    
    # Handle opportunity areas
    try:
        opportunityAreas = safe_call(
            get_opportunity_areas,
            company_name,
            response_data["executive_summary"]["topic_tags"],
            default=[]
        )
        response_data["opportunities_risks"]["opportunities"] = opportunityAreas
    except Exception as e:
        print(f"Error getting opportunity areas: {e}")
        response_data["opportunities_risks"]["opportunities"] = []
    
    # Handle product services
    try:
        productServices = safe_call(
            get_product_services,
            company_name,
            response_data["products_services"]["services"],
            default=""
        )
        response_data["products_services"]["services"] = productServices
    except Exception as e:
        print(f"Error getting product services: {e}")
        response_data["products_services"]["services"] = ""
    
    # Handle employee trend department summary
    try:
        employeeTrendDepartmentSummary = safe_call(
            get_employee_trend_summary,
            company_name,
            response_data["organization"]["employees_trend"]["breakdown_by_department"],
            response_data["organization"]["employees_trend"]["breakdown_by_department_by_month"],
            default=""
        )
        response_data["organization"]["employees_trend"]["department_summary"] = employeeTrendDepartmentSummary
    except Exception as e:
        print(f"Error getting employee trend department summary: {e}")
        response_data["organization"]["employees_trend"]["department_summary"] = ""
    
    # Handle employee trend count summary
    try:
        employeeTrendCountSummary = safe_call(
            get_employee_trend_summary,
            company_name,
            response_data["organization"]["employees_trend"]["count_by_month"],
            response_data["organization"]["employees_trend"]["count_change"],
            default=""
        )
        response_data["organization"]["employees_trend"]["count_summary"] = employeeTrendCountSummary
    except Exception as e:
        print(f"Error getting employee trend count summary: {e}")
        response_data["organization"]["employees_trend"]["count_summary"] = ""
    
    # Handle employee ratings summary
    try:
        employeeRatingsSummary = safe_call(
            get_employee_ratings_summary,
            company_name,
            response_data["organization"]["employee_reviews2"],
            default=""
        )
        response_data["organization"]["employee_reviews2"]["ratings_summary"] = employeeRatingsSummary
    except Exception as e:
        print(f"Error getting employee ratings summary: {e}")
        response_data["organization"]["employee_reviews2"]["ratings_summary"] = ""
    
    # Handle employee ratings areas of improvement
    try:
        employeeRatingsAreasOfImprovement = safe_call(
            get_areas_of_improvement,
            company_name,
            response_data["organization"]["employee_reviews2"],
            default=""
        )
        response_data["organization"]["employee_reviews2"]["areas_of_improvements"] = employeeRatingsAreasOfImprovement
    except Exception as e:
        print(f"Error getting employee ratings areas of improvement: {e}")
        response_data["organization"]["employee_reviews2"]["areas_of_improvements"] = ""
    
    # Handle market map
    try:
        market_map = safe_call(
            get_market_map,
            company_name,
            response_data["market_info"]["market_map"],
            default={}
        )
        response_data["market_info"]["market_map"] = market_map
    except Exception as e:
        print(f"Error getting market map: {e}")
        response_data["market_info"]["market_map"] = {}

    # Handle perplexity and OpenAI data
    try:
        business_detail = safe_call(
            generate_perplexity_businessDetail,
            company_name,
            response_data['company_overview'],
            default=""
        )
        
        if business_detail:
            openai_business = safe_call(
                get_openai_business,
                company_name,
                business_detail,
                default={"business_description": "", "business_model": "", "products_brands": "", "customers": ""}
            )
            
            response_data["executive_summary"]['description'] = openai_business.get("business_description", "")
            response_data["company_overview"]['description_enriched'] = openai_business.get("business_description", "")
            response_data["company_overview"]['business_model'] = openai_business.get("business_model", "")
            response_data["company_overview"]['products_brands'] = openai_business.get("products_brands", "")
            response_data["company_overview"]['customers'] = openai_business.get("customers", "")
    except Exception as e:
        print(f"Error enriching business details: {e}")
    
    # Handle company timeline
    try:
        perplexity_company_timeline = safe_call(
            generate_perplexity_companyTimeline,
            company_name,
            default=""
        )
        
        if perplexity_company_timeline:
            openai_company_timeline = safe_call(
                get_openai_companyTimeline,
                company_name,
                perplexity_company_timeline,
                default={"company_timeline": []}
            )
            response_data["company_timeline"] = openai_company_timeline.get("company_timeline", [])
    except Exception as e:
        print(f"Error enriching company timeline: {e}")
    
    # Handle product timeline
    try:
        perplexity_product_timeline = safe_call(
            generate_perplexity_productTimeline,
            company_name,
            default=""
        )
        
        if perplexity_product_timeline:
            openai_product_timeline = safe_call(
                get_openai_productTimeline,
                company_name,
                perplexity_product_timeline,
                default={"product_timeline": []}
            )
            response_data['products_services']['launch_timeline'] = openai_product_timeline.get('product_timeline', [])
    except Exception as e:
        print(f"Error enriching product timeline: {e}")
    
    # Handle market leadership
    try:
        perplexity_market_leadership = safe_call(
            generate_perplexity_MarketLeadership,
            company_name,
            default=""
        )
        
        if perplexity_market_leadership:
            openai_market_leadership = safe_call(
                get_openai_marketLeadership,
                company_name,
                perplexity_market_leadership,
                default={"market_leadership": {}}
            )
            response_data["market_leadership"] = openai_market_leadership.get('market_leadership', {})
    except Exception as e:
        print(f"Error enriching market leadership: {e}")
    
    # Handle key technology
    try:
        perplexity_key_technology = safe_call(
            generate_perplexity_KeyTechnologies,
            company_name,
            default=""
        )
        
        if perplexity_key_technology:
            openai_key_technology = safe_call(
                get_openai_keyTechnology,
                company_name,
                perplexity_key_technology,
                default={"key_technologies": {}}
            )
            response_data["key_technology"] = openai_key_technology.get('key_technologies', {})
    except Exception as e:
        print(f"Error enriching key technology: {e}")
    
    # Handle products and services
    try:
        perplexity_products_services = safe_call(
            generate_perplexity_productsServices,
            company_name,
            default=""
        )
        
        if perplexity_products_services:
            openai_products_services = safe_call(
                get_openai_productsServices,
                company_name,
                perplexity_products_services,
                default={"products_services": ""}
            )
            response_data["products_services"]["services"] = openai_products_services.get('products_services', "")
    except Exception as e:
        print(f"Error enriching products and services: {e}")
    
    # Handle M&A strategy
    try:
        perplexity_maStrategy = safe_call(
            generate_perplexity_maStrategy,
            company_name,
            default=""
        )
        
        if perplexity_maStrategy:
            openai_maStrategy = safe_call(
                get_openai_maStrategy,
                company_name,
                perplexity_maStrategy,
                default={"ma_deals": []}
            )
            response_data['ma_activity']['ma_deals'] = openai_maStrategy.get('ma_deals', [])
    except Exception as e:
        print(f"Error enriching M&A strategy: {e}")
    
    # Handle value  chain
    try:
        perplexity_valueChain = safe_call(
            generate_perplexity_value_chain,
            company_name,
            default=""
        )
        
        if perplexity_valueChain:
            openai_valueChain = safe_call(
                get_openai_valueChain,
                company_name,
                perplexity_valueChain,
                default={"value_chain": {}}
            )
            response_data['market_info']['value_chain'] = openai_valueChain.get('value_chain', {})
    except Exception as e:
        print(f"Error enriching fvalue chain: {e}")

         # Handle financial comparables
    try:
        perplexity_financialComparables = safe_call(
            generate_perplexity_financial_comparables,
            company_name,
            default=""
        )
        
        if perplexity_financialComparables:
            openai_financialComparables = safe_call(
                get_openai_financial_comparables,
                company_name,
                perplexity_financialComparables,
                default={"financial_comparables": {}}
            )
            response_data['competitive_analysis']['financial_comparables'] = openai_financialComparables.get('financial_comparables', {})
    except Exception as e:
        print(f"Error enriching financial comparables: {e}")

    
    try:
        competitors=coresignal_data.get("competitors","")
        topPeer=get_top_companies_by_similarity(competitors,3)
        perplexity_peerDevelopment = safe_call(
            generate_perplexity_peer_developments,
            company_name,
            topPeer,
            default=""
        )
        
        if perplexity_peerDevelopment:
            openai_peerDevelopments = safe_call(
                get_openai_peer_developments,
                company_name,
                perplexity_peerDevelopment,
                default={"companies_info": {}}
            )
            response_data['competitive_analysis']['peer_developments'] = openai_peerDevelopments.get('companies_info', {})
    except Exception as e:
        print(f"Error enriching peer developments: {e}")

    #Handle competitive analysis
    try:
        competitors=coresignal_data.get("competitors","")
        topPeer=get_top_companies_by_similarity(competitors,3)
        print("top peer",topPeer)
        competitiveAnalysisData = safe_call(
            get_openai_peer_competitorAnalysis, 
            company_name, 
            topPeer,
            default={"competitive_analysis":{}}
        )
        print("competitive analysis",competitiveAnalysisData)
        response_data["competitive_analysis"]["competitive_analysis"] = competitiveAnalysisData.get("competitive_analysis",{})
    except Exception as e:
        print(f"Error getting competitive analysis: {e}")
        response_data["competitive_analysis"]["competitive_analysis"] = ""

    response_data["strategy"]['businessModel'] = response_data["company_overview"]['business_model']

    try:
        executive_summary=get_openai_executive_summary(company_name, response_data["executive_summary"])
        response_data["executive_summary"]["executive_summary"] = executive_summary
    except Exception as e:
        print(f"Error getting competitive analysis: {e}")
        response_data["competitive_analysis"]["competitive_analysis"] = ""
    
    return {"success": True, "company_name": company_name, "data": response_data}

