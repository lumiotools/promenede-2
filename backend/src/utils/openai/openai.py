import os
import openai
import json
import tiktoken
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get OpenAI API key
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# Initialize OpenAI client
client = openai.OpenAI(api_key=OPENAI_API_KEY)

def num_tokens_from_string(string, model="gpt-4o-mini"):
    """Returns the number of tokens in a text string."""
    encoding = tiktoken.encoding_for_model(model)
    num_tokens = len(encoding.encode(string))
    return num_tokens

def chunk_text(text, max_chunk_tokens=100000, model="gpt-4o-mini"):
    """Split text into chunks that don't exceed max_chunk_tokens."""
    encoding = tiktoken.encoding_for_model(model)
    tokens = encoding.encode(text)
    
    chunks = []
    for i in range(0, len(tokens), max_chunk_tokens):
        chunk_tokens = tokens[i:i + max_chunk_tokens]
        chunk_text = encoding.decode(chunk_tokens)
        chunks.append(chunk_text)
    
    return chunks

def process_dataframe_chunk(df_chunk, system_prompt, max_tokens=4000, model="gpt-4o-mini"):
    """
    Process a chunk of a dataframe with a limited number of columns.
    
    Args:
        df_chunk (dict/str): Dictionary or string representation of data to process
        system_prompt (str): System instruction to guide the AI
        max_tokens (int): Maximum tokens for response
        model (str): OpenAI model to use
        
    Returns:
        dict: Processed results
    """
    # Convert df_chunk to JSON string if it's a dictionary
    if isinstance(df_chunk, dict):
        chunk_content = json.dumps(df_chunk, indent=2)
    else:
        chunk_content = df_chunk
        
    # Add instructions about column limits
    processing_prompt = (
        f"Process this data chunk. "
        f"The data might be large, so focus on providing essential insights and a valid JSON response "
        f"with no more than {max_tokens // 100} key findings."
    )
    
    try:
        response = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": processing_prompt + "\n\n" + chunk_content}
            ],
            temperature=0.7,
            max_tokens=max_tokens
        )
        
        response_text = response.choices[0].message.content.strip()
        
        # Try to parse as JSON, handle errors gracefully
        try:
            # Extract JSON if wrapped in markdown code blocks
            if "```json" in response_text and "```" in response_text.split("```json", 1)[1]:
                json_text = response_text.split("```json", 1)[1].split("```", 1)[0].strip()
                parsed_response = json.loads(json_text)
            else:
                parsed_response = json.loads(response_text)
                
            return {
                "success": True,
                "response": parsed_response,
                "tokens_used": response.usage.total_tokens
            }
        except json.JSONDecodeError as e:
            # Return text response if JSON parsing fails
            print(f"JSON decode error: {e}. Returning text response.")
            return {
                "success": False, 
                "response": response_text,
                "tokens_used": response.usage.total_tokens,
                "error": str(e)
            }
            
    except openai.OpenAIError as e:
        print(f"OpenAI API Error: {e}")
        return {"success": False, "error": str(e), "tokens_used": 0}

def process_large_json_data(json_data, system_prompt, max_tokens=10000, model="gpt-4o-mini", column_limit=50):
    """
    Process large JSON data by breaking it into smaller column chunks.
    
    Args:
        json_data (dict/list): Large JSON data structure to process
        system_prompt (str): System instruction to guide the AI
        max_tokens (int): Maximum tokens for response
        model (str): OpenAI model to use
        column_limit (int): Maximum number of columns to process at once
        
    Returns:
        dict: Combined results
    """
    print(f"Processing large JSON data with {column_limit} column limit...")
    total_tokens_used = 0
    chunk_responses = []
    
    # Handle dictionary data
    if isinstance(json_data, dict):
        keys = list(json_data.keys())
        for i in range(0, len(keys), column_limit):
            chunk_keys = keys[i:i+column_limit]
            chunk_data = {k: json_data[k] for k in chunk_keys}
            
            print(f"Processing column chunk {i//column_limit + 1} of {(len(keys) + column_limit - 1) // column_limit}")
            result = process_dataframe_chunk(chunk_data, system_prompt, max_tokens//2, model)
            
            if result["success"]:
                chunk_responses.append(result["response"])
            else:
                chunk_responses.append({"error": result["error"], "partial_data": str(chunk_data)[:200] + "..."})
                
            total_tokens_used += result["tokens_used"]
    
    # Handle list of dictionaries (dataframe-like)
    elif isinstance(json_data, list) and len(json_data) > 0 and isinstance(json_data[0], dict):
        # Get all unique columns
        all_columns = set()
        for row in json_data:
            all_columns.update(row.keys())
        
        all_columns = list(all_columns)
        
        # Process in column chunks
        for i in range(0, len(all_columns), column_limit):
            chunk_columns = all_columns[i:i+column_limit]
            
            # Create a version of the data with only these columns
            chunk_data = []
            for row in json_data:
                chunk_row = {col: row.get(col) for col in chunk_columns if col in row}
                chunk_data.append(chunk_row)
            
            print(f"Processing column chunk {i//column_limit + 1} of {(len(all_columns) + column_limit - 1) // column_limit}")
            result = process_dataframe_chunk(chunk_data, system_prompt, max_tokens//2, model)
            
            if result["success"]:
                chunk_responses.append(result["response"])
            else:
                chunk_responses.append({"error": result["error"], "columns": chunk_columns})
                
            total_tokens_used += result["tokens_used"]
    
    # Combine results
    if len(chunk_responses) == 1:
        return {
            "response": chunk_responses[0],
            "tokens_used": total_tokens_used,
            "chunked_columns": True,
            "column_chunks": 1
        }
    else:
        # Combine the chunk responses
        combination_prompt = (
            "You've analyzed different portions of a dataset. "
            "Combine these analyses into a coherent JSON response. "
            "Each chunk represents analysis of different columns or aspects of the data."
        )
        
        combined_response = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": system_prompt + "\nProvide your final response in valid JSON format."},
                {"role": "user", "content": combination_prompt + "\n\n" + json.dumps(chunk_responses, indent=2)}
            ],
            temperature=0.7,
            max_tokens=max_tokens
        )
        
        total_tokens_used += combined_response.usage.total_tokens
        
        # Try to parse the response as JSON
        response_text = combined_response.choices[0].message.content.strip()
        try:
            # Extract JSON if wrapped in markdown code blocks
            if "```json" in response_text and "```" in response_text.split("```json", 1)[1]:
                json_text = response_text.split("```json", 1)[1].split("```", 1)[0].strip()
                parsed_response = json.loads(json_text)
            else:
                parsed_response = json.loads(response_text)
        except json.JSONDecodeError:
            parsed_response = response_text
        
        return {
            "response": parsed_response,
            "tokens_used": total_tokens_used,
            "chunked_columns": True,
            "column_chunks": len(chunk_responses)
        }

def chat_with_gpt_plain(system_prompt, content, max_tokens=10000, model="gpt-4o-mini"):
    """
    Get a plain text response from GPT model, handling content that exceeds context limits.

    Args:
        system_prompt (str): System instruction to guide the AI.
        content (str): User query.
        max_tokens (int): Maximum tokens for response.
        model (str): OpenAI model to use (default is "gpt-4o-mini").

    Returns:
        str: AI-generated response in plain text.
    """
    # Calculate system prompt tokens
    system_tokens = num_tokens_from_string(system_prompt, model)
    
    # Calculate max content tokens (leaving buffer for system and response)
    # GPT-4o-mini has 128k token limit, so max content should be less than that
    max_context = 128000 - system_tokens - max_tokens - 1000  # 1000 token buffer
    
    # Check if content exceeds max context
    content_tokens = num_tokens_from_string(content, model)
    
    try:
        if content_tokens <= max_context:
            # Content fits within context window
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

        else:
            # Content exceeds context window, needs chunking
            print(f"Content too large ({content_tokens} tokens). Chunking...")
            
            # Chunk the content
            chunks = chunk_text(content, max_context, model)
            chunk_responses = []
            
            # Process each chunk
            for i, chunk in enumerate(chunks):
                chunk_system_prompt = f"{system_prompt}\n\nThis is part {i+1} of {len(chunks)} of the full content. Process this part and provide your analysis."
                
                response = client.chat.completions.create(
                    model=model,
                    messages=[
                        {"role": "system", "content": chunk_system_prompt},
                        {"role": "user", "content": chunk}
                    ],
                    temperature=0.7,
                    max_tokens=max_tokens // 2  # Use smaller max_tokens for chunks
                )
                
                chunk_responses.append(response.choices[0].message.content.strip())
            
            # Combine results with another API call
            combination_prompt = "You've processed multiple chunks of content. Summarize and combine these results into a coherent response:"
            
            combined_response = client.chat.completions.create(
                model=model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": combination_prompt + "\n\n" + "\n\n---\n\n".join([f"Chunk {i+1} response: {resp}" for i, resp in enumerate(chunk_responses)])}
                ],
                temperature=0.7,
                max_tokens=max_tokens
            )
            
            return combined_response.choices[0].message.content.strip()

    except openai.OpenAIError as e:
        print(f"OpenAI API Error: {e}")
        return None

def chat_with_gpt_json(system_prompt, content, max_tokens=10000, model="gpt-4o-mini", column_limit=50):
    """
    Get a JSON response from GPT model, handling content that exceeds context limits.
    Handles large datasets by processing in smaller chunks with column limits.

    Args:
        system_prompt (str): System instruction to guide the AI.
        content (str): User query or data to process.
        max_tokens (int): Maximum tokens for response.
        model (str): OpenAI model to use (default is "gpt-4o-mini").
        column_limit (int): Maximum number of columns to process at once.

    Returns:
        dict: AI-generated response as a JSON object with metadata.
    """
    # Calculate system prompt tokens
    system_tokens = num_tokens_from_string(system_prompt, model)
    
    # Calculate max content tokens
    max_context = 128000 - system_tokens - max_tokens - 1000  # 1000 token buffer
    
    # Check if content exceeds max context
    content_tokens = num_tokens_from_string(content, model)
    
    try:
        if content_tokens <= max_context:
            # Check if content might be JSON data
            try:
                # Try to parse as JSON
                json_data = None
                if content.strip().startswith('{') or content.strip().startswith('['):
                    json_data = json.loads(content)
                
                # If we have JSON data that might be a dataframe or large structure
                if isinstance(json_data, dict) and len(json_data) > column_limit:
                    # Process data in chunks based on column_limit
                    return process_large_json_data(json_data, system_prompt, max_tokens, model, column_limit)
                
                elif isinstance(json_data, list) and len(json_data) > 0 and isinstance(json_data[0], dict):
                    if len(json_data[0]) > column_limit:
                        # Process dataframe-like JSON in chunks
                        return process_large_json_data(json_data, system_prompt, max_tokens, model, column_limit)
            except (json.JSONDecodeError, TypeError):
                # Not JSON data or invalid JSON, proceed with normal processing
                pass
                
            # Content fits within context window and isn't large structured data
            response = client.chat.completions.create(
                model=model,
                messages=[
                    {"role": "system", "content": system_prompt + "\nProvide your response in valid JSON format."},
                    {"role": "user", "content": content}
                ],
                temperature=0.7,
                max_tokens=max_tokens
            )
            
            # Try to parse as JSON
            response_text = response.choices[0].message.content.strip()
            try:
                # Extract JSON if wrapped in markdown code blocks
                if "```json" in response_text and "```" in response_text.split("```json", 1)[1]:
                    json_text = response_text.split("```json", 1)[1].split("```", 1)[0].strip()
                    parsed_response = json.loads(json_text)
                else:
                    parsed_response = json.loads(response_text)
            except json.JSONDecodeError:
                # Return text response if JSON parsing fails
                parsed_response = response_text
            
            return {
                "system_prompt": system_prompt,
                "user_input": content[:100] + "..." if len(content) > 100 else content,
                "model": model,
                "response": parsed_response,
                "tokens_used": response.usage.total_tokens,
                "chunked": False
            }
        else:
            # Content exceeds context window, needs chunking
            print(f"Content too large ({content_tokens} tokens). Chunking...")
            
            # Chunk the content
            chunks = chunk_text(content, max_context, model)
            chunk_responses = []
            total_tokens_used = 0
            
            # Process each chunk
            for i, chunk in enumerate(chunks):
                print(f"Processing chunk {i+1} of {len(chunks)}...")
                chunk_system_prompt = f"{system_prompt}\n\nThis is part {i+1} of {len(chunks)} of the full content. Process this part and provide your analysis in JSON format."
                
                # Check if chunk might contain JSON
                try:
                    if chunk.strip().startswith('{') or chunk.strip().startswith('['):
                        json_data = json.loads(chunk)
                        if isinstance(json_data, dict) and len(json_data) > column_limit:
                            chunk_result = process_large_json_data(json_data, chunk_system_prompt, max_tokens//2, model, column_limit)
                            chunk_responses.append(json.dumps(chunk_result))
                            total_tokens_used += chunk_result.get("tokens_used", 0)
                            continue
                except (json.JSONDecodeError, TypeError):
                    # Not JSON data or invalid JSON, proceed with normal processing
                    pass
                
                response = client.chat.completions.create(
                    model=model,
                    messages=[
                        {"role": "system", "content": chunk_system_prompt},
                        {"role": "user", "content": chunk}
                    ],
                    temperature=0.7,
                    max_tokens=max_tokens // 2  # Use smaller max_tokens for chunks
                )
                
                chunk_responses.append(response.choices[0].message.content.strip())
                total_tokens_used += response.usage.total_tokens
            
            # Combine results with another API call
            combination_prompt = "You've processed multiple chunks of content. Summarize and combine these results into a coherent JSON response:"
            
            combined_response = client.chat.completions.create(
                model=model,
                messages=[
                    {"role": "system", "content": system_prompt + "\nProvide your final response in valid JSON format."},
                    {"role": "user", "content": combination_prompt + "\n\n" + "\n\n---\n\n".join([f"Chunk {i+1} response: {resp}" for i, resp in enumerate(chunk_responses)])}
                ],
                temperature=0.7,
                max_tokens=max_tokens
            )
            
            total_tokens_used += combined_response.usage.total_tokens
            
            # Try to parse the response as JSON, if it's valid JSON
            response_text = combined_response.choices[0].message.content.strip()
            try:
                # Extract JSON if wrapped in markdown code blocks
                if "```json" in response_text and "```" in response_text.split("```json", 1)[1]:
                    json_text = response_text.split("```json", 1)[1].split("```", 1)[0].strip()
                    parsed_response = json.loads(json_text)
                else:
                    parsed_response = json.loads(response_text)
            except json.JSONDecodeError as e:
                print(f"JSON decode error: {e}. Returning text response.")
                parsed_response = response_text
            
            return {
                "system_prompt": system_prompt,
                "user_input": "Large content (chunked)",
                "model": model,
                "response": parsed_response,
                "tokens_used": total_tokens_used,
                "chunked": True,
                "chunk_count": len(chunks)
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