from openai import OpenAI
import json

client = OpenAI()


def get_competitive_analysis(company_name, competitive_analysis_data):
    prompt = """
Certainly! Here’s a revised version of the prompt with a clearer explanation of the expected output:

---

Generate a competitive analysis report for Company: {company_name} based on the input data. You need to create a JSON report with 3 fields for each of the top 3 competitors of {company_name}, resulting in a total of 9 entries.

Each entry should contain:
1. **Company Name**: The name of the competitor, formatted in the brand's style.
2. **Logo URL**: The URL of the company's logo (use their website's favicon link, e.g., `company_website_url/favicon.ico`).
3. **Field**: A key area where {company_name} is focused.
4. **Score**: A score between 0 and 100 indicating the competitor's performance in that field.
5. **Description**: A brief explanation of why the competitor excels in that field.

The **fields** represent major areas of focus for {company_name}. For each of the top 3 competitors, you'll report their performance in these fields.

**For Each Competitor**, include 3 entries—one for each of the fields related to {company_name}'s focus areas. This means you'll generate 9 unique entries in total, with each field being evaluated for each competitor.

The **description** should explain what the competitor is doing better in each field and why they excel in that area.

**Strictly Follow This JSON Format for output**:
```json
{
   "competitive_analysis": [
       {
           "company_name": "string", // Competitor's name in their brand style
           "logo_url": "string", // URL to the company's logo (use company_website_url/favicon.ico)
           "field": "string", // Area of expertise (e.g., AI Integration)
           "score": number, // 0-100 score reflecting the competitor's performance
           "description": "string" // Why the competitor excels in this field
       }
   ]
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
                "content": json.dumps(competitive_analysis_data, indent=2)
            }
        ],
    )
    
    return json.loads(response.choices[0].message.content.split("```json\n")[1].split("```")[0])["competitive_analysis"]
