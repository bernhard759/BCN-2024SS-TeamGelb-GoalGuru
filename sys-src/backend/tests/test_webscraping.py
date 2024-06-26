import pytest
import sys
import os
from unittest.mock import patch, MagicMock, Mock
import pandas as pd
import time

current_dir = os.path.dirname(__file__)
module_path = os.path.join(current_dir, '..')

if module_path not in sys.path:
    sys.path.append(module_path)

import webscraping as ws


#Tests for the get_matchday_results function:
def test_get_matchday_results_response_time():
    season = '2020'
    start_time = time.time()
    ws.get_matchday_results(season)
    end_time = time.time()
    assert end_time - start_time < 10

def test_get_matchday_results_1():
    expected_result = ['FC Bayern München', 'FC Schalke 04', 'home']
    result = ws.get_matchday_results(2020)['1. Spieltag'][0]
    assert expected_result == result

@patch('requests.get')
def test_get_matchday_results_incorrect_html(mock_get):
    incorrect_html = "<html><head></head><body>No matchday data here</body></html>"
    mock_resp = MagicMock()
    mock_resp.status_code = 200
    mock_resp.text = incorrect_html
    mock_get.return_value = mock_resp

    season = "2023"
    result = ws.get_matchday_results(season)
    assert result == {}

@patch('requests.get')
def test_get_matchday_results_empty_response(mock_get):
    mock_resp = MagicMock()
    mock_resp.status_code = 200
    mock_resp.text = ""
    mock_get.return_value = mock_resp

    season = "2023"
    result = ws.get_matchday_results(season)
    assert result == {}

#Tests for the get_market_values function:
def test_get_market_values_response_time():
    season = '2020'
    start_time = time.time()

    try:
        ws.get_market_values(season)
    except Exception as e:
        print(f"Test Failed: {e}")
        return

    end_time = time.time()
    duration = end_time - start_time

    assert duration < 10, f"Test Failed: Function took {duration:.2f} seconds to respond."

def test_get_market_values_returns_dict():
    season = '2021'
    result = ws.get_market_values(season)
    if not isinstance(result, dict):
        print("Test Failed: The result is not a dictionary.")
        return

def test_get_market_values_dict_length():
    season = '2019'
    result = ws.get_market_values(season)
    if len(result) != 18:
        print(f"Test Failed: The result does not have 18 keys. It has {len(result)} keys.")
        return

def test_get_market_values_2020():
    season = '2020'
    result = ws.get_market_values(season)
    assert result["FC Bayern München"] == '858.23'
    assert result["Borussia Dortmund"] == '628.40'
    assert result["Bayer 04 Leverkusen"] == '373.25'

#Tests for the get_transfermarkt_ids function:
def test_get_transfermarkt_ids_response_time():
    season = '2020'
    start_time = time.time()

    try:
        ws.get_transfermarkt_ids(season)
    except Exception as e:
        print(f"Test Failed: {e}")
        return

    end_time = time.time()
    duration = end_time - start_time

    assert duration < 10, f"Test Failed: Function took {duration:.2f} seconds to respond."

def test_get_transfermarkt_ids_returns_dict():
    season = '2021'
    result = ws.get_transfermarkt_ids(season)
    if not isinstance(result, dict):
        print("Test Failed: The result is not a dictionary.")
        return

def test_get_transfermarkt_ids_dict_length():
    season = '2019'
    result = ws.get_transfermarkt_ids(season)
    if len(result) != 18:
        print(f"Test Failed: The result does not have 18 keys. It has {len(result)} keys.")
        return

def test_get_transfermarkt_ids_2020():
    season = '2020'
    result = ws.get_transfermarkt_ids(season)
    expected_ids = [27, 16, 23826, 15, 18, 24, 82, 44, 533, 79, 39, 60, 33, 3, 86, 167, 89, 10]
    for team, expected_id in result.items():
        assert expected_id in expected_ids

#Tests for the get_matchday_positions function:

#Tests for the find_n_last_games function:

"""
@patch('requests.get')
def test_get_matchday_results(self, mock_get):
    # Mocking the response
    mock_response = Mock()
    mock_response.status_code = 200
    mock_response.text = '<html></html>'  # Add appropriate HTML content for testing
    mock_get.return_value = mock_response

    # Call the function
    result = ws.get_matchday_results(2020)

    # Check if the request was made correctly
    mock_get.assert_called_with("https://www.transfermarkt.de/bundesliga/gesamtspielplan/wettbewerb/L1?saison_id=2020")

    # Assert the result (Modify based on the actual HTML content used)
    self.assertIsInstance(result, dict)

@patch('requests.get')
def test_get_market_values(mock_get):
    # Mocking the response
    mock_response = Mock()
    mock_response.status_code = 200
    mock_response.text = '''
    <html>
        <body>
            <table class="items">
                <tbody>
                    <tr>
                        <!-- Mock appropriate table row content here -->
                        <td>Sample Data</td>
                    </tr>
                </tbody>
            </table>
        </body>
    </html>
    '''  # Add appropriate HTML content for testing
    mock_get.return_value = mock_response

    # Call the function
    result = ws.get_market_values(2020)

    # Check if the request was made correctly
    mock_get.assert_called_with("https://www.transfermarkt.de/bundesliga/startseite/wettbewerb/L1/plus/?saison_id=2020",
                                headers=ws.header)

    # Assert the result (Modify based on the actual HTML content used)
    assert isinstance(result, dict)


@patch('requests.get')
def test_get_transfermarkt_ids(self, mock_get):
    # Mocking the response
    mock_response = Mock()
    mock_response.status_code = 200
    mock_response.text = '<html></html>'  # Add appropriate HTML content for testing
    mock_get.return_value = mock_response

    # Call the function
    result = get_transfermarkt_ids(2020)

    # Check if the request was made correctly
    mock_get.assert_called_with("https://www.transfermarkt.de/bundesliga/startseite/wettbewerb/L1/plus/?saison_id=2020",
                                headers=header)

    # Assert the result (Modify based on the actual HTML content used)
    self.assertIsInstance(result, dict)


@patch('requests.get')
def test_get_matchday_positions(self, mock_get):
    # Mocking the response
    mock_response = Mock()
    mock_response.status_code = 200
    mock_response.text = '<html></html>'  # Add appropriate HTML content for testing
    mock_get.return_value = mock_response

    # Call the function
    result = get_matchday_positions(2020)

    # Check if the request was made correctly
    mock_get.assert_called()

    # Assert the result (Modify based on the actual HTML content used)
    self.assertIsInstance(result, list)


@patch('requests.get')
def test_find_n_last_games(self, mock_get):
    # Mocking the response
    mock_response = Mock()
    mock_response.status_code = 200
    mock_response.text = '<html></html>'  # Add appropriate HTML content for testing
    mock_get.return_value = mock_response

    # Call the function
    result = find_n_last_games("Bayern", "Borussia", 5)

    # Check if the request was made correctly
    mock_get.assert_called()

    # Assert the result (Modify based on the actual HTML content used)
    self.assertIsInstance(result, list)


@patch('requests.get')
def test_get_last_season_positions(self, mock_get):
    # Mocking the response
    mock_response = Mock()
    mock_response.status_code = 200
    mock_response.text = '<html></html>'  # Add appropriate HTML content for testing
    mock_get.return_value = mock_response

    # Call the function
    result = get_last_season_positions(2020)

    # Check if the request was made correctly
    mock_get.assert_called_with("https://www.transfermarkt.de/bundesliga/tabelle/wettbewerb/L1/saison_id/2020/plus/1",
                                headers=header)

    # Assert the result (Modify based on the actual HTML content used)
    self.assertIsInstance(result, dict)


@patch('requests.get')
def test_get_complete_matchday_data(self, mock_get):
    # Mocking the response
    mock_response = Mock()
    mock_response.status_code = 200
    mock_response.text = '<html></html>'  # Add appropriate HTML content for testing
    mock_get.return_value = mock_response

    # Call the function
    result = get_complete_matchday_data(2020)

    # Check if the request was made correctly
    mock_get.assert_called_with("https://www.transfermarkt.de/bundesliga/gesamtspielplan/wettbewerb/L1?saison_id=2020",
                                headers=header)

    # Assert the result (Modify based on the actual HTML content used)
    self.assertIsInstance(result, list)

def test_get_market_values():
    expected_result = {'FC Bayern München': '858.23', 'Borussia Dortmund': '628.40', 'RasenBallsport Leipzig': '574.95', 'Bayer 04 Leverkusen': '373.25', 'Borussia Mönchengladbach': '300.75', 'Eintracht Frankfurt': '269.15', 'VfL Wolfsburg': '256.83', 'Hertha BSC': '228.88', 'TSG 1899 Hoffenheim': '228.15', 'VfB Stuttgart': '189.25', '1.FSV Mainz 05': '163.30', 'SC Freiburg': '139.10', 'FC Schalke 04': '123.05', '1.FC Köln': '118.20', 'SV Werder Bremen': '111.98', 'FC Augsburg': '93.05', '1.FC Union Berlin': '82.05', 'Arminia Bielefeld': '56.73'}
    result = test_get_market_values()
    assert expected_result == result
"""