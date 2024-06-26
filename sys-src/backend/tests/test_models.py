import sys
import os
from unittest.mock import patch, MagicMock
import pandas as pd

current_dir = os.path.dirname(__file__)
module_path = os.path.join(current_dir, '..')

if module_path not in sys.path:
    sys.path.append(module_path)

from models import ModelOne, ModelTwo, create_prediction

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
    assert create_prediction(home, away, results) == expected_output

class TestModelOne:

    def test_predict_home_team_longer(self):
        model = ModelOne()
        result = model.predict("Bayern", "Dortmund")
        expected = create_prediction("Bayern", "Dortmund", [0, 0, 100])
        assert result == expected

    def test_predict_away_team_longer(self):
        model = ModelOne()
        result = model.predict("Real", "Barcelona")
        expected = create_prediction("Real", "Barcelona", [0, 0, 100])
        assert result == expected

    def test_predict_equal_length(self):
        model = ModelOne()
        result = model.predict("Roma", "Lyon")
        expected = create_prediction("Roma", "Lyon", [0, 100, 0])
        assert result == expected

class TestModelTwo:

    @patch('pandas.read_csv')
    def test_model_initialization(self, mock_read_csv):
        mock_read_csv.return_value = pd.DataFrame(columns=['HT_Bayern', 'AT_Dortmund', 'MV_HT', 'MV_AT', 'POS_HT', 'POS_AT', 'R'])
        model = ModelTwo()
        assert 'HT_Bayern' in model.home_teams
        assert 'AT_Dortmund' in model.away_teams

    @patch('pandas.read_csv')
    def test_train(self, mock_read_csv):
        mock_read_csv.return_value = pd.DataFrame(
            columns=['HT_Bayern', 'AT_Dortmund', 'MV_HT', 'MV_AT', 'POS_HT', 'POS_AT', 'R'])
        model = ModelTwo()
        X = pd.DataFrame([[1, 2, 3, 4, 5, 6], [2, 3, 4, 5, 6, 7]], columns=model.columns[:-1])
        y = pd.Series([1, 0])
        model.train(X, y)
        assert model.model.coef_.shape[1] == len(model.columns) - 1

"""
    def setUp(self):
        # Create a ModelTwo instance
        self.model = ModelTwo()

        # Mock data for training and testing
        self.X_train = pd.DataFrame({
            'HT_Bayern': [1, 0, 0, 1],
            'AT_Dortmund': [0, 1, 0, 1],
            'MV_HT': [100, 120, 150, 200],
            'MV_AT': [90, 110, 130, 180],
            'POS_HT': [1, 3, 2, 1],
            'POS_AT': [2, 4, 1, 3]
        })
        self.y_train = [0, 1, 0, 1]

        self.X_test = self.X_train
        self.y_test = self.y_train

    def test_accuracy(self):
        # Train the model
        self.model.train(self.X_train, self.y_train)

        # Calculate accuracy
        accuracy = self.model.accuracy(self.X_test, self.y_test)

        # Assert that the accuracy is 1.0 (since we are using the same data for training and testing)
        self.assertEqual(accuracy, 1.0)






    @patch('pandas.read_csv')
    @patch('utils.load_db')
    @patch('utils.query_market_values')
    @patch('utils.get_current_pos')
    @patch.object(ModelTwo, 'model', create=True)
    def test_predict(self, mock_model, mock_get_current_pos, mock_query_market_values, mock_load_db, mock_read_csv):
        # Mocking the read_csv to return the columns needed for ModelTwo
        mock_read_csv.return_value = pd.DataFrame(
            columns=['HT_Bayern', 'AT_Dortmund', 'MV_HT', 'MV_AT', 'POS_HT', 'POS_AT', 'R'])

        # Mocking the utilities and model predict_proba
        mock_load_db.return_value = {}
        mock_query_market_values.side_effect = [100, 150]
        mock_get_current_pos.side_effect = [1, 2]
        mock_model.predict_proba.return_value = [[0.1, 0.2, 0.7]]

        model = ModelTwo()
        result = model.predict("Bayern", "Dortmund")
        expected = create_prediction("Bayern", "Dortmund", [0.7, 0.2, 0.1])

        assert result == expected

    @patch('joblib.dump')
    def test_save_model(self, mock_joblib_dump):
        model = ModelTwo()
        model.save('test_model.joblib')
        mock_joblib_dump.assert_called_with(model.model, 'models/test_model.joblib')

    @patch('joblib.load')
    def test_load_model(self, mock_joblib_load):
        mock_model = MagicMock()
        mock_joblib_load.return_value = mock_model
        model = ModelTwo()
        model.load('test_model.joblib')
        assert model.model == mock_model
"""