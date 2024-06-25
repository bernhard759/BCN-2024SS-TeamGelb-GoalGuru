import pytest
from httpx import AsyncClient
from server import app

@pytest.mark.asyncio
async def test_get_teams():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/api/teams")
    assert response.status_code == 200
    assert response.json() == {"teams": ["Team A", "Team B", "Team C", "Team D"]}
    
@pytest.mark.asyncio
async def test_get_matches():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/api/matches")
    assert response.status_code == 200
    assert response.json() == [
        {"home_team": "Team A", "away_team": "Team B", "home_goals": 3, "away_goals": 1, "date": "2023-04-15"},
        {"home_team": "Team A", "away_team": "Team C", "home_goals": 1, "away_goals": 1, "date": "2023-04-16"},
    ]


