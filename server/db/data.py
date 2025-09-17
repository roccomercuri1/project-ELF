
# ! FAKE DATA

users = [
    {"userid": 1, "username": "Alice"},
    {"userid": 2, "username": "Bob"}
]

skills = [
    {"id": 1, "name": "Python"},
    {"id": 2, "name": "Java"},
    {"id": 3, "name": "JavaScript"},
    {"id": 4, "name": "Teamwork"},
    {"id": 5, "name": "Communication"}
]

reviews = [
    {"reviewid": 1, "userid": 1, "review_skills": [{"skillid": 1, "score": 5}]},
    {"reviewid": 2, "userid": 1, "review_skills": [{"skillid": 4, "score": 4}]},
    {"reviewid": 3, "userid": 1, "review_skills": [{"skillid": 5, "score": 5}]},
    {"reviewid": 4, "userid": 2, "review_skills": [{"skillid": 2, "score": 4}]},
    {"reviewid": 5, "userid": 2, "review_skills": [{"skillid": 3, "score": 3}]},
    {"reviewid": 6, "userid": 2, "review_skills": [{"skillid": 4, "score": 5}]},
    {"reviewid": 7, "userid": 1, "review_skills": [{"skillid": 1, "score": 4}, {"skillid": 3, "score": 4}]},
    {"reviewid": 8, "userid": 2, "review_skills": [{"skillid": 5, "score": 4}]},
    {"reviewid": 9, "userid": 1, "review_skills": [{"skillid": 4, "score": 5}, {"skillid": 5, "score": 5}]},
    {"reviewid": 10, "userid": 2, "review_skills": [{"skillid": 2, "score": 3}, {"skillid": 1, "score": 4}, {"skillid": 4, "score": 3}]}
]

# num skills per user
skill_num = {}
# total scores per user
skill_tot = {}

for user in users:
    user_id = user["userid"]  
    skill_num[user_id] = {}
    skill_tot[user_id] = {}

    for skill in skills:
        skill_name = skill["name"]
        skill_num[user_id][skill_name] = 0
        skill_tot[user_id][skill_name] = 0


for review in reviews:
    user_id = review["userid"]
    for rs in review["review_skills"]:
        skill_id = rs["skillid"]
        score = rs["score"]

        skill_name = None
        for skill in skills:
            if skill["id"] == skill_id:
                skill_name = skill["name"]
                break

        if skill_name is not None:
            skill_num[user_id][skill_name] += 1
            skill_tot[user_id][skill_name] += score

# AV
skill_av = {}
for user_id in skill_num:
    skill_av[user_id] = {}
    for skill_name in skill_num[user_id]:
        usage = skill_num[user_id][skill_name]
        total = skill_tot[user_id][skill_name]
        if usage > 0:
            skill_av[user_id][skill_name] = round(total / usage, 2)
        else:
            skill_av[user_id][skill_name] = 0
