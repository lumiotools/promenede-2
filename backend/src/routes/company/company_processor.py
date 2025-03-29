from src.utils.website_screenshot.screenshot import get_website_screenshot
from src.routes.company.helpers import (
    extract_financial_data, calculate_per, calculate_revenue_growth, 
    get_ceo_names, get_employee_review_trend, get_acquisitions, 
    extract_company_timeline, extract_product_details, extract_customer_success, 
    extract_market_map, extract_competitive_landscape, extract_financial_comparables, 
    combine_funding_and_founding, combine_webtraffic_and_founding, 
    extract_opportunities, extract_risks, extract_common_questions,
    get_ticker, get_unique_tags_from_coresignal, safe_call, safe_get
)

def prepare_company_response(
    company_name, 
    company_full_url, 
    coresignal_data, 
    crunchbase_data, 
    yahooData, 
    llmData, 
    key_members, 
    company_image_url
):
    """
    Prepares the comprehensive company data response
    """
    # Prepare the comprehensive response with safe defaults
    response_data = {
        # 1. Executive Summary
        "executive_summary": {
            "industry": safe_get(coresignal_data, "industry", default=""),
            "topic_tags": safe_get(coresignal_data, "categories_and_keywords", default=[]),
            "valuation": safe_get(crunchbase_data, "cards", "fields", "valuation", default=""),
            "equity_funding_total": safe_get(crunchbase_data, "cards", "fields", "equity_funding_total", default=""),
            "funding_total": safe_get(crunchbase_data, "cards", "fields", "funding_total", default=""),
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
                "description": "",
                "ceo": safe_call(get_ceo_names, coresignal_data, default=""),
                "tags": safe_call(get_unique_tags_from_coresignal, coresignal_data, default="")
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
            "launch_timeline": "",
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
            "value_chain": "",
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
    
    return response_data