import pandas as pd
from pymongo import MongoClient
from sklearn.ensemble import RandomForestRegressor
import joblib

# Connect to MongoDB

client = MongoClient("mongodb://localhost:27017/")
db = client["jeevixa_ml"]
collection = db["admissions"]

# Load data

data = list(collection.find())
df = pd.DataFrame(data)

# Feature engineering

df["hour"] = df["admissionTime"].apply(lambda x: x.hour)
df["day"] = df["admissionTime"].apply(lambda x: x.weekday())

# Group data (count admissions per hour per day)

grouped = df.groupby(["day", "hour"]).size().reset_index(name="count")

# Features & target

X = grouped[["hour", "day"]]
y = grouped["count"]

# Train model

model = RandomForestRegressor(n_estimators=100)
model.fit(X, y)

# Save model

joblib.dump(model, "model.pkl")

print("✅ Model trained successfully and saved as model.pkl")
