import requests

# config.py
is_docker_active = True

if is_docker_active == True:
    API_URL = "http://54.90.66.20"
else:
    API_URL = "http://localhost"

from collections import defaultdict

skills = [
    {"id": 1, "name": "Python"},
    {"id": 2, "name": "Java"},
    {"id": 3, "name": "JavaScript"},
    {"id": 4, "name": "Teamwork"},
    {"id": 5, "name": "Communication"},
    {"id": 6, "name": "HTML/CSS"},
    {"id": 7, "name": "Terraform"},
    {"id": 8, "name": "Ansible"},
    {"id": 9, "name": "AWS"},
    {"id": 10, "name": "Communication"},
    {"id": 11, "name": "Initiative"}
]

jwt_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOjYsImlhdCI6MTc1ODc5MDA2NCwiZXhwIjoxNzU4NzkzNjY0fQ.ew7vVdQ4WK4ZqUS7jYxNiXepmk_xOaf8EvcSFQAnumY'

headers = {
    'Authorization': jwt_token
}

users_url = f"{API_URL}:3000/user"
users = requests.get(users_url, headers=headers).json()
print(users)

reviews_url = f"{API_URL}:3000/reviews"
reviews = requests.get(reviews_url, headers=headers).json()

skill_num = {}
skill_tot = {}
skill_av = {}

user_isadmin = {}
global_num = defaultdict(int)
global_tot = defaultdict(int)
global_av = {}

for user in users:
    print(user)
    uid = user.get("userid")
    if uid is None:
        continue 

    is_admin = bool(user.get("isadmin"))     
    user_isadmin[uid] = is_admin
     
    if not is_admin:
        skill_num[uid] = {skill["name"]: 0 for skill in skills}
        skill_tot[uid] = {skill["name"]: 0 for skill in skills}
        skill_av[uid] = {skill["name"]: 0 for skill in skills}

for review in reviews:
    user_id = review.get("userid")  
    if user_id is None or user_id not in skill_num:
        continue 

# AV
    if user_id in skill_num:
        for skill_name, score in review.get("skills", {}).items():
            if skill_name in skill_num[user_id]:
                skill_num[user_id][skill_name] += 1
                skill_tot[user_id][skill_name] += score


    for skill_name, score in review.get("skills", {}).items():
            global_num[skill_name] += 1
            global_tot[skill_name] += score

    #user averages
    for uid in skill_num:
        for skill_name in skill_num[uid]:
            if skill_num[uid][skill_name] > 0:
                skill_av[uid][skill_name] = round(
                    skill_tot[uid][skill_name] / skill_num[uid][skill_name], 2
            )
    #global averages            
    for skill_name in global_num:
        if global_num[skill_name] > 0:
            global_av[skill_name] = round(
                global_tot[skill_name]/global_num[skill_name], 2
            )

    


__all__ = ['users', 'skills', 'skill_num', 'skill_av','user_isadmin', 'global_av','global_num']
