import pandas as pd
from sklearn.ensemble import RandomForestClassifier

df = pd.read_csv("career_dataset.csv")

X = df[["analytical","creative","introvert","extrovert"]]
y = df["career"]

model = RandomForestClassifier()
model.fit(X,y)

def predict_careers(scores):

    probabilities = model.predict_proba([[
        scores["analytical"],
        scores["creative"],
        scores["introvert"],
        scores["extrovert"]
    ]])[0]

    careers = model.classes_

    results = []

    for i in range(len(careers)):
        results.append({
            "career": careers[i],
            "score": round(probabilities[i]*100)
        })

    results = sorted(results,key=lambda x:x["score"],reverse=True)

    return results[:5]