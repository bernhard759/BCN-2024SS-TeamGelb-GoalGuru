import pytest
from httpx import AsyncClient
from server import app  # Make sure to import your actual FastAPI app

@pytest.mark.asyncio
async def test_get_teams():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/api/teams")
    assert response.status_code == 200
    assert isinstance(response.json()["teams"], list)  # Checking if the response is a list
    
@pytest.mark.asyncio  
async def test_get_matches():
    home_team = "Union Berlin"
    away_team = "RasenBallsport Leipzig"
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get(f"/api/matches?home_team={home_team}&away_team={away_team}")
    assert response.status_code == 200
    
@pytest.mark.asyncio
async def test_predict_fail():
    home_team = "Team A"
    away_team = "Team B"
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get(f"/api/predict?home_team={home_team}&away_team={away_team}")
    assert response.status_code == 500
    

