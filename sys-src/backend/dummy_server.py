import uvicorn
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
import logging
import os
from fastapi.staticfiles import StaticFiles 
from fastapi.responses import JSONResponse 

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
class DummyTeamsResponse(BaseModel):
    teams: List[str]

class DummyMatchesResponse(BaseModel):
    
    home_team: str
    away_team: str
    home_goals: int
    away_goals: int
    date: str
    

class DummyPredictionProbabilities(BaseModel):
    home: float
    draw: float
    away: float

class DummyPredictionResponse(BaseModel):
    teams: List[str]
    probabilities: DummyPredictionProbabilities
    
# Endpoint for available teams with dummy data
#http://127.0.0.1:8080/api/dummy/teams - route
@app.get("/api/dummy/teams", response_model=DummyTeamsResponse)
async def get_teams():
    logging.info("Received request for teams")
    return {"teams": teams}

#Endpoint for matches with dummy data
@app.get("/api/dummy/matches",  response_model=List[DummyMatchesResponse])
async def get_matches():
     logging.info("Received request for matches")
     return matches

if __name__ == "__main__":
    uvicorn.run("dummy_server:app", host="127.0.0.1", port=8080, reload=True)