from flask import Flask, render_template, request
import plotly.graph_objs as go
from data import users, skill_num, skill_av, user_isadmin, global_num, global_av
import os

template_dir = os.path.join(os.path.dirname(__file__), '../pages')
static_dir = os.path.join(os.path.dirname(__file__), '../static')
app = Flask(__name__, template_folder=template_dir, static_folder=static_dir)

# app is running 
# cd flask 
# python recognition.py to run

@app.route('/datapage')
def datapage():
    userid = request.args.get("userid")
    if not userid:
        return "No userid provided", 400

    try:
        userid = int(userid)
    except ValueError:
        return "Invalid userid", 400

    user = next((u for u in users if u["userid"] == userid), None)
    if not user:
        return "User not found", 404
    
    is_admin = user_isadmin.get(userid,False)
        
    if is_admin:
        pie_fig = go.Figure(data=[go.Pie(
        labels=list(global_num.keys()),
        values=list(global_num.values()),
        textinfo='label+percent'
        )])
        pie_fig.update_layout(title=f"Total Skill Usage for all employees")
        pie_chart = pie_fig.to_html(full_html=False, include_plotlyjs='cdn')

        bar_fig = go.Figure(data=[go.Bar(
            x=list(global_av.keys()),
            y=list(global_av.values()),
            text=list(global_av.values()),
            textposition='auto'
        )])
        bar_fig.update_layout(
            title=f"Average Scores for all employees",
            yaxis=dict(range=[1, 5]),
            xaxis_title="Skill",
            yaxis_title="Average Score"
        )
        bar_chart = bar_fig.to_html(full_html=False, include_plotlyjs='cdn')

        return render_template(
            'dataPage.html',
            pie_chart=pie_chart,
            bar_chart=bar_chart,
            user=user,
            skill_data=global_av,
            skill_num=global_num  
        )
    else: 
        num = skill_num.get(userid, {})
        averages = skill_av.get(userid, {})

        if not num or not averages:
            return "No skill data found for this user", 404

        # creates 2 dicts which assigns each k = key (skill name) with a v = value only if v>0, for their av and num
        
        used_skills_num = {}
        for k, v in num.items():
            if v > 0:
                used_skills_num[k] = v
        if not used_skills_num:  
            used_skills_num = {k: 0 for k in num}

        used_skills_av = {}
        for k, v in averages.items():
            if v > 0:
                used_skills_av[k] = v
        if not used_skills_av:
            used_skills_av = {k: 0 for k in averages}


        pie_fig = go.Figure(data=[go.Pie(
            labels=list(used_skills_num.keys()),
            values=list(used_skills_num.values()),
            textinfo='label+percent'
        )])
        pie_fig.update_layout(title=f"Skill Usage for {user.get('firstname', 'User')}")
        pie_chart = pie_fig.to_html(full_html=False, include_plotlyjs='cdn')

        bar_fig = go.Figure(data=[go.Bar(
            x=list(used_skills_av.keys()),
            y=list(used_skills_av.values()),
            text=list(used_skills_av.values()),
            textposition='auto'
        )])
        bar_fig.update_layout(
            title=f"Average Scores for {user.get('firstname', 'User')}",
            yaxis=dict(range=[0, 5]),
            xaxis_title="Skill",
            yaxis_title="Average Score"
        )
        bar_chart = bar_fig.to_html(full_html=False, include_plotlyjs='cdn')

        return render_template(
            'dataPage.html',
            pie_chart=pie_chart,
            bar_chart=bar_chart,
            user=user,
            skill_data=averages,
            skill_num=skill_num  
        )

if __name__ == '__main__':
        app.run(debug=True, port=3001)