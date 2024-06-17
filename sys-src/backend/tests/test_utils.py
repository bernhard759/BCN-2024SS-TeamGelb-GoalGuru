import pytest
import sys
import os

current_dir = os.path.dirname(__file__)
module_path = os.path.join(current_dir, '..')

if module_path not in sys.path:
    sys.path.append(module_path)

from utils import get_market_value, get_market_value_from_web, get_all_teams_from_web, get_all_teams


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



@pytest.mark.parametrize("a, expected", [
    ("FC Bayern München", 872.45)
])
def test_get_market_value_from_web(a, expected):
    assert get_market_value_from_web(a) == expected


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
        "1.FC Heidenheim",
        "VfL Bochum",
        "SV Darmstadt"]))
])
def test_get_all_teams_from_web(season, expected):
    assert set(get_all_teams_from_web(season)) == expected



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
        "1.FC Heidenheim",
        "VfL Bochum",
        "SV Darmstadt"]))
])
def test_get_all_teams(expected):
    assert set(get_all_teams()) == expected

