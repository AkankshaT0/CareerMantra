import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Load dataset
data = pd.read_csv("careers_dataset.csv")

# Convert skills column
skills_data = data["skills"]

# Create vectorizer
vectorizer = TfidfVectorizer()

# Train vectors
skill_vectors = vectorizer.fit_transform(skills_data)

def analyze_skill_gap(user_skills, career):

    career_row = data[data["career"] == career]

    if career_row.empty:
        return {"error": "Career not found"}

    career_skills = career_row.iloc[0]["skills"].split()

    user_text = " ".join(user_skills)

    user_vector = vectorizer.transform([user_text])

    career_vector = vectorizer.transform([" ".join(career_skills)])

    similarity = cosine_similarity(user_vector, career_vector)[0][0]

    match_score = round(similarity * 100, 2)

    missing_skills = []

    for skill in career_skills:
        if skill.lower() not in [s.lower() for s in user_skills]:
            missing_skills.append(skill)

    return {
        "career": career,
        "match_score": match_score,
        "missing_skills": missing_skills
    }