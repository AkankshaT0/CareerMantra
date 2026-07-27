from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from sklearn.ensemble import RandomForestClassifier

app = Flask(__name__)
CORS(app)

# Load dataset
df = pd.read_csv("career_dataset.csv")

X = df[["analytical","creative","introvert","extrovert"]]
y = df["career"]

model = RandomForestClassifier()
model.fit(X,y)

@app.route("/predict", methods=["POST"])
def predict():

    data = request.json

    input_data = [[
        data["analytical"],
        data["creative"],
        data["introvert"],
        data["extrovert"]
    ]]

    probs = model.predict_proba(input_data)[0]
    careers = model.classes_

    results=[]

    for i in range(len(careers)):
        results.append({
            "career": careers[i],
            "score": round(probs[i]*100)
        })

    results = sorted(results, key=lambda x: x["score"], reverse=True)

    return jsonify(results[:5])

if __name__ == "__main__":
    app.run(debug=True)