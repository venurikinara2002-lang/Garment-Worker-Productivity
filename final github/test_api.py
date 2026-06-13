import requests
import json

url = "http://localhost:8000/predict"
data = {
    "quarter": "Quarter1",
    "department": "Sewing",
    "day": "Monday",
    "targeted_productivity": 0.8,
    "smv": 11.2,
    "over_time": 0,
    "incentive": 0,
    "idle_time": 0,
    "wip": 1000,
    "idle_men": 0,
    "no_of_style_change": 0,
    "no_of_workers": 50
}

response = requests.post(url, json=data)
print(f"Status Code: {response.status_code}")
print(f"Response: {response.text}")
