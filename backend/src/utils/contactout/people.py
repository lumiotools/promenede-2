import requests
from dotenv import load_dotenv
import os

load_dotenv()

CONTACTOUT_API_KEY = os.getenv('CONTACTOUT_API_KEY')

def get_people_experience_and_education(name, position, company):
    response = requests.post(
        "https://api.contactout.com/v1/people/search",
        headers={
            "token": CONTACTOUT_API_KEY
        },
        json={
            "name": name,
            "job_title": [position],
            "company": [company]
        }
    )
    
    try:
        response.raise_for_status()
        data = response.json()
        matching_profile = None
        
        for key, profile in data["profiles"].items():
            if profile["full_name"] == name:
                profile["linkedin_url"] = key
                matching_profile = profile
                
        if not matching_profile:
            raise Exception("No profiles found")
        
        return matching_profile["linkedin_url"], matching_profile["experience"], matching_profile["education"]
        
    except Exception as e:
        print(e)
        return None, [], []
        