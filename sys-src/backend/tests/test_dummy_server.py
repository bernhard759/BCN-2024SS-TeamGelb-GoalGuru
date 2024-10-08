import pytest
from httpx import AsyncClient
from unittest.mock import patch
import sys
import os

current_dir = os.path.dirname(__file__)
module_path = os.path.join(current_dir, '..')

if module_path not in sys.path:
    sys.path.append(module_path)
from dummy_server import dummy_app


@pytest.mark.asyncio
async def test_get_teams_dummy():
    async with AsyncClient(app=dummy_app, base_url="http://test") as ac:
        response = await ac.get("/api/dummy/teams")
    assert response.status_code == 200
    assert response.json() == {"teams": ["Team A", "Team B", "Team C", "Team D"]}
    
@pytest.mark.asyncio
async def test_get_matches_dummy():
    async with AsyncClient(app=dummy_app, base_url="http://test") as ac:
        response = await ac.get("/api/dummy/matches")
    assert response.status_code == 200
    assert response.json() == [
        {"home_team": "Team A", "away_team": "Team B", "home_goals": 3, "away_goals": 1, "date": "2023-04-15"},
        {"home_team": "Team A", "away_team": "Team C", "home_goals": 1, "away_goals": 1, "date": "2023-04-16"},
    ]
@pytest.mark.asyncio
async def test_predict_success():
    async with AsyncClient(app=dummy_app, base_url="http://test") as ac:
        response = await ac.get("/api/dummy/predict?home_team=Team A&away_team=Team B")
    assert response.status_code == 200
    assert "probabilities" in response.json()
    assert response.json()["probabilities"]["home"] == 0.65  # Matching the dummy data
        
@pytest.mark.asyncio
async def test_predict_valid_data():
    async with AsyncClient(app=dummy_app, base_url="http://test") as ac:
        response = await ac.get("/api/dummy/predict?home_team=Team%20A&away_team=Team%20B")
        assert response.status_code == 200
        assert "probabilities" in response.json()
        assert response.json() == {
            "teams": ["Team A", "Team B"],
            "probabilities": {"home": 0.65, "draw": 0.25, "away": 0.10}
        }
        