from flask import Flask, request, jsonify
import joblib
import numpy as np
import os

app = Flask(__name__)

#Load trained model

model = joblib.load("model.pkl")
infection_model = joblib.load("infection_model.pkl")

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json

    hour = data["hour"]
    day = data["day"]

    features = np.array([[hour, day]])
    prediction = model.predict(features)[0]

    return jsonify({
        "prediction": int(prediction)
    })
@app.route("/predict/infection", methods=["POST"])
def predict_infection():
    data = request.json

    occupancy = data["occupancy"]
    active = data["activeInfections"]
    air = data["airQuality"]
    hygiene = data["handHygiene"]
    hours = data["hoursSinceDisinfection"]

    density = active / (occupancy + 1)

    features = np.array([[occupancy, active, air, hygiene, hours, density]])

    prediction = infection_model.predict(features)[0]

    # 🔥 smart adjustment
    if active > 4 or occupancy > 85:
        prediction = "high"
    elif air > 85 and hygiene > 90:
        prediction = "low"

    return jsonify({
        "risk": prediction,
        "model": "Random Forest ML"
    })

if __name__ == "__main__":
    #app.run(port=5001)
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5001)))