
skills = [
    {"id": 1, "name": "Python"},
    {"id": 2, "name": "Java"},
    {"id": 3, "name": "JavaScript"},
    {"id": 4, "name": "Teamwork"},
    {"id": 5, "name": "Communication"}
]

import requests

users_url = "http://localhost:3000/user"
users_response = requests.get(users_url)
users_response.raise_for_status()
users = users_response.json()

reviews_url = "http://localhost:3000/reviews"
reviews_response = requests.get(reviews_url)
reviews_response.raise_for_status()
reviews = reviews_response.json()

usernames = {user["username"].lower(): user["username"] for user in users}

skill_num = {}
skill_tot = {}
skill_av = {}


for user in users:
    user_id = user["username"]  
    skill_num[user_id] = {}
    skill_tot[user_id] = {}
    skill_av[user_id] = {}
    for skill in skills:
        skill_name = skill["name"]
        skill_num[user_id][skill_name] = 0
        skill_tot[user_id][skill_name] = 0
        skill_av[user_id][skill_name] = 0

for review in reviews:
    matched_user = review.get("username") 
    if not matched_user:
        continue  
    
    for skill_name, score in review.get("skills", {}).items():
        if skill_name in skill_num[matched_user]:
            skill_num[matched_user][skill_name] += 1
            skill_tot[matched_user][skill_name] += score


for username in skill_num:
    for skill_name in skill_num[username]:
        if skill_num[username][skill_name] > 0:
            skill_av[username][skill_name] = round(
                skill_tot[username][skill_name] / skill_num[username][skill_name], 2
            )

__all__ = ['users', 'skills', 'skill_num', 'skill_av']
