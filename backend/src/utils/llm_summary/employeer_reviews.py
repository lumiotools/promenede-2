from openai import OpenAI
import json

client = OpenAI()


def get_employee_reviews_summary(company_name, review_data):
    prompt = """
You are given a set of employee reviews data and their overview for company {company_name}.
You need to understand those in detail.
Based on your understanding you need to summarize those in bullet points
Follow this particular format for your response.

Recommended Response Format:
- **Point 1:** summary.... 
- **Point 2:** summary....
- **Point 3:** summary....

Keep Maximum of 4 bullet points for the summary, and each having a maximum of 40 words.
Choose the title of those 4 points based on the data received
And No need to add additional explaination, just those 4 points with title and summary.

Refer below for an example and give strictly in this format only:

- **Work/life balance**: The work-life balance at Automation Anywhere is generally described as good, with many employees having flexibility in their schedules and enjoying benefits such as stress-free days and a no-meeting Friday. However, some employees also highlighted that there can be excessive workloads, resulting in a challenging balance.

- **Senior management**: Reviews indicate a significant level of dissatisfaction with senior management, which is frequently described as being too focused on personal gains rather than the well-being of employees. There are mentions of frequent layoffs, poor communication, and a lack of transparency, leading to low morale and trust issues among staff.

- **Culture and values**: The company culture has been described as toxic by some employees, with reports of politics, favoritism, and a lack of support for employees' career advancement. Conversely, some reviews praise the organization's commitment to innovation and collaboration, highlighting a positive work environment in certain departments. The overall sentiment reflects a divide in experiences with the culture at Automation Anywhere.

- **Career opportunities**: Career opportunities at Automation Anywhere seem to be mixed.

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
                "content": json.dumps(review_data, indent=2)
            }
        ]
    )
    
    
    return response.choices[0].message.content


def get_employee_ratings_summary(company_name, rating_data):
    prompt = """
You are given a set of employee ratings data and their overview for company {company_name}.
You need to understand those in detail.
Based on your understanding you need to summarize those in bullet points
Follow this particular format for your response.

Recommended Response Format:
### Key Highlights from Five-Star Reviews
- ...
- ...
- ...
- ...

### Key Highlights from One-Star Reviews
- ...
- ...

For Five-Star Key Highlights keep a maximum of 4 bullet points with a maximum of 40 words each.
For One-Star Key Highlights keep a maximum of 2 bullet points with a maximum of 40 words each.

Refer below for an example and give strictly in this format only:

### Key Highlights from Five-Star Reviews
- Automation Anywhere is praised for its supportive work environment, emphasizing employee well-being and providing a great work-life balance.
- The company is recognized for its cutting-edge technology and commitment to innovation, which fosters a culture of continuous learning and professional growth.
- Employees appreciate the transparency in leadership and the opportunities for career advancement, making it a desirable place to build a career.
- Though the overall sentiment is positive, some reviews note that the fast-paced nature of the company and occasional changes in priorities can be challenging.

### Key Highlights from One-Star Reviews
- Frequent layoffs with minimal notice and inadequate severance packages, causing instability and insecurity for employees.
- Poor leadership and management practices, with many employees reporting a toxic work environment dominated by favoritism and political maneuvering.

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
                "content": json.dumps(rating_data, indent=2)
            }
        ]
    )
    
    
    return response.choices[0].message.content


def get_areas_of_improvement(company_name, review_data):
    prompt = """
You are given a set of employee ratings data and their overview for company {company_name}.
You need to understand those in detail.
You need to focus on the ratings that are below 3 and give the areas of improvement based on those ratings.

In the response include the title and description of the area of improvement.
For description keep it min 30 words and max 40 words.

Return top 5 areas of improvement based on the ratings below 3.

**Strictly Follow This JSON Format for output**:
```json
{
   "areas_of_improvements": [
       {
           "title": "string", // Title of the area of improvement
           "description": "string" // Description of the area of improvement
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
                "content": json.dumps(review_data, indent=2)
            }
        ]
    )
    
    
    return json.loads(response.choices[0].message.content.split("```json\n")[1].split("```")[0])["areas_of_improvements"]