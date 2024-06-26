import sys
import os
from unittest.mock import patch, MagicMock
import pandas as pd

current_dir = os.path.dirname(__file__)
module_path = os.path.join(current_dir, '..')

if module_path not in sys.path:
    sys.path.append(module_path)

#from models import ModelOne, ModelTwo, create_prediction
#import models as md

#from utils import create_model_one()
import utils


def test_create_prediction_basic():
    home = "FC Bayern München"
    away = "Borussia Dortmund"
    results = [0.5, 0.3, 0.2]
    expected_output = {
        "teams": ["FC Bayern München", "Borussia Dortmund"],
        "probabilities": {
            "home": 0.5,
            "draw": 0.3,
            "away": 0.2
        }
    }
    assert utils.create_prediction(home, away, results) == expected_output



def test_predict_home_team_longer():
    model = utils.create_model_one()
    result = model.predict("Bayern", "Dortmund")
    expected = utils.create_prediction("Bayern", "Dortmund", [0, 0, 1])
    assert result == expected


def test_predict_away_team_longer():
    model = utils.create_model_one()
    result = model.predict("Real", "Barcelona")
    expected = utils.create_prediction("Real", "Barcelona", [0, 0, 1])
    assert result == expected

def test_predict_equal_length():
    model = utils.create_model_one()
    result = model.predict("Roma", "Lyon")
    expected = utils.create_prediction("Roma", "Lyon", [0, 1, 0])
    assert result == expected