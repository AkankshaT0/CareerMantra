from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Sample resource dataset
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


@app.route("/filter_resources", methods=["POST"])
def filter_resources():

    data = request.json
    field = data.get("field")

    filtered = [r for r in resources if r["field"] == field]

    return jsonify(filtered)


if __name__ == "__main__":
    app.run(debug=True)