import os
import openai
import json
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get OpenAI API key
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# Initialize OpenAI client
client = openai.OpenAI(api_key=OPENAI_API_KEY)

def chat_with_gpt_plain(system_prompt, content, max_tokens=500, model="gpt-4o-mini"):
    """
    Get a plain text response from GPT-4o-mini.

    Args:
        system_prompt (str): System instruction to guide the AI.
        content (str): User query.
        max_tokens (int): Maximum tokens for response.
        model (str): OpenAI model to use (default is "gpt-4o-mini").

    Returns:
        str: AI-generated response in plain text.
    """
    try:
        response = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": content}
            ],
            temperature=0.7,
            max_tokens=max_tokens
        )
        return response.choices[0].message.content.strip()

    except openai.OpenAIError as e:
        print(f"OpenAI API Error: {e}")
        return None

def chat_with_gpt_json(system_prompt, content, max_tokens=500, model="gpt-4o-mini"):
    """
    Get a JSON response from GPT-4o-mini.

    Args:
        system_prompt (str): System instruction to guide the AI.
        content (str): User query.
        max_tokens (int): Maximum tokens for response.
        model (str): OpenAI model to use (default is "gpt-4o-mini").

    Returns:
        dict: AI-generated response as a JSON object.
    """
    try:
        response = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": content}
            ],
            temperature=0.7,
            max_tokens=max_tokens
        )

        return {
            "system_prompt": system_prompt,
            "user_input": content,
            "model": model,
            "response": response.choices[0].message.content.strip(),
            "tokens_used": response.usage.total_tokens
        }

    except openai.OpenAIError as e:
        print(f"OpenAI API Error: {e}")
        return None

# Example Usage
if __name__ == "__main__":
    system_prompt = "You are an AI assistant that provides structured answers."
    user_input = "List three benefits of using GPT models for automation."

    # Get plain text response
    plain_response = chat_with_gpt_plain(system_prompt, user_input, max_tokens=300)
    print("\n🔹 Plain Response:\n", plain_response)

    # Get JSON response
    json_response = chat_with_gpt_json(system_prompt, user_input, max_tokens=300)
    print("\n🔹 JSON Response:\n", json.dumps(json_response, indent=4))
