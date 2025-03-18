import requests

def get_web_traffic(domain):
    api_key = "b5d728544ba849d4b69365647ffb3f7b"
    url = f"https://api.similarweb.com/v1/website/{domain}/total-traffic-and-engagement"

    params = {
        "api_key": api_key,
        "start_date": "2021-01-01",
        "end_date": "2021-12-31"
    }

    response = requests.get(url, params=params)
    print("response",response)
    
    if response.status_code == 200:
        return response.json()  # Web traffic data in JSON format
    else:
        return f"Error: {response.status_code} - {response.text}"

# Example usage
traffic_data = get_web_traffic("https://www.paypal.com/home")
print(traffic_data)
