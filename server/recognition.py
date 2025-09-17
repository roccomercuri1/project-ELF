from flask import Flask, render_template
import plotly.graph_objs as go
from db.data import users, skill_num, skill_av

app = Flask(__name__)

@app.route('/user-statistics/<int:user_id>')

def user_statistics(user_id):
    user = next((u for u in users if u["userid"] == user_id), None)
    if not user:
        return f"User with id {user_id} not found."
    
    num = skill_num[user_id]
    avs = skill_av[user_id]

    # Pie chart 
    pie_fig = go.Figure(data=[go.Pie(
        labels=list(num.keys()),
        values=list(num.values())
    )])
    pie_fig.update_layout(title="Total Times Each Skill Was Used as %")
    pie_chart = pie_fig.to_html(full_html=False, include_plotlyjs='cdn')

    # Bar chart
    bar_fig = go.Figure(data=[go.Bar(
        x=list(avs.keys()),
        y=list(avs.values())
    )])
    bar_fig.update_layout(
        title="Average Score per Skill",
        yaxis=dict(range=[0, 5])
    )
    bar_chart = bar_fig.to_html(full_html=False, include_plotlyjs='cdn')

    return render_template('data.html', pie_chart=pie_chart, bar_chart=bar_chart)

if __name__ == '__main__':
    app.run(debug=True, port=3001)
