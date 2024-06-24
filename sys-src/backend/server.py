import uvicorn
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
from typing import List
import logging
import os
from fastapi.staticfiles import StaticFiles 
import os
from fastapi.staticfiles import StaticFiles 


app = FastAPI()
#Dummy data
teams = ["Team A", "Team B", "Team C", "Team D"]

matches = [
    {"home_team": "Team A", "away_team": "Team B", "home_goals": 3, "away_goals": 1, "date": "2023-04-15"},
    {"home_team": "Team A", "away_team": "Team C", "home_goals": 1, "away_goals": 1, "date": "2023-04-16"},
]

predictions = {
    ("Team A", "Team B"): {
        "teams": ["Team A", "Team B"],
        "probabilities": {"home": 0.65, "draw": 0.25, "away": 0.10}
    },
    ("Team C", "Team D"): {
        "teams": ["Team C", "Team D"],
        "probabilities": {"home": 0.45, "draw": 0.25, "away": 0.30}
    },
}


#Define response models
class TeamsResponse(BaseModel):
    teams: List[str]

class MatchesResponse(BaseModel):
    home_team: str
    away_team: str
    home_goals: int
    away_goals: int
    date: str

class PredictionProbabilities(BaseModel):
    home: float
    draw: float
    away: float


class PredictionProbabilities(BaseModel):
    home: float
    draw: float
    away: float


class PredictionResponse(BaseModel):
    teams: List[str]
    probabilities: PredictionProbabilities

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
#http://127.0.0.1:8080/api/predict?home_team=Team%20A&away_team=Team%20B as example
# Endpoint for prediction results 
#http://127.0.0.1:8080/api/predict?home_team=Team%20A&away_team=Team%20B as example
@app.get("/api/predict", response_model=PredictionResponse)
async def predict(home_team: str, away_team: str):
    logging.info(f"Received request for prediction: home_team={home_team}, away_team={away_team}")
    
    try:
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
    
# Mount the static files directory
frontend_dir = os.getenv('FRONTEND_DIR', os.path.join(os.path.dirname(__file__), '..', 'frontend', 'dist'))
app.mount("/", StaticFiles(directory=frontend_dir, html=True), name="static")

if __name__ == "__main__":
   uvicorn.run("server:app", host="127.0.0.1", port=8000, reload=True)
