from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import random

# ML imports
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.ensemble import RandomForestClassifier

app = Flask(__name__)
CORS(app)

# ==============================
# 🔹 SKILL GAP MODEL SETUP
# ==============================
skill_data = pd.read_csv("careers_dataset.csv")

vectorizer = TfidfVectorizer()
skill_vectors = vectorizer.fit_transform(skill_data["skills"])


def analyze_skill_gap(user_skills, career):
    career_row = skill_data[skill_data["career"] == career]

    if career_row.empty:
        return {"error": "Career not found"}

    career_skills = career_row.iloc[0]["skills"].split()

    user_text = " ".join(user_skills)

    user_vector = vectorizer.transform([user_text])
    career_vector = vectorizer.transform([" ".join(career_skills)])

    similarity = cosine_similarity(user_vector, career_vector)[0][0]
    match_score = round(similarity * 100, 2)

    missing_skills = [
        skill for skill in career_skills
        if skill.lower() not in [s.lower() for s in user_skills]
    ]

    return {
        "career": career,
        "match_score": match_score,
        "missing_skills": missing_skills
    }


# ==============================
# 🔹 RECOMMENDATION MODEL
# ==============================
career_df = pd.read_csv("career_dataset.csv")

X = career_df[["analytical", "creative", "introvert", "extrovert"]]
y = career_df["career"]

career_model = RandomForestClassifier()
career_model.fit(X, y)


def predict_careers(data):
    input_data = [[
        data["analytical"],
        data["creative"],
        data["introvert"],
        data["extrovert"]
    ]]

    probs = career_model.predict_proba(input_data)[0]
    careers = career_model.classes_

    results = [
        {"career": careers[i], "score": round(probs[i] * 100)}
        for i in range(len(careers))
    ]

    return sorted(results, key=lambda x: x["score"], reverse=True)[:5]


# ==============================
# 🔹 PORTFOLIO FEATURES
# ==============================
improvement_phrases = [
    "This project demonstrates strong problem-solving skills.",
    "It highlights practical implementation and real-world application.",
    "The solution focuses on efficiency and scalability.",
    "It showcases creativity and technical expertise."
]


# ==============================
# 🔹 RESOURCES DATA
# ==============================
resources = [
    {
        "id": "1",
        "title": "Python for Data Science",
        "description": "Learn data science using Python",
        "field": "analytical",
        "link": "https://coursera.org"
    },
    {
        "id": "2",
        "title": "UI/UX Design Course",
        "description": "Learn creative UI design",
        "field": "creative",
        "link": "https://udemy.com"
    },
    {
        "id": "3",
        "title": "Public Speaking Mastery",
        "description": "Improve communication skills",
        "field": "extrovert",
        "link": "https://skillshare.com"
    },
    {
        "id": "4",
        "title": "Deep Research Methods",
        "description": "Research and analysis techniques",
        "field": "introvert",
        "link": "https://edx.org"
    }
]

# ==============================
# 🔹 ROUTES
# ==============================

@app.route("/")
def home():
    return "🚀 CareerMantra Unified API Running"


# 🔹 Skill Gap API
@app.route("/skill-gap", methods=["POST"])
def skill_gap():
    data = request.get_json()
    result = analyze_skill_gap(data.get("skills"), data.get("career"))
    return jsonify(result)


# 🔹 Career Recommendation API
@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    result = predict_careers(data)
    return jsonify(result)


# 🔹 Improve Text API
@app.route("/improve-text", methods=["POST"])
def improve_text():
    data = request.json
    text = data.get("text", "").strip()

    if len(text) < 20:
        text += ". This project demonstrates key technical skills."

    text += " " + random.choice(improvement_phrases)

    return jsonify({"improved_text": text})


# 🔹 Generate Description API
@app.route("/generate-description", methods=["POST"])
def generate_description():
    data = request.json

    title = data.get("title", "")
    skills = data.get("skills", "")
    tools = data.get("tools", "")

    generated = f"""
    The project titled '{title}' was developed using {tools}.
    It focuses on applying skills such as {skills}.
    The objective of this project was to solve real-world problems
    and enhance practical knowledge through implementation.
    """

    return jsonify({"generated_text": generated.strip()})


# 🔹 Resource Filter API
@app.route("/filter_resources", methods=["POST"])
def filter_resources():
    data = request.json
    field = data.get("field")

    filtered = [r for r in resources if r["field"] == field]
    return jsonify(filtered)


# ==============================
# 🔹 RUN APP
# ==============================
if __name__ == "__main__":
    app.run(debug=True, port=5000)