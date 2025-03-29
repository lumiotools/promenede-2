from fastapi import APIRouter
from pydantic import BaseModel
from dotenv import load_dotenv

from src.routes.company.company_service import fetch_company_data


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
    Takes a company name and url as input and returns comprehensive company data
    for report generation based on CoreSignal API and Crunchbase.
    Prioritizes CoreSignal and Crunchbase data over SEC data.
    """
    result = await fetch_company_data(request.company_name, request.company_url)
    return result