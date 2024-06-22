import pytest
from httpx import AsyncClient
from server import app

@pytest.mark.asyncio
async def test_get_teams():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/api/teams")
    assert response.status_code == 200
    assert response.json() == {"teams": ["Team A", "Team B", "Team C", "Team D"]}


