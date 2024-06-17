import requests
import difflib
import pandas as pd
import models

"""
Methods used in our ML models for receiving necessary input data and for our Fast-API Server
"""

#Returns the current table position of a given team
#Fetching Data from openligadb-API
def get_current_pos(team):

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

    data = pd.read_csv("club_values.csv")
    df = pd.DataFrame(data)

    closest_team = difflib.get_close_matches(team, df["Teams"], n=1, cutoff=0.0)
    

    value = df.loc[df['Teams'] == closest_team[0], 'MarketValues']
    return value.iloc[0]


#Returns the market value of a given team from webscraping (transfermarkt)
def get_market_value_from_web(team):
    pass


#Return last n_matches of two teams (transfermarkt)
#[home, away, goal_home, goal_away, date]
def get_last_matches(team_one, team_two, n_matches):
    pass


#list all teams of the first bl from csv
def get_all_teams():
    data = pd.read_csv("club_values.csv", index_col=0)
    df = pd.DataFrame(data)
    return df["Teams"].tolist()


#list all teams of the first bl (transfermarkt)
#[team_one, team_two, team_three ...]
def get_all_teams_from_web(season = 2023):
    url = f"https://www.transfermarkt.de/bundesliga/tabelle/wettbewerb/L1?saison_id={season}"
    response = requests.get(url)

    if response.status_code == 200:
       #fetch the data
       #return all bl teams as list
       return [] 
    else:
        print(f"Failed to retrieve data: {response.status_code}")
        return None


#Predict a result between two teams
def predict(home, away):
    model = models.ModelOne()
    return model.predict()
