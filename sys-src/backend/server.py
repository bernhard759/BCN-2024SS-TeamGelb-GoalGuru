import uvicorn
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Optional
import logging
import requests

app = FastAPI()
#Dummy data
teams = ["Team A", "Team B", "Team C", "Team D"]
matches = [
    {"home_team": "Team A", "away_team": "Team B", "home_goals": 3, "away_goals": 1, "date": "2023-04-15"},
    {"home_team": "Team A", "away_team": "Team C", "home_goals": 1, "away_goals": 1, "date": "2023-04-16"},
]


#Define response models
class TeamsResponse(BaseModel):
    teams: List[str]

class MatchesResponse(BaseModel):
    home_team: str
    away_team: str
    home_goals: int
    away_goals: int
    date: str

# Endpoint for available teams
@app.get("/api/teams", response_model=TeamsResponse)
async def get_teams():
    logging.info("Received request for teams")
    return {"teams": teams}

@app.get("/api/matches",  response_model=List[MatchesResponse])
async def get_matches():
     logging.info("Received request for matches")
     return matches


@app.get("/api")
async def root():
    return {"message": "Hello World"}

if __name__ == "__main__":
   uvicorn.run("server:app", host="127.0.0.1", port=8000, reload=True)
