from openai import OpenAI
import json

client = OpenAI()


def get_product_services(company_name, services):
    prompt = """
You will be given a services array.
Using that you need to describe each service in that array in short.
Describe it with respect to the company {company_name}.

**Strictly Follow This JSON Format output**:
```json
{
   "services": [
       {
           "service_name": "string",
           "description": "string",
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
                "content": f"""
                Generate for company: {company_name}
                Services: {str([service["value"] for service in services])}
                """
            }
        ],
    )
    
    generated_services = json.loads(response.choices[0].message.content.split("```json\n")[1].split("```")[0])["services"]
    
    for service in services:
        generated_service = next((item for item in generated_services if item["service_name"] == service["value"]), None)
        service["description"] = generated_service["description"] if generated_service else None
    
    return services
