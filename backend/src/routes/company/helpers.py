# Helper functions
def convert_null_to_none(data):
    """
    Convert all null data to None in various data structures.
    
    Handles:
    - Basic types (int, float, str, bool)
    - None values (keeps as None)
    - Lists and tuples (processes each element)
    - Dictionaries (processes both keys and values)
    - Custom objects with __dict__ attribute
    - Empty strings, NaN, "null", "NULL", "None" strings
    
    Args:
        data: Data of any type to be processed
        
    Returns:
        Processed data with all null values converted to None
    """
    # Handle None case
    if data is None:
        return None
    
    # Handle basic types
    if isinstance(data, (int, float, bool)) and not isinstance(data, bool):
        # Check for NaN
        if isinstance(data, float) and data != data:  # NaN check
            return None
        return data
    
    # Handle strings
    if isinstance(data, str):
        # Convert empty strings and null-like strings to None
        if data.strip() == "" or data.lower() in ["null", "none", "nan"]:
            return None
        return data
    
    # Handle lists and tuples
    if isinstance(data, (list, tuple)):
        result = [convert_null_to_none(item) for item in data]
        # Return same type as input
        return type(data)(result)
    
    # Handle dictionaries
    if isinstance(data, dict):
        result = {}
        for key, value in data.items():
            # Convert both keys and values
            processed_key = convert_null_to_none(key)
            processed_value = convert_null_to_none(value)
            
            # Skip entries where key becomes None after processing
            if processed_key is not None:
                result[processed_key] = processed_value
        return result
    
    # Handle custom objects with __dict__ attribute
    if hasattr(data, '__dict__'):
        obj_copy = type(data)()
        for key, value in data.__dict__.items():
            setattr(obj_copy, key, convert_null_to_none(value))
        return obj_copy
    
    # For all other types, return as is
    return data


def extract_financial_data(coresignal_data, field_name):
    """
    Extract financial data from nested structure
    
    Args:
        coresignal_data: Dictionary containing financial data
        field_name: Name of the field to extract (without nested path)
    
    Returns:
        List of dictionaries with value, currency and date information
    """
    if not coresignal_data or "income_statements" not in coresignal_data:
        return []
    
    # Get last 3 years of data
    statements = sorted(
        coresignal_data["income_statements"], 
        key=lambda x: x.get("period_end_date", ""), 
        reverse=True
    )[:3]
    
    result = []
    
    for stmt in statements:
        if field_name in stmt:
            # Convert null values to None
            value = convert_null_to_none(stmt[field_name])
            
            # For currency, first try to find specific currency field, otherwise use default
            currency_field = f"{field_name}_currency"
            currency = stmt.get(currency_field, stmt.get("currency", "USD"))
            
            result.append({
                "value": value,
                "currency": currency,
                "date": stmt.get("period_end_date", "")
            })
    
    return result


def calculate_per(coresignal_data):
    """Calculate Price to Earnings Ratio for public companies"""
    if not coresignal_data or "stock_information" not in coresignal_data or not coresignal_data["stock_information"]:
        return None
    
    # Get the latest stock information
    latest_stock = sorted(
        coresignal_data["stock_information"], 
        key=lambda x: x.get("date", ""), 
        reverse=True
    )[0]
    
    # Get the latest income statement with EPS
    if "income_statements" in coresignal_data and coresignal_data["income_statements"]:
        latest_statement = sorted(
            coresignal_data["income_statements"], 
            key=lambda x: x.get("period_end_date", ""), 
            reverse=True
        )[0]
        
        if "earnings_per_share" in latest_statement and latest_statement["earnings_per_share"] > 0:
            return {
                "value": latest_stock.get("closing_price", 0) / latest_statement.get("earnings_per_share", 1),
                "closing_price": latest_stock.get("closing_price", 0),
                "eps": latest_statement.get("earnings_per_share", 0),
                "date": latest_stock.get("date", "")
            }
    
    return None


def calculate_revenue_growth(coresignal_data):
    """Calculate revenue growth from income statements"""
    if not coresignal_data or "income_statements" not in coresignal_data:
        return []
    
    # Sort statements by date
    statements = sorted(
        coresignal_data["income_statements"], 
        key=lambda x: x.get("period_end_date", "")
    )
    
    growth = []
    for i in range(1, len(statements)):
        current = statements[i].get("revenue", 0)
        previous = statements[i-1].get("revenue", 0)
        
        if previous and current:
            growth_pct = ((current - previous) / previous) * 100
            growth.append({
                "value": round(growth_pct, 2),
                "previous_period": statements[i-1].get("period_end_date", ""),
                "current_period": statements[i].get("period_end_date", "")
            })
    
    return growth


def get_employee_review_trend(coresignal_data, category):
    """Extract employee review trend for a specific category"""
    if coresignal_data is None:
        return {
            "current": 0,
            "change": {
                "monthly": 0,
                "quarterly": 0,
                "yearly": 0
            },
            "trend": []
        }
    
    base_key = f"employee_reviews_score_{category}"
    change_key = f"{base_key}_change"
    by_month_key = f"{base_key}_by_month"
    
    # Get the change dictionary, defaulting to an empty dict if not present
    change_dict = coresignal_data.get(change_key, {})
    # Check if change_dict is None and default to empty dict if it is
    if change_dict is None:
        change_dict = {}
    
    return {
        "current": change_dict.get("current", 0),
        "change": {
            "monthly": change_dict.get("change_monthly", 0),
            "quarterly": change_dict.get("change_quarterly", 0),
            "yearly": change_dict.get("change_yearly", 0)
        },
        "trend": coresignal_data.get(by_month_key, [])
    }



def get_acquisitions(coresignal_data):
    """Get acquisition data from all available sources"""
    acquisitions = []
    
    for source in ["acquisition_list_source_1", "acquisition_list_source_2", "acquisition_list_source_5"]:
        if source in coresignal_data and coresignal_data[source]:
            acquisitions.extend(coresignal_data[source])
    
    return acquisitions


def extract_company_timeline(coresignal_data, crunchbase_data):
    """Extract company timeline from CoreSignal and Crunchbase data"""
    timeline = []
    
    # Founded date
    founded_year = coresignal_data.get("founded_year", "")
    if founded_year:
        timeline.append({
            "date": founded_year,
            "event": "Company founded",
            "description": f"{coresignal_data.get('company_name', '')} was founded"
        })
    
    # Funding rounds from Crunchbase
    if "funding_rounds" in coresignal_data and coresignal_data["funding_rounds"]:
        for funding in coresignal_data["funding_rounds"]:
            if funding and funding.get("announced_date"):  # Check if funding is not None first
                timeline.append({
                    "date": funding.get("announced_date", ""),
                    "event": f"Raised {funding.get('amount_raised', 0)} {funding.get('amount_raised_currency', 'USD')} in {funding.get('name', 'funding round')}",
                    "description": f"Led by {', '.join(funding.get('lead_investors', ['Unnamed investors']))}"
                })
    
    # IPO date
    ipo_date = coresignal_data.get("ipo_date", "")
    if ipo_date:
        timeline.append({
            "date": ipo_date,
            "event": "Initial Public Offering (IPO)",
            "description": f"Share price: {coresignal_data.get('ipo_share_price', 0)} {coresignal_data.get('ipo_share_price_currency', 'USD')}"
        })
    
    # Acquisitions
    acquisitions = get_acquisitions(coresignal_data)
    for acq in acquisitions:
        if acq and acq.get("announced_date"):  # Check if acq is not None first
            price = acq.get("price")
            price_str = str(price) if price is not None else "Undisclosed"
            timeline.append({
                "date": acq.get("announced_date", ""),
                "event": f"Acquired {acq.get('acquiree_name', '')}",
                "description": f"Price: {price_str} {acq.get('currency', 'USD')}"
            })
    
    # Being acquired
    if "acquired_by_summary" in coresignal_data and coresignal_data["acquired_by_summary"]:
        acq = coresignal_data["acquired_by_summary"]
        if acq and acq.get("announced_date"):  # Check if acq is not None first
            price = acq.get("price")
            price_str = str(price) if price is not None else "Undisclosed"
            timeline.append({
                "date": acq.get("announced_date", ""),
                "event": f"Acquired by {acq.get('acquirer_name', '')}",
                "description": f"Price: {price_str} {acq.get('currency', 'USD')}"
            })
    
    # Key executive changes
    if "key_employee_change_events" in coresignal_data and coresignal_data["key_employee_change_events"]:
        for event in coresignal_data["key_employee_change_events"]:
            if event and event.get("employee_change_event_date"):  # Check if event is not None first
                timeline.append({
                    "date": event.get("employee_change_event_date", ""),
                    "event": event.get("employee_change_event_name", ""),
                    "description": "",
                    "url": event.get("employee_change_event_url", "")
                })
    
    # Filter out any items with empty or None dates
    timeline = [item for item in timeline if item.get("date")]
    
    # Sort by date - use a key function that handles different date formats or None values
    def safe_date_key(item):
        date_value = item.get("date", "")
        # Convert date_value to string if it's not already
        if date_value is None:
            return ""
        return str(date_value)
    
    return sorted(timeline, key=safe_date_key)
def extract_product_details(coresignal_data, crunchbase_data):
    """Extract product details from available data"""
    products = []
    
    # Extract from categories and keywords
    if "categories_and_keywords" in coresignal_data and coresignal_data["categories_and_keywords"]:
        products.append({
            "name": "Product Categories",
            "description": ", ".join(coresignal_data["categories_and_keywords"])
        })
    
    # Extract from Crunchbase categories
    if "categories" in crunchbase_data and crunchbase_data["categories"]:
        for category in crunchbase_data["categories"]:
            if isinstance(category, dict) and "name" in category:
                products.append({
                    "name": category["name"],
                    "description": category.get("description", "")
                })
    
    # Add pricing information
    pricing = []
    if "product_pricing_summary" in coresignal_data and coresignal_data["product_pricing_summary"]:
        for price_plan in coresignal_data["product_pricing_summary"]:
            pricing.append({
                "type": price_plan.get("type", ""),
                "price": price_plan.get("price", ""),
                "details": price_plan.get("details", "")
            })
    
    if pricing:
        products.append({
            "name": "Pricing Plans",
            "description": "",
            "pricing": pricing
        })
    
    # Add product features
    features = []
    if coresignal_data.get("free_trial_available", False):
        features.append("Free Trial Available")
    if coresignal_data.get("demo_available", False):
        features.append("Demo Available")
    if coresignal_data.get("is_downloadable", False):
        features.append("Downloadable")
    if coresignal_data.get("mobile_apps_exist", False):
        features.append("Mobile Apps Available")
    if coresignal_data.get("api_docs_exist", False):
        features.append("API Documentation Available")
    
    if features:
        products.append({
            "name": "Product Features",
            "description": ", ".join(features)
        })
    
    return products


def extract_product_timeline(coresignal_data, crunchbase_data):
    """Extract product launch timeline from available data"""
    # This is typically not available in CoreSignal or Crunchbase directly
    # You might need to extract from news articles or company updates
    
    timeline = []
    
    # Try to extract from company updates if available
    if "company_updates_collection" in coresignal_data and coresignal_data["company_updates_collection"]:
        for update in coresignal_data["company_updates_collection"]:
            if update is None:
                continue
                
            description = update.get("description", "")
            if description is not None and any(keyword in description.lower() for keyword in ["launch", "product", "release", "new", "introducing"]):
                timeline.append({
                    "date": update.get("date", ""),
                    "event": "Product Update",
                    "description": description[:200] + ("..." if len(description) > 200 else "")
                })
    
    # Try to extract from news articles
    if "news_articles" in coresignal_data and coresignal_data["news_articles"]:
        for article in coresignal_data["news_articles"]:
            if article is None:
                continue
                
            headline = article.get("headline", "")
            if headline is not None and any(keyword in headline.lower() for keyword in ["launch", "product", "release", "new", "introducing"]):
                summary = article.get("summary", "")
                if summary is None:
                    summary = ""
                    
                timeline.append({
                    "date": article.get("published_date", ""),
                    "event": headline,
                    "description": summary,
                    "url": article.get("article_url", "")
                })
    
    # Sort by date, handling None values
    def safe_date_key(item):
        date = item.get("date")
        return "" if date is None else str(date)
        
    return sorted(timeline, key=safe_date_key, reverse=True)

def extract_strategic_development(coresignal_data, crunchbase_data):
    """Extract strategic developments from available data"""
    developments = []
    
    # Try to extract from news articles
    if "news_articles" in coresignal_data and coresignal_data["news_articles"]:
        for article in coresignal_data["news_articles"]:
            if article is None:
                continue
                
            headline = article.get("headline", "")
            summary = article.get("summary", "")
            
            # Handle potential None values
            if headline is None:
                headline = ""
            if summary is None:
                summary = ""
                
            combined_text = (headline + summary).lower()
            
            if any(keyword in combined_text for keyword in ["strategy", "strategic", "development", "expand", "growth"]):
                developments.append({
                    "date": article.get("published_date", ""),
                    "headline": headline,
                    "summary": summary,
                    "url": article.get("article_url", "")
                })
    
    # Try to extract from company updates
    if "company_updates_collection" in coresignal_data and coresignal_data["company_updates_collection"]:
        for update in coresignal_data["company_updates_collection"]:
            if update is None:
                continue
                
            description = update.get("description", "")
            if description is not None and any(keyword in description.lower() for keyword in ["strategy", "strategic", "development", "expand", "growth"]):
                # Handle potential overly long descriptions
                description_preview = description[:200]
                if len(description) > 200:
                    description_preview += "..."
                    
                developments.append({
                    "date": update.get("date", ""),
                    "headline": "Company Update",
                    "summary": description_preview
                })
    
    # Sort by date, handling None values
    def safe_date_key(item):
        date = item.get("date")
        return "" if date is None else str(date)
        
    return sorted(developments, key=safe_date_key, reverse=True)

def extract_company_strategy(coresignal_data, crunchbase_data):
    """Extract company strategy information"""
    strategy = {
        "latest_strategy": "",
        "strategic_focus": []
    }
    
    # Extract from company description
    if "description_enriched" in coresignal_data and coresignal_data["description_enriched"]:
        strategy["latest_strategy"] = coresignal_data["description_enriched"]
    
    # Extract from categories and keywords for strategic focus
    if "categories_and_keywords" in coresignal_data and coresignal_data["categories_and_keywords"]:
        strategy["strategic_focus"] = [
            keyword for keyword in coresignal_data["categories_and_keywords"]
            if any(focus in keyword.lower() for focus in ["strategy", "focus", "mission", "vision", "goal"])
        ]
    
    return strategy


def extract_customer_success(coresignal_data, crunchbase_data):
    """Extract customer success stories"""
    # This information is typically not directly available in the data
    # You might need to extract from company updates or news
    
    success_stories = []
    
    # Try to extract from company updates or news
    if "company_updates_collection" in coresignal_data and coresignal_data["company_updates_collection"]:
        for update in coresignal_data["company_updates_collection"]:
            description = update.get("description", "")
            if any(keyword in description.lower() for keyword in ["customer", "success", "case study", "testimonial"]):
                success_stories.append({
                    "date": update.get("date", ""),
                    "title": "Customer Success Story",
                    "description": description[:200] + ("..." if len(description) > 200 else "")
                })
    
    # Try to extract from news articles
    if "news_articles" in coresignal_data and coresignal_data["news_articles"]:
        for article in coresignal_data["news_articles"]:
            headline = article.get("headline", "")
            if any(keyword in headline.lower() for keyword in ["customer", "success", "case study", "testimonial"]):
                success_stories.append({
                    "date": article.get("published_date", ""),
                    "title": headline,
                    "description": article.get("summary", ""),
                    "url": article.get("article_url", "")
                })
    
    return sorted(success_stories, key=lambda x: x.get("date", ""), reverse=True)


def extract_value_chain(coresignal_data, crunchbase_data):
    """Extract value chain information"""
    # This is typically not directly available in the data
    value_chain = []
    
    # Use industry to infer value chain
    industry = coresignal_data.get("industry", "")
    if industry:
        value_chain.append({
            "stage": "Industry",
            "description": industry
        })
    
    # Use technologies for supply chain inference
    if "technologies_used" in coresignal_data and coresignal_data["technologies_used"]:
        tech_categories = {}
        for tech in coresignal_data["technologies_used"]:
            if isinstance(tech, dict):
                category = tech.get("category", "Other")
                tech_name = tech.get("technology", "")
            else:
                category = "Other"
                tech_name = tech
                
            if category not in tech_categories:
                tech_categories[category] = []
            tech_categories[category].append(tech_name)
        
        for category, techs in tech_categories.items():
            value_chain.append({
                "stage": category,
                "description": ", ".join(techs[:5]) + ("..." if len(techs) > 5 else "")
            })
    
    return value_chain


# FastAPI route to fetch company data
def extract_market_map(coresignal_data, crunchbase_data):
    """Extract market map information"""
    market_map = {
        "industry": coresignal_data.get("industry", ""),
        "segments": [],
        "related_industries": []
    }
    
    # Extract segments from categories and keywords
    if "categories_and_keywords" in coresignal_data and coresignal_data["categories_and_keywords"]:
        market_map["segments"] = coresignal_data["categories_and_keywords"][:10]  # Limit to top 10
    
    # Extract related industries from competitors
    if "competitors" in coresignal_data and coresignal_data["competitors"]:
        industries = set()
        for competitor in coresignal_data["competitors"]:
            comp_name = competitor.get("company_name", "")
            # This would require additional API calls to get competitor industries
            # For now, just add the competitor name
            if comp_name:
                industries.add(comp_name)
        
        market_map["related_industries"] = list(industries)
    
    return market_map


def extract_competitive_landscape(coresignal_data):
    """Extract competitive landscape information"""
    landscape = []
    
    if "competitors" in coresignal_data and coresignal_data["competitors"]:
        for competitor in coresignal_data["competitors"]:
            comp = {
                "name": competitor.get("company_name", ""),
                "similarity_score": competitor.get("similarity_score", 0)
            }
            
            # Handle None values for similarity_score
            if comp["similarity_score"] is None:
                comp["similarity_score"] = 0
            
            # Add website info if available
            if "competitors_websites" in coresignal_data:
                for website in coresignal_data["competitors_websites"]:
                    # First check if website is None
                    if website is None:
                        continue
                        
                    # Check if name is not empty before trying to use find
                    if comp["name"] and website.get("website"):
                        if website.get("website", "").find(comp["name"].lower()) >= 0:
                            comp["website"] = website.get("website", "")
                            comp["monthly_visits"] = website.get("total_website_visits_monthly", 0)
                            comp["rank_category"] = website.get("rank_category", 0)
                            break
            
            landscape.append(comp)
    
    # Define a safe sorting key function
    def safe_similarity_score(item):
        score = item.get("similarity_score")
        if score is None:
            return 0
        return score
    
    # Sort by similarity score (descending)
    return sorted(landscape, key=safe_similarity_score, reverse=True)


def extract_financial_comparables(coresignal_data):
    """Extract financial comparables information for top competitors"""
    comparables = []
    top_competitors = []
    
    # Get top 3 competitors with proper handling of None values
    if "competitors" in coresignal_data and coresignal_data["competitors"]:
        # Define safe key function for sorting
        def safe_similarity_score(competitor):
            score = competitor.get("similarity_score")
            if score is None:
                return 0
            return score
        
        # Sort competitors safely
        top_competitors = sorted(
            coresignal_data["competitors"], 
            key=safe_similarity_score, 
            reverse=True
        )[:3]
    
    # For a real implementation, you would need to fetch financial data for these competitors
    # This would require additional API calls
    for competitor in top_competitors:
        comparables.append({
            "name": competitor.get("company_name", ""),
            "similarity_score": competitor.get("similarity_score", 0),
            "financial_data": {
                "revenue": "N/A",  # Would need additional API call
                "profit": "N/A",   # Would need additional API call
                "employees": "N/A"  # Would need additional API call
            }
        })
    
    return comparables

def combine_funding_and_founding(coresignal_data, crunchbase_data):
    """Combine funding data with founding year for comparison"""
    result = {
        "company_data": {
            "name": coresignal_data.get("company_name", ""),
            "founded_year": coresignal_data.get("founded_year", ""),
            "total_funding": 0
        },
        "competitors_data": []
    }
    
    # Calculate total funding for the company
    if "funding_rounds" in coresignal_data and coresignal_data["funding_rounds"]:
        total_funding = 0
        for funding in coresignal_data["funding_rounds"]:
            # Handle None values in amount_raised
            amount = funding.get("amount_raised")
            if amount is not None:
                total_funding += amount
            # Alternative approach if needed:
            # total_funding += (0 if funding.get("amount_raised") is None else funding.get("amount_raised"))
        result["company_data"]["total_funding"] = total_funding
    
    # Add competitor data (would need additional API calls in real implementation)
    if "competitors" in coresignal_data and coresignal_data["competitors"]:
        # Create a safe sorting function for competitors
        def safe_similarity_score(competitor):
            score = competitor.get("similarity_score")
            return 0 if score is None else score
            
        # Get top 5 competitors
        top_competitors = sorted(
            coresignal_data["competitors"], 
            key=safe_similarity_score, 
            reverse=True
        )[:5]  # Limit to top 5
        
        for competitor in top_competitors:
            result["competitors_data"].append({
                "name": competitor.get("company_name", ""),
                "founded_year": "N/A",  # Would need additional API call
                "total_funding": "N/A"   # Would need additional API call
            })
    
    return result



def combine_webtraffic_and_founding(coresignal_data):
    """Combine web traffic data with founding year for comparison"""
    result = {
        "company_data": {
            "name": coresignal_data.get("company_name", ""),
            "founded_year": coresignal_data.get("founded_year", ""),
            "monthly_traffic": coresignal_data.get("total_website_visits_monthly", 0)
        },
        "competitors_data": []
    }
    
    # Add competitor data
    if "competitors_websites" in coresignal_data and coresignal_data["competitors_websites"]:
        for website in coresignal_data["competitors_websites"][:5]:  # Limit to top 5
            result["competitors_data"].append({
                "name": extract_company_name_from_website(website.get("website", "")),
                "founded_year": "N/A",  # Would need additional API call
                "monthly_traffic": website.get("total_website_visits_monthly", 0)
            })
    
    return result


def extract_company_name_from_website(website):
    """Extract company name from website URL"""
    if not website:
        return "Unknown"
    
    # Simple extraction, could be improved
    parts = website.replace("http://", "").replace("https://", "").split(".")
    if len(parts) >= 2:
        return parts[0].capitalize()
    return "Unknown"


def extract_regulation_info(coresignal_data, crunchbase_data):
    """Extract regulation information"""
    # This information is typically not directly available in the data
    # Would need to be extracted from news articles or company updates
    regulations = []
    
    # Try to extract from news articles
    if "news_articles" in coresignal_data and coresignal_data["news_articles"]:
        for article in coresignal_data["news_articles"]:
            headline = article.get("headline", "")
            summary = article.get("summary", "")
            if any(keyword in (headline + summary).lower() for keyword in ["regulation", "compliance", "legal", "law", "regulatory"]):
                regulations.append({
                    "date": article.get("published_date", ""),
                    "title": headline,
                    "description": summary,
                    "url": article.get("article_url", "")
                })
    
    return regulations


def extract_opportunities(coresignal_data, crunchbase_data):
    """Extract business opportunities"""
    # This would typically be derived from market position, growth trends, etc.
    opportunities = []
    
    # Growth indicators
    if "total_website_visits_change" in coresignal_data:
        change = coresignal_data.get("total_website_visits_change")
        # Check if change is not None and if change_yearly_percentage is not None
        yearly_percentage = change.get("change_yearly_percentage") if change is not None else None
        if yearly_percentage is not None and yearly_percentage > 10:  # Arbitrary threshold
            opportunities.append({
                "area": "Market Growth",
                "detail": f"Website traffic growing at {yearly_percentage}% year over year",
                "rationale": "Indicates strong market interest and potential for expansion"
            })
    
    # Employee growth
    if "employees_count_change" in coresignal_data:
        change = coresignal_data.get("employees_count_change")
        # Check if change is not None and if change_yearly_percentage is not None
        yearly_percentage = change.get("change_yearly_percentage") if change is not None else None
        if yearly_percentage is not None and yearly_percentage > 10:  # Arbitrary threshold
            opportunities.append({
                "area": "Organizational Growth",
                "detail": f"Employee count growing at {yearly_percentage}% year over year",
                "rationale": "Indicates company expansion and potential new product/market development"
            })
    
    # Product reviews
    product_score = coresignal_data.get("product_reviews_aggregate_score")
    if product_score is not None and product_score > 4:
        opportunities.append({
            "area": "Product Excellence",
            "detail": f"High product rating of {product_score} out of 5",
            "rationale": "Strong product satisfaction enables premium pricing and market expansion"
        })
    
    return opportunities
def extract_risks(coresignal_data, crunchbase_data):
    """Extract business risks"""
    # This would typically be derived from market position, competitive threats, etc.
    risks = []
    
    # Traffic decline
    if "total_website_visits_change" in coresignal_data:
        change = coresignal_data.get("total_website_visits_change")
        # Check if change is not None and if change_yearly_percentage is not None
        yearly_percentage = change.get("change_yearly_percentage") if change is not None else None
        if yearly_percentage is not None and yearly_percentage < -5:  # Arbitrary threshold
            risks.append({
                "area": "Market Decline",
                "detail": f"Website traffic declining at {abs(yearly_percentage)}% year over year",
                "rationale": "May indicate reduced market interest or competitive pressure"
            })
    
    # Employee decline
    if "employees_count_change" in coresignal_data:
        change = coresignal_data.get("employees_count_change")
        # Check if change is not None and if change_yearly_percentage is not None
        yearly_percentage = change.get("change_yearly_percentage") if change is not None else None
        if yearly_percentage is not None and yearly_percentage < -5:  # Arbitrary threshold
            risks.append({
                "area": "Organizational Contraction",
                "detail": f"Employee count declining at {abs(yearly_percentage)}% year over year",
                "rationale": "May indicate operational challenges or strategic shifts"
            })
    
    # Strong competitors
    if "competitors" in coresignal_data and coresignal_data["competitors"]:
        # Need to handle empty lists or None competitors
        competitors = coresignal_data.get("competitors")
        if competitors and len(competitors) > 0:
            # Use a safe method to find the max that handles None values
            try:
                top_competitor = max(competitors, key=lambda x: x.get("similarity_score", 0) or 0)
                if top_competitor.get("similarity_score", 0) > 80:  # Arbitrary threshold
                    risks.append({
                        "area": "Competitive Pressure",
                        "detail": f"Strong competitor {top_competitor.get('company_name', '')} with high similarity score",
                        "rationale": "May face direct competition and pressure on margins"
                    })
            except (ValueError, TypeError):
                # Handle the case where max() fails (e.g., empty list or all None values)
                pass
    
    # Poor reviews
    product_score = coresignal_data.get("product_reviews_aggregate_score")
    if product_score is not None and product_score < 3:
        risks.append({
            "area": "Product Issues",
            "detail": f"Low product rating of {product_score} out of 5",
            "rationale": "May struggle with customer retention and acquisition"
        })
    
    return risks


def extract_common_questions(coresignal_data, crunchbase_data):
    """Extract common questions about the company"""
    company_name = coresignal_data.get("company_name", "the company")
    questions = [
        {
            "question": f"What is {company_name}'s business model?",
            "answer": f"{'B2B' if coresignal_data.get('is_b2b', 0) == 1 else 'B2C'} business primarily in the {coresignal_data.get('industry', '')} industry."
        },
        {
            "question": f"How many employees does {company_name} have?",
            "answer": f"{coresignal_data.get('employees_count', 'N/A')} employees as of the latest data."
        },
        {
            "question": f"What is {company_name}'s market position?",
            "answer": f"Ranked #{coresignal_data.get('rank_category', 'N/A')} in its category with {coresignal_data.get('total_website_visits_monthly', 'N/A')} monthly website visits."
        },
        {
            "question": f"Who are {company_name}'s main competitors?",
            "answer": generate_competitors_answer(coresignal_data)
        },
        {
            "question": f"What technologies does {company_name} use?",
            "answer": generate_technologies_answer(coresignal_data)
        }
    ]
    
    return questions


def generate_competitors_answer(coresignal_data):
    """Generate answer about competitors"""
    if "competitors" not in coresignal_data or not coresignal_data["competitors"]:
        return "No competitor information available."
    
    # Define a safe key function for sorting that handles None values
    def safe_similarity_score(competitor):
        score = competitor.get("similarity_score")
        return 0 if score is None else score
    
    try:
        # Use the safe key function for sorting
        top_competitors = sorted(
            coresignal_data["competitors"],
            key=safe_similarity_score,
            reverse=True
        )[:3]
        
        # Extract competitor names, handling potential None values
        competitor_names = []
        for comp in top_competitors:
            name = comp.get("company_name", "")
            if name:  # Only add non-empty names
                competitor_names.append(name)
        
        if competitor_names:
            return f"Main competitors include {', '.join(competitor_names)}."
        else:
            return "Competitor information is incomplete."
            
    except (TypeError, ValueError, AttributeError) as e:
        # Handle any unexpected errors during sorting or processing
        return "Unable to analyze competitor information."

def generate_technologies_answer(coresignal_data):
    """Generate answer about technologies used"""
    if "technologies_used" not in coresignal_data or not coresignal_data["technologies_used"]:
        return "No technology stack information available."
    
    # Group technologies by category
    tech_categories = {}
    for tech in coresignal_data["technologies_used"]:
        if isinstance(tech, dict):
            category = tech.get("category", "Other")
            technology = tech.get("technology", "")
        else:
            category = "Other"
            technology = tech
            
        if category not in tech_categories:
            tech_categories[category] = []
        tech_categories[category].append(technology)
    
    # Format the answer
    answer = "Key technologies include: "
    for category, techs in list(tech_categories.items())[:3]:  # Limit to top 3 categories
        answer += f"{category}: {', '.join(techs[:3])}; "  # Limit to top 3 techs per category
    
    return answer.rstrip("; ") + "."








