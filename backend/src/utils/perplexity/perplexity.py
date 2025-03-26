import json
import os
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
PERPLEXITY_API_KEY = os.getenv("PERPLEXITY_API_KEY")

def ask_perplexity(prompt, data):
    """
    Send a request to Perplexity API with a system prompt and user data.
    
    Args:
        prompt (str): The system prompt to guide the model
        data (str): The user data/question to process
    
    Returns:
        str: The text response from Perplexity, or error message
    """
    # Get the API key from the environment variable
    auth_token = PERPLEXITY_API_KEY
    
    # Check if the API key is set
    if not auth_token:
        return "API key not found. Please set the PERPLEXITY_API_KEY environment variable."
    
    url = "https://api.perplexity.ai/chat/completions"
    
    # Define the payload with the messages structure
    payload = {
        "model": "sonar",
        "messages": [
            {"role": "system", "content": prompt},
            {"role": "user", "content": json.dumps(data)}
        ],
        "temperature": 0.2,
        "top_p": 0.9
    }
    
    # Set headers including Authorization with Bearer token
    headers = {
        "Authorization": f"Bearer {auth_token}",
        "Content-Type": "application/json"
    }

    try:
        # Send the POST request to the API
        response = requests.post(url, json=payload, headers=headers)
        
        # Check if the request was successful
        if response.status_code == 200:
            # Extract just the content from the response
            response_data = response.json()
            content = response_data["choices"][0]["message"]["content"]
            return content
        else:
            # Return error information
            return f"Error: API returned status code {response.status_code}. {response.text}"
    except Exception as e:
        return f"Error: Failed to communicate with Perplexity API. {str(e)}"

