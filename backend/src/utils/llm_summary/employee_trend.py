from openai import OpenAI

client = OpenAI()


def get_employee_trend_summary(company_name, data_1, data_2):
    prompt = """
    Understand the Given 2 datasets.
    And Summarize them in 100 words, with respect to the employee trends in the company {company_name}.
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
                Data Set 1: {str(data_1)}
                Data Set 2: {str(data_2)}
                """
            }
        ],
    )
    
    return response.choices[0].message.content
