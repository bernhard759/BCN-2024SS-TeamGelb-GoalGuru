import re
import requests
import difflib
import pandas as pd
from bs4 import BeautifulSoup
import models

bundesliga_1 = {
    "Bayer": 15, "Bayern": 27, "Stuttgart": 79, "Leipzig": 23826,
    "Borussia": 18, "Eintracht": 24, "Freiburg": 60, "Augsburg": 167,
    "Hoffenheim": 533, "Heidenheim": 2036, "Werder": 86, "Wolfsburg": 82,
    "Union": 89, "Bochum": 80, "Mainz": 39, "Köln": 3, "Darmstadt": 105
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
def get_market_value_web(team):
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
            return market_value
        else:
            print("Market value not found")

    except Exception as err:
        print(f"An error occurred: {err}")

    return None


#Return last n_matches of two teams (transfermarkt)
#[home, away, goal_home, goal_away, date]
def get_last_matches_web(team_a, team_b,  n):
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
        if int(result[0]) > int(result[1]):
            winners.append(team_a)
        elif int(result[0]) < int(result[1]):
            winners.append(team_b)
        else:
            winners.append("Draw")

    return winners


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


print(get_last_matches_web("Bayern", "Bayer", 10))
