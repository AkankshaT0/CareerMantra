from flask import Flask, request, jsonify
from flask_cors import CORS
from model import analyze_skill_gap

app = Flask(__name__)

# Enable CORS for frontend
CORS(app)

@app.route("/")
def home():
    return "CareerMantra ML API Running"

@app.route("/skill-gap", methods=["POST"])
def skill_gap():

    data = request.get_json()

    user_skills = data.get("skills")
    career = data.get("career")

    result = analyze_skill_gap(user_skills, career)

    return jsonify(result)


if __name__ == "__main__":
    app.run(debug=True)