import uvicorn
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Optional
import logging
#import models


app = FastAPI()
#Dummy data
teams = ["Team A", "Team B", "Team C", "Team D"]

matches = [
    {"home_team": "Team A", "away_team": "Team B", "home_goals": 3, "away_goals": 1, "date": "2023-04-15"},
    {"home_team": "Team A", "away_team": "Team C", "home_goals": 1, "away_goals": 1, "date": "2023-04-16"},
]

predictions = {
    ("Team A", "Team B"): {"prediction": "Team A", "probabilities": {"win": 0.65, "draw": 0.25, "lose": 0.10}},
    ("Team C", "Team D"): {"prediction": "Team D", "probabilities": {"win": 0.45, "draw": 0.25, "lose": 0.30}},
}

#model = models.ModelOne()


#Define response models
class TeamsResponse(BaseModel):
    teams: List[str]

class MatchesResponse(BaseModel):
    home_team: str
    away_team: str
    home_goals: int
    away_goals: int
    date: str

class PredictionResponse(BaseModel):
    prediction: Optional[str]
    probabilities: Dict[str, float]

# Endpoint for available teams
@app.get("/api/teams", response_model=TeamsResponse)
async def get_teams():
    logging.info("Received request for teams")
    return {"teams": teams}

#Endpoint for match data
@app.get("/api/matches",  response_model=List[MatchesResponse])
async def get_matches():
     logging.info("Received request for matches")
     return matches

# Endpoint for prediction results
@app.get("/api/predict", response_model=PredictionResponse)
async def predict(home_team: str, away_team: str):
    logging.info(f"Received request for prediction: home_team={home_team}, away_team={away_team}")
    
    try:
        #prediction = model.predict(home_team, away_team)
        prediction = predictions.get((home_team, away_team))
        if prediction:
            logging.info(f"Prediction found: {prediction}")
            return prediction
        else:
            logging.error("Prediction not found")
            raise HTTPException(status_code=404, detail="Prediction not found for the given teams")
    except Exception as e:
        logging.error(f"An error occurred in the /api/predict endpoint: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

if __name__ == "__main__":
   uvicorn.run("server:app", host="127.0.0.1", port=8000, reload=True)
