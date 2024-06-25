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

model = utils.create_model_one()

tiny_db = utils.load_db()


#Define response models
class TeamsResponse(BaseModel):
    teams: List[str]

class MatchesResponse(BaseModel):
    '''
    home_team: str
    away_team: str
    home_goals: int
    away_goals: int
    date: str
    '''
    Home: str
    Away: str
    Goals_Home: int
    Goals_Away: int
    Date: str

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
    data = utils.query_team_data(tiny_db)
    team_data = {"teams": [team["Team"] for team in data]}
    return team_data
    """
    return {"teams": teams}
    """

#Endpoint for match data
@app.get("/api/matches",  response_model=List[MatchesResponse])
async def get_matches(home_team: str, away_team: str):
    logging.info(f"Received request for matches with home_team={home_team} and away_team={away_team}")
    try:
        filtered_matches = utils.query_games(home_team, away_team, 5, tiny_db)
    except Exception as e:
        logging.error(f"An error occurred in the /api/matches endpoint: {e}")
    return filtered_matches
    """
    filtered_matches = [
        match for match in matches
        if match['home_team'] == home_team and match['away_team'] == away_team
    ]
    if not filtered_matches:
        logging.info("No matches found for the given teams")
        raise HTTPException(status_code=404, detail="No matches found for the given teams")
    return filtered_matches
    """

# Endpoint for prediction results 
#http://127.0.0.1:8080/api/predict?home_team=Team%20A&away_team=Team%20B as example
@app.get("/api/predict", response_model=PredictionResponse)
async def predict(home_team: str, away_team: str):
    logging.info(f"Received request for prediction: home_team={home_team}, away_team={away_team}")
    
    try:
        return model.predict(home_team, away_team)
        """
        prediction = predictions.get((home_team, away_team))
        if prediction:
            logging.info(f"Prediction found: {prediction}")
            return prediction
        else:
            logging.error("Prediction not found")
            raise HTTPException(status_code=404, detail="Prediction not found for the given teams")
        """
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
