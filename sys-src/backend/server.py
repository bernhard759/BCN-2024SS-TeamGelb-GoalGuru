"""
This module defines a FastAPI application with real(webscraped) data  for team and match management.
It provides endpoints for retrieving teams, matches, and making predictions based on given teams.
"""

import uvicorn
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
import logging
import os
from fastapi.staticfiles import StaticFiles 
from fastapi.responses import JSONResponse 
import utils

app = FastAPI()
model = utils.create_model_two()
tiny_db = utils.load_db()

#Define response models
class TeamsResponse(BaseModel):
    """
    Response model for a list of teams.
    
    Attributes:
        teams (List[str]): List of team names.
    """
    teams: List[str]

class MatchesResponse(BaseModel):
    """
    Response model for the matches.
    
    Attributes:
        Home (str): The name of the home team.
        Away (str): The name of the away team.
        Goals_Home (int): Number of goals scored by the home team.
        Goals_Away (int): Number of goals scored by the away team.
        Date (str): Date of the match.
    """
    Home: str
    Away: str
    Goals_Home: int
    Goals_Away: int
    Date: str

class PredictionProbabilities(BaseModel):
    """
    Response model for prediction probabilities for a given match.
    
    Attributes:
        home (float): Probability of the home team winning.
        draw (float): Probability of a draw.
        away (float): Probability of the away team winning.
    """
    home: float
    draw: float
    away: float

class PredictionResponse(BaseModel):
    """
    Response model for a match prediction.
    
    Attributes:
        teams (List[str]): List of the two teams.
        probabilities (PredictionProbabilities): The win/draw probabilities for the match.
    """
    teams: List[str]
    probabilities: PredictionProbabilities

# Endpoint for available teams
@app.get("/api/teams", response_model=TeamsResponse)
async def get_teams():
    """
    Retrieves a list of available teams from the database.
    
    Returns:
        dict: A dictionary containing a list of team names under the key 'teams'.
        
    Raises:
        HTTPException: An error 500 if an unexpected problem occurs during database query.
    """
    logging.info("Received request for teams")
    try:
        data = utils.query_team_data(tiny_db)
        team_data = {"teams": [team["Team"] for team in data]}
        return team_data
    except Exception as e:
        logging.error(f"An error occurred in the /api/teams endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

#Endpoint for match data
@app.get("/api/matches",  response_model=List[MatchesResponse])
async def get_matches(home_team: str, away_team: str):
    """
    Fetches match data for specific home and away teams.
    
    Args:
        home_team (str): The name of the home team.
        away_team (str): The name of the away team.
    
    Returns:
        List[MatchesResponse]: A list of match details.
        
    Raises:
        HTTPException: An error 500 if an unexpected problem occurs during data retrieval.
    """
    logging.info(f"Received request for matches with home_team={home_team} and away_team={away_team}")
    try:
        filtered_matches = utils.query_games(home_team, away_team, 5, tiny_db)
    except Exception as e:
        logging.error(f"An error occurred in the /api/matches endpoint: {e}")
    return filtered_matches

# Endpoint for prediction results 
#http://127.0.0.1:8080/api/predict?home_team=Team%20A&away_team=Team%20B as example
@app.get("/api/predict", response_model=PredictionResponse)
async def predict(home_team: str, away_team: str):
    """
    Provides prediction results for a given match between two teams.
    
    Args:
        home_team (str): The home team's name.
        away_team (str): The away team's name.
    
    Returns:
        PredictionResponse: Predicted outcome of the match.
        
    Raises:
        HTTPException: An error 500 if an unexpected error occurs during the prediction process.
    """
    logging.info(f"Received request for prediction: home_team={home_team}, away_team={away_team}")
    
    try:
        home_team = utils.sync_club_name(home_team)
        away_team = utils.sync_club_name(away_team)
        return model.predict(home_team, away_team)
    except Exception as e:
        logging.error(f"An error occurred in the /api/predict endpoint: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    
# Mount the static files directory
frontend_dir = os.getenv('FRONTEND_DIR', os.path.join(os.path.dirname(__file__), '..', 'frontend', 'dist'))
if os.path.exists(frontend_dir):
    app.mount("/", StaticFiles(directory=frontend_dir, html=True), name="static")
else:
    @app.get("/")
    async def read_root():
        return JSONResponse(content={"message": "Frontend not available"}, status_code=404)

if __name__ == "__main__":
   uvicorn.run("server:app", host="127.0.0.1", port=8000, reload=True)
