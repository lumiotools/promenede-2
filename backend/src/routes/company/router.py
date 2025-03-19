from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import os
import requests
from dotenv import load_dotenv
from src.utils.crunchbase.company import get_organization_data
from src.utils.secFilings.getCik import get_cik_by_company_name
from src.utils.secFilings.analyse10K import analyze_10K_filing
from src.utils.coresignal.company import get_company_details,get_company_id
from src.routes.company.helpers import extract_financial_data, calculate_per, calculate_revenue_growth, get_employee_review_trend, get_acquisitions, extract_company_timeline, extract_product_details, extract_product_timeline, extract_strategic_development, extract_company_strategy, extract_customer_success, extract_value_chain, extract_market_map, extract_competitive_landscape, extract_financial_comparables, combine_funding_and_founding, combine_webtraffic_and_founding, extract_company_name_from_website, extract_regulation_info, extract_opportunities, extract_risks, extract_common_questions, generate_competitors_answer, generate_technologies_answer,convert_null_to_none
# Load environment variables from .env file
load_dotenv()

# Initialize the FastAPI router
router = APIRouter()

# Pydantic model to define the request body
class CompanyRequest(BaseModel):
    company_name: str
@router.post("/")
async def get_company_data(request: CompanyRequest):
    """
    Takes a company name as input and returns comprehensive company data
    for report generation based on CoreSignal API and Crunchbase.
    Prioritizes CoreSignal and Crunchbase data over SEC data.
    """
    company_name = request.company_name
    
    # Get data from different sources
    crunchbase_data = get_organization_data(company_name)
    print("crunchbase data",crunchbase_data)
    
    # Only get SEC data as fallback
    company_cik = None
    sec_10k_data = {}
    
    company_url = crunchbase_data.get("cards", {}).get("fields", {}).get("website", {}).get("value", "")
    print("company url",company_url)
    if not company_url and "domain" in crunchbase_data:
        company_url = crunchbase_data.get("domain", "")
    
    company_enrichment_id = get_company_id(company_url)
    print("enrichment id",company_enrichment_id)
    coresignal_data = get_company_details(company_enrichment_id)
    coresignal_data=convert_null_to_none(coresignal_data)
    
    # If critical data is missing, then try SEC as fallback
    # if not coresignal_data or not coresignal_data.get("company_name"):
    #     company_cik = get_cik_by_company_name(company_name)
    #     sec_10k_data = analyze_10K_filing(company_cik) if company_cik else {}
    
    # Prepare the comprehensive response
    response_data = {
        # 1. Executive Summary
        "executive_summary": coresignal_data.get("description_enriched", "") or crunchbase_data.get("description", "") or sec_10k_data.get("executive_summary", ""),
        
        # 2. Company Profile
        "company_profile": {
            # a. Firmographic
            "firmographic": {
                "name": coresignal_data.get("company_name", ""),
                "legal_name": coresignal_data.get("company_legal_name", ""),
                "incorporation_date": crunchbase_data.get("cards", {}).get("fields", {}).get("founded_on", {}).get("value", ""),
                "hq_address": coresignal_data.get("hq_location", ""),
                "hq_city": coresignal_data.get("hq_city", ""),
                "hq_state": coresignal_data.get("hq_state", ""),
                "hq_country": coresignal_data.get("hq_country", ""),
                "industry": coresignal_data.get("industry", ""),
                "type": coresignal_data.get("type", ""),
                "revenue_range": coresignal_data.get("revenue_annual_range", {}),
                "employees_count": coresignal_data.get("employees_count", 0),
                "products_services": crunchbase_data.get("cards", {}).get("fields", {}).get("categories", ""),
                "description": coresignal_data.get("description", "")
            },
            
            # b. Key Financials
            "key_financials": {
                "income_statements": coresignal_data.get("income_statements", []),
                 "operating_revenue": extract_financial_data(coresignal_data, "revenue"),
    "operating_profit": extract_financial_data(coresignal_data, "ebit"),
    "ebitda": extract_financial_data(coresignal_data, "ebitda"),
    "net_income": extract_financial_data(coresignal_data, "net_income"),
                "per": calculate_per(coresignal_data),
                "revenue_growth": calculate_revenue_growth(coresignal_data)
            },
            
            # c. Shareholders
            "shareholders": crunchbase_data.get("investors", []) or sec_10k_data.get("shareholders", [])
        },
        
        # 3. Company Overview
        "company_overview": {
            "business_model": coresignal_data.get("is_b2b", 0) == 1 and "B2B" or "B2C",
            "products_brands": crunchbase_data.get("cards", {}).get("fields", {}).get("categories", ""),
            "customers": coresignal_data.get("categories_and_keywords", []) or [],
            "description_enriched": coresignal_data.get("description_enriched", "")
        },
        
        # 4. Financial Summary
        "financial_summary": coresignal_data.get("income_statements", []),
        
        # 5. Web Traffic
        "web_traffic": {
            "monthly_visits": coresignal_data.get("total_website_visits_monthly", 0),
            "visits_by_country": coresignal_data.get("visits_breakdown_by_country", []),
            "visits_by_month": coresignal_data.get("total_website_visits_by_month", []),
            "visits_change": coresignal_data.get("total_website_visits_change", {}),
            "bounce_rate": coresignal_data.get("bounce_rate", 0),
            "pages_per_visit": coresignal_data.get("pages_per_visit", 0),
            "average_visit_duration": coresignal_data.get("average_visit_duration_seconds", 0)
        },
        
        # 6. Company Group Structure
        "group_structure": {
            "parent_company": coresignal_data.get("parent_company_information", {}),
            "subsidiaries": crunchbase_data.get("child_organizations", []) or []
        },
        
        # 7. Company Timeline
        "company_timeline": extract_company_timeline(coresignal_data, crunchbase_data),
        
        # 8-9. Products & Services and Launch Timeline
        "products_services": {
            "details": extract_product_details(coresignal_data, crunchbase_data),
            "launch_timeline": extract_product_timeline(coresignal_data, crunchbase_data),
            "pricing_available": coresignal_data.get("pricing_available", False),
            "free_trial_available": coresignal_data.get("free_trial_available", False),
            "demo_available": coresignal_data.get("demo_available", False),
            "product_reviews": {
                "count": coresignal_data.get("product_reviews_count", 0),
                "score": coresignal_data.get("product_reviews_aggregate_score", 0),
                "by_month": coresignal_data.get("product_reviews_score_by_month", []),
                "distribution": coresignal_data.get("product_reviews_score_distribution", {})
            }
        },
        
        # 10-12. Organization: Employees, Key Members, Leadership
        "organization": {
            "employees_trend": {
                "count_by_month": coresignal_data.get("employees_count_by_month", []),
                "count_change": coresignal_data.get("employees_count_change", {}),
                "breakdown_by_department": coresignal_data.get("employees_count_breakdown_by_department", {}),
                "breakdown_by_department_by_month": coresignal_data.get("employees_count_breakdown_by_department_by_month", {}),
                "breakdown_by_country": coresignal_data.get("employees_count_by_country", []),
                "breakdown_by_region": coresignal_data.get("employees_count_breakdown_by_region", {}),
                "breakdown_by_seniority": coresignal_data.get("employees_count_breakdown_by_seniority", {})
            },
            "key_members": coresignal_data.get("key_executives", []),
            "leadership": {
                "key_executives": coresignal_data.get("key_executives", []),
                "arrivals": coresignal_data.get("key_executive_arrivals", []),
                "departures": coresignal_data.get("key_executive_departures", []),
                "change_events": coresignal_data.get("key_employee_change_events", [])
            },
            
            # 13-15. Employee Reviews
            "employee_reviews": {
                "count": coresignal_data.get("company_employee_reviews_count", 0),
                "score": coresignal_data.get("company_employee_reviews_aggregate_score", 0),
                "breakdown": coresignal_data.get("employee_reviews_score_breakdown", {}),
                "distribution": coresignal_data.get("employee_reviews_score_distribution", {}),
                "by_category": {
                    "business_outlook": get_employee_review_trend(coresignal_data, "business_outlook"),
                    "career_opportunities": get_employee_review_trend(coresignal_data, "career_opportunities"),
                    "ceo_approval": get_employee_review_trend(coresignal_data, "ceo_approval"),
                    "compensation_benefits": get_employee_review_trend(coresignal_data, "compensation_benefits"),
                    "culture_values": get_employee_review_trend(coresignal_data, "culture_values"),
                    "diversity_inclusion": get_employee_review_trend(coresignal_data, "diversity_inclusion"),
                    "recommend": get_employee_review_trend(coresignal_data, "recommend"),
                    "senior_management": get_employee_review_trend(coresignal_data, "senior_management"),
                    "work_life_balance": get_employee_review_trend(coresignal_data, "work_life_balance")
                }
            }
        },
        
        # 16. Strategic Alliance & Partnership
        "strategic_alliances": crunchbase_data.get("partnerships", []) or [],
        
        # 17. Market Leadership
        "market_leadership": {
            "industry": coresignal_data.get("industry", ""),
            "rank_category": coresignal_data.get("rank_category", 0),
            "rank_global": coresignal_data.get("rank_global", 0)
        },
        
        # 18. Key Technology
        "key_technology": {
            "technologies_used": coresignal_data.get("technologies_used", []),
            "num_technologies": coresignal_data.get("num_technologies_used", 0)
        },
        
        # 19-21. Strategic Development, Strategy, Customer Success
        "strategic_development": extract_strategic_development(coresignal_data, crunchbase_data),
        "strategy": extract_company_strategy(coresignal_data, crunchbase_data),
        "customer_success": extract_customer_success(coresignal_data, crunchbase_data),
        
        # 22-23. M&A
        "ma_activity": {
            "acquisitions": get_acquisitions(coresignal_data),
            "acquired_by": coresignal_data.get("acquired_by_summary", {})
        },
        
        # 24-26. Market Info
        "market_info": {
            "size": crunchbase_data.get("market_size", {}) or {},
            "value_chain": extract_value_chain(coresignal_data, crunchbase_data),
            "market_map": extract_market_map(coresignal_data, crunchbase_data)
        },
        
        # 27-30. Competitive Analysis
        "competitive_analysis": {
            "landscape": extract_competitive_landscape(coresignal_data),
            "competitors": coresignal_data.get("competitors", []),
            "competitors_websites": coresignal_data.get("competitors_websites", []),
            "financial_comparables": extract_financial_comparables(coresignal_data),
            "peer_developments": {
                "funding_vs_founded": combine_funding_and_founding(coresignal_data, crunchbase_data),
                "webtraffic_vs_founded": combine_webtraffic_and_founding(coresignal_data)
            }
        },
        
        # 31-35. Regulation, Opportunities/Risks, Q&A
        "regulation": extract_regulation_info(coresignal_data, crunchbase_data),
        "opportunities_risks": {
            "opportunities": extract_opportunities(coresignal_data, crunchbase_data),
            "risks": extract_risks(coresignal_data, crunchbase_data)
        },
        "qa": extract_common_questions(coresignal_data, crunchbase_data),
        
        # URLs for the frontend
        "urls": {
            "company_url": coresignal_data.get("website", ""),
            "image_url": crunchbase_data.get("image_url", ""),
            "linkedin_url": coresignal_data.get("professional_network_url", ""),
            "facebook_url": coresignal_data.get("facebook_url", []),
            "twitter_url": coresignal_data.get("twitter_url", ""),
            "youtube_url": coresignal_data.get("youtube_url", []),
            "instagram_url": coresignal_data.get("instagram_url", []),
            "github_url": coresignal_data.get("github_url", []),
            "discord_url": coresignal_data.get("discord_url", [])
        }
    }
    
    return {"company_name": company_name, "data": response_data}


