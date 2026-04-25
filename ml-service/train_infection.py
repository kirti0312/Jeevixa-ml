from pymongo import MongoClient
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import joblib
from datetime import datetime
import random

# connect MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client["jeevixa"]

wards = list(db.wards.find())

data = []

def calculate_risk(occupancy, active, air, hygiene, hours):
    occupancyScore = occupancy * 0.30
    disinfectionScore = min(hours, 24) * 0.25
    infectionScore = active * 10 * 0.25
    airScore = (100 - air) * 0.10
    hygieneScore = (100 - hygiene) * 0.10

    total = occupancyScore + disinfectionScore + infectionScore + airScore + hygieneScore

    if total > 60:
        return "high"
    elif total > 30:
        return "medium"
    else:
        return "low"


# 🔥 AUGMENT DATA (SMART)
for w in wards:
    base_occ = w.get("occupancy", 0)
    base_active = w.get("activeInfections", 0)
    base_air = w.get("airQuality", 80)
    base_hygiene = w.get("handHygiene", 85)
    base_hours = (datetime.now() - w.get("lastDisinfection", datetime.now())).total_seconds() / 3600

    for _ in range(25):  # expand dataset

        # 🔥 CONTROLLED VARIATION
        occupancy = max(0, base_occ + random.randint(-10, 10))
        active = max(0, base_active + random.randint(0, 3))
        air = min(100, max(0, base_air + random.randint(-10, 10)))
        hygiene = min(100, max(0, base_hygiene + random.randint(-10, 10)))
        hours = max(0, base_hours + random.uniform(-3, 3))

        # 🔥 IMPORTANT FEATURE
        density = active / (occupancy + 1)

        risk = calculate_risk(occupancy, active, air, hygiene, hours)

        data.append([
            occupancy,
            active,
            air,
            hygiene,
            hours,
            density,
            risk
        ])

df = pd.DataFrame(data, columns=[
    "occupancy",
    "active",
    "air",
    "hygiene",
    "hours",
    "density",
    "risk"
])

X = df.drop("risk", axis=1)
y = df["risk"]

model = RandomForestClassifier(n_estimators=100)
model.fit(X, y)

joblib.dump(model, "infection_model.pkl")

print("✅ Infection model trained successfully with augmented data")