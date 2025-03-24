from openai import OpenAI
import json

client = OpenAI()


def get_employee_reviews_summary(review_data):
    prompt = """
You are given a set of employee reviews data and their overview.
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

    """
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": "Summarize the reviews of the employee"
            },
            {
                "role": "user",
                "content": json.dumps(review_data, indent=2)
            }
        ]
    )
    
    
    return response.choices[0].message.content
