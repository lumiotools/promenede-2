from openai import OpenAI
import json

client = OpenAI()


def get_opportunity_areas(company_name, topic_tags):
    prompt = """
Generate a report on the opportunity areas for Company: {company_name} based on the given data and the company's focus on the following topic tags: {topic_tags}. The report should include potential growth opportunities with specific details and rationale.

Each opportunity area should include:
1. **Opportunity Area**: A short name of the opportunity area or area of improvement.
2. **Details**: A brief explanation of the opportunity, focusing on how it can benefit {company_name} based on the current market trends or areas of development.
3. **Rationale**: A justification for why this is an opportunity, explaining the potential impact on {company_name}'s growth or competitiveness.

For **{company_name}**, use the given **topic tags** to guide your identification of growth opportunities. Make sure the opportunities align with the company's focus and have a clear rationale explaining the potential impact.

**Strictly Follow This JSON Format output**:
```json
{
   "opportunity_areas": [
       {
           "area": "string", // The opportunity area or growth area
           "detail": "string", // Brief explanation of the opportunity
           "rationale": "string" // Justification for why this is a key opportunity
       }
   ]
}
```
    """.replace("{company_name}", company_name).replace("{topic_tags}", str(topic_tags))
    
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
                Topic tags: {str(topic_tags)}
                """
            }
        ],
    )
    
    return json.loads(response.choices[0].message.content.split("```json\n")[1].split("```")[0])["opportunity_areas"]



