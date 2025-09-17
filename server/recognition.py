from flask import Flask, render_template
import plotly.graph_objs as go
from db.data import users, skill_num, skill_av

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html', users=users)

@app.route('/user/<username>')
def user_statistics(username):
    user = next((u for u in users if u["username"] == username), None)
    if not user:
        return f"User {username} not found."
    
    num = skill_num.get(username, {})
    averages = skill_av.get(username, {})
    
    used_skills_num = {k: v for k, v in num.items() if v > 0}
    used_skills_av = {k: v for k, v in averages.items() if v > 0}
    
    # Pie chart
    pie_fig = go.Figure(data=[go.Pie(
        labels=list(used_skills_num.keys()),
        values=list(used_skills_num.values()),
        textinfo='label+percent'
    )])
    pie_fig.update_layout(title=f"Skill Usage for {user['firstname']}")
    pie_chart = pie_fig.to_html(full_html=False, include_plotlyjs='cdn')

    # Bar chart
    bar_fig = go.Figure(data=[go.Bar(
        x=list(used_skills_av.keys()),
        y=list(used_skills_av.values()),
        text=list(used_skills_av.values()),
        textposition='auto'
    )])
    bar_fig.update_layout(
        title=f"Average Scores for {user['firstname']}",
        yaxis=dict(range=[0, 5]),
        xaxis_title="Skill",
        yaxis_title="Average Score"
    )
    bar_chart = bar_fig.to_html(full_html=False, include_plotlyjs='cdn')

    return render_template('data.html', 
        pie_chart=pie_chart, 
        bar_chart=bar_chart,
        user=user,
        skill_data=averages)

if __name__ == '__main__':
    app.run(debug=True, port=3001)