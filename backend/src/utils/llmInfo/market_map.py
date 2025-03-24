from openai import OpenAI
import json

client = OpenAI()


def get_market_map(company_name, market_map_data):
    prompt = """
Generate a Market Map Report for Company: {company_name} based on the given data.

You will be given a set of segments and related industries/companies
You need to analyze those inputs and come up with a final response
The Response will contain the top 5 segments where {company_name} focuses.
And for each segment you need to provide the Companies associated with that segment.
The Company names might be repeated in different segments.

For Each Segment we need atleast 10 companies associated with it.

**Strictly Follow This JSON Format output**:
```json
{
   "market_map": {
       "segments": [
              {
                "segment": "string", // Segment name
                "companies": ["string"] // List of companies associated with the segment
                "companyLogos": ["string"] // List of company logos associated with the segment (from companyurl/favicon.ico)
              }
       ]
   }
}
```
    """.replace("{company_name}", company_name)
    
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": prompt
            },
            {
                "role": "user",
                "content": f"""
                Generate for company: {company_name}
                Segments & Industries Data: {str(market_map_data)}
                """
            }
        ],
    )
    
    return json.loads(response.choices[0].message.content.split("```json\n")[1].split("```")[0])["market_map"]
