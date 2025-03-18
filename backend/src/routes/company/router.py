from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import os
import requests
from dotenv import load_dotenv
from src.utils.crunchbase.company import get_organization_data
from src.utils.secFilings.getCik import get_cik_by_company_name
from src.utils.secFilings.analyse10K import analyze_10K_filing
# Load environment variables from .env file
load_dotenv()

# Initialize the FastAPI router
router = APIRouter()

# Pydantic model to define the request body
class CompanyRequest(BaseModel):
    company_name: str

# FastAPI route to fetch company data
@router.post("/")
async def get_company_data(request: CompanyRequest):
    """
    Takes a company name as input and returns organization data from Crunchbase.
    """
    company_name = request.company_name
    crunchBaseData = get_organization_data(company_name)
    
    company_cik=get_cik_by_company_name(company_name)
    print("company cik: " ,company_cik)
    sec10Kdata=analyze_10K_filing(company_cik)

    response_data = {}
    response_data["company_url"]=crunchBaseData.get("website","")
    response_data["image_url"]=crunchBaseData.get("image_url","")
    response_data["linkedin_url"]=crunchBaseData.get("linkedin","")
    response_data["executive_summary"]=sec10Kdata.get("executive_summary", ""),
    response_data["company_profile"]=sec10Kdata.get("firmographic",""
    )
    response_data["incorporation_date"]=crunchBaseData.get("founded_on","")
    response_data["key_financials"]=sec10Kdata.get("key_financials","")
    response_data["shareholders"]=sec10Kdata.get("shareholders","")
    response_data["company_overview"]=sec10Kdata.get("company_overview","")
    response_data["financial_summary"]=sec10Kdata.get("financial_summary","")
    response_data["acquirer"]=crunchBaseData.get("acquirer_identifier","")
    response_data["ma_map_strategy"]=crunchBaseData.get("acquiree_acquisitions","")
    response_data["market_landscape"]=sec10Kdata.get("market_landscape","")
    response_data["opportunities_risks"]=sec10Kdata.get("opportunities_risks","")
    response_data["regulation"]=sec10Kdata.get("regulatory_risks","")




    
    # Return the full JSON data as response
    return {"company_name": company_name, "data": response_data}

