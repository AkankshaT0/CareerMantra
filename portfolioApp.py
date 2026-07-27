from flask import Flask, request, jsonify
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app)

# 🔹 Simple ML-like templates (you can replace with real ML later)
improvement_phrases = [
    "This project demonstrates strong problem-solving skills.",
    "It highlights practical implementation and real-world application.",
    "The solution focuses on efficiency and scalability.",
    "It showcases creativity and technical expertise."
]

@app.route('/improve-text', methods=['POST'])
def improve_text():
    data = request.json
    text = data.get("text", "")

    improved = text.strip()

    if len(improved) < 20:
        improved += ". This project demonstrates key technical skills."

    improved += " " + random.choice(improvement_phrases)

    return jsonify({
        "improved_text": improved
    })


@app.route('/generate-description', methods=['POST'])
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

    return jsonify({
        "generated_text": generated.strip()
    })


if __name__ == '__main__':
    app.run(debug=True)