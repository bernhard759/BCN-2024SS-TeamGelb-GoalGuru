import re
import requests
import difflib
import pandas as pd
from bs4 import BeautifulSoup
import models
from tinydb import TinyDB, Query
from datetime import datetime
import json
import os


bundesliga_1 = {
    "Bayer 04 Leverkusen": 15, "FC Bayern München": 27, "VfB Stuttgart": 79, "RasenBallsport Leipzig": 23826,
    "Borussia Mönchengladbach": 18, "Eintracht Frankfurt": 24, "SC Freiburg": 60, "FC Augsburg": 167,
    "TSG 1899 Hoffenheim": 533, "1.FC Heidenheim 1846": 2036, "SV Werder Bremen": 86, "VfL Wolfsburg": 82,
    "1.FC Union Berlin": 89, "VfL Bochum": 80, "1.FSV Mainz 05": 39, "1.FC Köln": 3, "SV Darmstadt 98": 105, "Borussia Dortmund":16
}

header = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/123.0.0.0 Safari/537.36"
    )
}


"""
Methods used in our ML models for receiving necessary input data and for our Fast-API Server
"""

#Returns the current table position of a given team
#Fetching Data from openligadb-API
def get_current_pos(team):
    """
    Returns the current table position of a given team by fetching data from the openligadb-API.

    Parameters:
    team (str): The name of the team.

    Returns:
    int: The current position of the team in the Bundesliga table.
    """

    table_url = "https://api.openligadb.de/getbltable/bl1/2023"
    response = requests.get(table_url)

    if response.status_code == 200:
        team_list = {}
        response_data = response.json()

        pos = 1
        for element in response_data:
            team_list[element["teamName"]] = pos
            pos += 1

        closest_team = difflib.get_close_matches(team, team_list.keys(), n=1, cutoff=0.0)

        return team_list[closest_team[0]]
    else:
        print(f"Failed to retrieve data: {response.status_code}")
        return None


#Returns the market value of a given team from csv
def get_market_value(team):
    """
    Returns the market value of a given team from the CSV file.

    Parameters:
    team (str): The name of the team.

    Returns:
    float: The market value of the team.
    """

    data = pd.read_csv("csv-data/club_values.csv")
    df = pd.DataFrame(data)

    closest_team = difflib.get_close_matches(team, df["Teams"], n=1, cutoff=0.0)
    

    value = df.loc[df['Teams'] == closest_team[0], 'MarketValues']
    return value.iloc[0]


#Returns the market value of a given team from webscraping (transfermarkt)
def get_market_value_web(team):
    """
    Returns the market value of a given team by web scraping the Transfermarkt website.

    Parameters:
    team (str): The name of the team.

    Returns:
    float: The market value of the team.
    """
    team_id = bundesliga_1.get(team)
    if not team_id:
        print(f"Team {team} not found in the dictionary.")
        return None

    url = f"https://www.transfermarkt.com/{team}/startseite/verein/{team_id}"

    try:
        response = requests.get(url, headers=header)
        response.raise_for_status()  # Raise an exception for HTTP errors

        # Use a regular expression to find the market value in the HTML content
        match = re.search(
            r'<a href="[^"]+" class="data-header__market-value-wrapper">\s*<span class="waehrung">€</span>([\d.,]+)\s*<span class="waehrung">m</span>',
            response.text)

        if match:
            market_value = match.group(1).replace(',', '')
            return float(market_value)
        else:
            print("Market value not found")

    except Exception as err:
        print(f"An error occurred: {err}")

    return None


#Return last n_matches of two teams (transfermarkt)
#[home, away, goal_home, goal_away, date]
def get_last_matches_web(team_a, team_b,  n):
    """
    Returns the results of the last n matches between two teams from the Transfermarkt website.

    Parameters:
    team_a (str): The name of the first team.
    team_b (str): The name of the second team.
    n (int): The number of matches to retrieve.

    Returns:
    list: A list of results of the last n matches between the two teams.
    """
    base_url = "https://www.transfermarkt.de/vergleich/bilanzdetail/verein/{}/gegner_id/{}"

    try:
        a = bundesliga_1[team_a]
        b = bundesliga_1[team_b]

        this_url = base_url.format(a, b)

        response = requests.get(this_url, headers=header)
        response.raise_for_status()  # Raise an exception for bad status codes
        soup = BeautifulSoup(response.content, "html.parser")
    except requests.exceptions.RequestException as e:
        print("Error fetching data:", e)

        # getting the table with the results between the teams
    table = soup.select_one('table[class="items"]')
    tr_elements = table.find_all('tr')
    data = []

    for tr in tr_elements:
        td_elements = tr.find_all('td')
        td_row = []
        for td in td_elements:
            td_row.append(td.text.strip())
        data.append(td_row)

    data = [[elem for elem in row if elem.strip()] for row in data]
    data = data[1:]
    data = [row for row in data if len(row) >= 5]
    data = data[:n]

    winners = []
    for row in data:
        result = row[7].split(':')
        try:
            if int(result[0]) > int(result[1]):
                winners.append(team_a)
            elif int(result[0]) < int(result[1]):
                winners.append(team_b)
            else:
                winners.append("Draw")
        except Exception as e:
            print(f"Exception thrown {e}.")
            continue

    return winners


#list all teams of the first bl from csv
def get_all_teams():
    """
    Returns a list of all teams in the first Bundesliga from the CSV file.

    Returns:
    list: A list of all the teams.
    """
    data = pd.read_csv("csv-data/club_values.csv", index_col=0)
    df = pd.DataFrame(data)
    return df["Teams"].tolist()


#list all teams of the first bl (transfermarkt) as dict {teamName : teamID}
def get_all_teams_from_web(season = 2023):
    """
    Returns a dictionary of all teams in the first Bundesliga from the Transfermarkt website.

    Parameters:
    season (int): The season year.

    Returns:
    dict: A dictionary of team names and their IDs.
    """
    url = f"https://www.transfermarkt.de/bundesliga/tabelle/wettbewerb/L1?saison_id={season}"
    response = requests.get(url, headers=header)
    teams = dict()

    if response.status_code == 200:
       #fetch the data
       #return all bl teams as list
        soup = BeautifulSoup(response.text, 'html.parser')
        table = soup.find("table", attrs={"class":"items"})
        tds = table.find_all("td", attrs={"class":"no-border-links hauptlink"})
        

        for td in tds:
            team = td.find("a").get("title")
            link = td.find("a").get("href")
            id = int(str(link).split("verein/")[1].split("/")[0])
            teams[team] = id

        return teams
    else:
        print(f"Failed to retrieve data: {response.status_code}")
        return teams



#Load / Create the tinydb
def load_db(file_paths = ["json-data/matchdata_2000-2024.json", "json-data/2023_teams.json"], db_path = "database/tinydb.json"):
    """
    Loads/creates the TinyDB database with match and team data.

    Parameters:
    file_paths (list): List of file paths to JSON data files.
    db_path (str): Path to the TinyDB database file.

    Returns:
    TinyDB: The TinyDB instance.
    """

    #check if the db-file already exists
    if(os.path.exists(db_path)):

        db = TinyDB(db_path)

    else:
        db = TinyDB(db_path)

        with open(file_paths[0], 'r') as f:
            matchdata = json.load(f)

        with open(file_paths[1], 'r') as f:
            teamdata = json.load(f)
        
        #Table for Matchdata
        table1 = db.table("Matches")
        table1.insert_multiple(matchdata)

        #Table for Teamdata
        table2 = db.table("Team")
        table2.insert_multiple(teamdata)

    return db


#parse string to datetime-object
def parse_date(date_str):
    """
    Parses a string into a datetime object.

    Parameters:
    date_str (str): The date string to parse.

    Returns:
    datetime: The parsed datetime object.
    """
    return datetime.strptime(date_str, '%d.%m.%y')


#return the last n_games played between to teams
def query_games(team_one, team_two, n_games, db):
    """
    Returns the last n games played between two teams from the TinyDB database.

    Parameters:
    team_one (str): The name of the first team.
    team_two (str): The name of the second team.
    n_games (int): The number of games to retrieve.
    db (TinyDB): The TinyDB instance.

    Returns:
    list: A list of the last n games played between the two teams.
    """
    
    matchdata_table = db.table("Matches")

    Game = Query()
    
    games = matchdata_table.search((Game.Home == team_one) & (Game.Away == team_two) | (Game.Home == team_two) & (Game.Away == team_one))

    #remove duplicates from query
    unique_games = {frozenset(game.items()) for game in games}
    
    #parse it back to list of dicts
    unique_games = [dict(game) for game in unique_games]

    #sort the games by date
    games_sorted = sorted(unique_games, key=lambda x: parse_date(x['Date']), reverse=True)


    if(len(games_sorted) > n_games):
        last_n_games = games_sorted[:n_games]
        return last_n_games
    
    return games_sorted
    

#returns informations about the bundesliga-clubs
def query_team_data(db):
    """
    Returns information about the Bundesliga clubs from the TinyDB database.

    Parameters:
    db (TinyDB): The TinyDB instance.

    Returns:
    list: A list of dictionaries containing team data.
    """

    team_table = db.table("Team")

    team_data = team_table.all()

    return team_data


#returns the market_value of a bundesliga club from the db
def query_market_values(team, db):
    """
    Returns the market value of a Bundesliga club from the TinyDB database.

    Parameters:
    team (str): The name of the team.
    db (TinyDB): The TinyDB instance.

    Returns:
    float: The market value of the team.
    """

    team_table = db.table("Team")
    MV = Query()

    data = team_table.search((MV.Team == team))

    return float(data[0]["Market_Value"])


#Train ModelTwo with given data
#Returns the trained model
def train_model_two(path = "csv-data/data_model_one.csv"):
    """
    Trains ModelTwo with the given data and returns the trained model.

    Parameters:
    path (str): The path to the CSV file containing the training data.

    Returns:
    ModelTwo: The trained ModelTwo instance.
    """
    model_two = models.ModelTwo()

    data = pd.read_csv(path, index_col=0)
    df = pd.DataFrame(data)

    y = df["R"]
    X = df.drop("R", axis=1)
    
    model_two.train(X,y)
    return model_two


#Save a given ModelTwo into a joblib file
def save_model_two(model : models.ModelTwo,  model_file_name = "model_two.joblib"):
    model.save(model_file_name)

#Create an instance of model_one
def create_model_one():
    return models.ModelOne()


#Create an instance of model_one
def load_model_two():
    model = models.ModelTwo()
    model.load()
    return model


#Generate, train and save a new ModelTwo
def init_model_two(path = "csv-data/data_model_one.csv"):
    data = pd.read_csv(path, index_col=0)
    df = pd.DataFrame(data)

    # Aufteilen in Merkmale und Zielvariable
    y = df['R']
    X = df.drop('R', axis=1)

    # Instanzieren und Trainieren des Modells
    model = models.ModelTwo(path)
    model.train(X,y)
    model.save()


#Create prediction 
def create_prediction(home, away, results):
    """
    Creates a prediction dictionary with the given results.

    Parameters:
    home (str): The name of the home team.
    away (str): The name of the away team.
    results (list): A list containing the probabilities of home win, draw, and away win.

    Returns:
    dict: A dictionary containing the prediction results.
    """
    
    return {
        "teams": [home, away],
        "probabilities": {
            "home": results[0],
            "draw": results[1],
            "away": results[2]
        }
    }

# Snyc club names to model names
def sync_club_name(club, db):
    """
    Adjusts the club name to the corresponding model names using the TinyDB database.

    Parameters:
    club (str): The name of the club.
    db (TinyDB): The TinyDB instance.

    Returns:
    str: The closest matching club name from the database.
    """

    team_data = query_team_data(db)
    team_list = [team["Team"] for team in team_data]

    closest_team = difflib.get_close_matches(club, team_list, n=1, cutoff=0.0)

    return closest_team[0]


if __name__ == "__main__":

    """
    #Test Query Matchdata
    db = load_db()
    print("------\n")
    print(query_games("1.FC Heidenheim 1846", "SC Freiburg", 10, db))
    print("\n------\n")
    """


    """
    #Test Query Teamdata
    db = load_db()
    print("------\n")
    print(query_team_data(db))
    print("\n------\n")
    """

    """
    #Test Query Teamdata
    db = load_db()
    print("------\n")
    print(query_market_values("1.FC Köln",db))
    print("\n------\n")
    """
