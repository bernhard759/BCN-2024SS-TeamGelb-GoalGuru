import pytest
import sys
import os

current_dir = os.path.dirname(__file__)
module_path = os.path.join(current_dir, '..')

if module_path not in sys.path:
    sys.path.append(module_path)

from utils import get_market_value, get_market_value_web, get_all_teams_from_web, get_all_teams, get_last_matches_web, get_current_pos


@pytest.mark.parametrize("a, expected", [
    ("FC Bayern München", 872.45)
])
def test_get_market_value(a, expected):
    assert get_market_value(a) == expected


@pytest.mark.parametrize("a, expected", [
    ("Fc Bajern Mönchen", 872.45)
])
def test_get_market_value_typo_team(a, expected):
    assert get_market_value(a) == expected


"""
@pytest.mark.parametrize("a, expected", [
    ("FC Bayern München", 937.4)
])
def test_get_market_value_from_web(a, expected):
    assert get_market_value_web(a) == expected
"""

@pytest.mark.parametrize("season, expected", [
    ("2023", set(["FC Bayern München",
        "Bayer 04 Leverkusen",
        "RasenBallsport Leipzig",
        "Borussia Dortmund",
        "VfB Stuttgart",
        "Eintracht Frankfurt",
        "VfL Wolfsburg",
        "SC Freiburg",
        "Borussia Mönchengladbach",
        "TSG 1899 Hoffenheim",
        "1.FC Union Berlin",
        "1.FSV Mainz 05",
        "FC Augsburg",
        "SV Werder Bremen",
        "1.FC Köln",
        "1.FC Heidenheim 1846",
        "VfL Bochum",
        "SV Darmstadt 98"]))
])
def test_get_all_teams_from_web(season, expected):
    assert set(get_all_teams_from_web(season).keys()) == expected



@pytest.mark.parametrize("expected", [
    (set(["FC Bayern München",
        "Bayer 04 Leverkusen",
        "RasenBallsport Leipzig",
        "Borussia Dortmund",
        "VfB Stuttgart",
        "Eintracht Frankfurt",
        "VfL Wolfsburg",
        "SC Freiburg",
        "Borussia Mönchengladbach",
        "TSG 1899 Hoffenheim",
        "1.FC Union Berlin",
        "1.FSV Mainz 05",
        "FC Augsburg",
        "SV Werder Bremen",
        "1.FC Köln",
        "1.FC Heidenheim 1846",
        "VfL Bochum",
        "SV Darmstadt 98"]))
])
def test_get_all_teams(expected):
    assert set(get_all_teams()) == expected

def test_get_last_matches_web1():
    result = get_last_matches_web('FC Bayern München', 'Bayer 04 Leverkusen', 5)
    assert isinstance(result, list), "Expected list as return type"

"""
def test_get_last_matches_web2():
    result = get_last_matches_web('FC Bayern München', 'Bayer 04 Leverkusen', 5)
    assert result == ['FC Bayern München', 'Draw', 'FC Bayern München', 'FC Bayern München', 'Draw']
"""

def test_get_current_position1():
    result = get_current_pos('FC Bayern München')
    assert result == 3

def test_get_current_position2():
    # Define a dictionary mapping teams to their current positions
    team_positions = {
        'Bayer 04 Leverkusen': 1,
        'VfB Stuttgart': 2,
        'FC Bayern München': 3,
        'RasenBallsport Leipzig': 4,
        'Borussia Dortmund': 5,
        'Eintracht Frankfurt': 6,
        'TSG 1899 Hoffenheim': 7,
        '1.FC Heidenheim 1846': 8
    }

    for team, expected_position in team_positions.items():
        result = get_current_pos(team)
        assert result == expected_position, f"Expected position for {team} is {expected_position}, but got {result}"
