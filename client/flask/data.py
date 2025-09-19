import requests

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



users_url = "http://localhost:3000/user"
users = requests.get(users_url).json()


reviews_url = "http://localhost:3000/reviews"
reviews = requests.get(reviews_url).json()

skill_num = {}
skill_tot = {}
skill_av = {}

for user in users:
    uid = user.get("userid")
    if uid is None:
        continue  
    skill_num[uid] = {skill["name"]: 0 for skill in skills}
    skill_tot[uid] = {skill["name"]: 0 for skill in skills}
    skill_av[uid] = {skill["name"]: 0 for skill in skills}

for review in reviews:
    user_id = review.get("userid")  
    if user_id is None or user_id not in skill_num:
        continue 

    for skill_name, score in review.get("skills", {}).items():
        if skill_name in skill_num[user_id]:
            skill_num[user_id][skill_name] += 1
            skill_tot[user_id][skill_name] += score

# AV
for uid in skill_num:
    for skill_name in skill_num[uid]:
        if skill_num[uid][skill_name] > 0:
            skill_av[uid][skill_name] = round(
                skill_tot[uid][skill_name] / skill_num[uid][skill_name], 2
            )

__all__ = ['users', 'skills', 'skill_num', 'skill_av']
