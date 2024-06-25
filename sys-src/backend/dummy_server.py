"""
This module defines a FastAPI application with dummy data for team and match management.
It provides endpoints for retrieving teams, matches, and making predictions based on given teams.
"""


import uvicorn
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
import logging


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
    """
    Response model for a list of dummy data teams.
    Attributes:
        teams (List[str]): List of team names.
    """
    teams: List[str]


class DummyMatchesResponse(BaseModel):
    """
    Response model for dummy data matches.
    Attributes:
        home_team (str): The name of the home team.
        away_team (str): The name of the away team.
        home_goals (int): Number of goals scored by the home team.
        away_goals (int): Number of goals scored by the away team.
        date (str): Date of the match.
    """
    home_team: str
    away_team: str
    home_goals: int
    away_goals: int
    date: str
    

class DummyPredictionProbabilities(BaseModel):
    """
    Dummy prediction probabilities for a match.
    Attributes:
        home (float): Probability of the home team winning.
        draw (float): Probability of a draw.
        away (float): Probability of the away team winning.
    """
    home: float
    draw: float
    away: float
    

class DummyPredictionResponse(BaseModel):
    """
    Response model for a dummy match prediction.
    Attributes:
        teams (List[str]): List of the two teams.
        probabilities (DummyPredictionProbabilities): The win/draw probabilities for the match.
    """
    teams: List[str]
    probabilities: DummyPredictionProbabilities
    
    
# Endpoint for available teams with dummy data
#http://127.0.0.1:8080/api/dummy/teams - route
@app.get("/api/dummy/teams", response_model=DummyTeamsResponse)
async def get_teams():
   try:
        logging.info("Received request for teams")
        return {"teams": teams}
   except Exception as e:
        logging.error(f"An error occurred in the /api/dummy/teams endpoint: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")


#Endpoint for matches with dummy data
#http://127.0.0.1:8080/api/dummy/matches - route
@app.get("/api/dummy/matches",  response_model=List[DummyMatchesResponse])
async def get_matches():
    try:
        logging.info("Received request for matches")
        return matches
    except Exception as e:
        logging.error(f"An error occurred in the /api/dummy/matches endpoint: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
 
 
# Endpoint for prediction results 
#http://127.0.0.1:8080/api/dummy/predict?home_team=Team%20A&away_team=Team%20B as example
@app.get("/api/dummy/predict", response_model=DummyPredictionResponse)
async def predict(home_team: str, away_team: str):
    logging.info(f"Received request for prediction: home_team={home_team}, away_team={away_team}")
    
    try:
        logging.info(f"Received request for prediction: home_team={home_team}, away_team={away_team}")
        prediction = predictions.get((home_team, away_team))
        if prediction:
            logging.info(f"Prediction found: {prediction}")
            return prediction
        else:
            logging.error("Prediction not found")
            raise HTTPException(status_code=404, detail="Prediction not found for the given teams")
    except KeyError:
        logging.error("Invalid team name provided")
        raise HTTPException(status_code=400, detail="Invalid team name provided")
    except Exception as e:
        logging.error(f"An error occurred in the /api/dummy/predict endpoint: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")


if __name__ == "__main__":
    uvicorn.run("dummy_server:app", host="127.0.0.1", port=8080, reload=True)