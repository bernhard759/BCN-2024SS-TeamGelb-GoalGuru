import requests
from bs4 import BeautifulSoup
import time
import pandas as pd
from datetime import datetime
import json

#link to all the fixtures and results
matchday_url = "https://www.transfermarkt.de/bundesliga/gesamtspielplan/wettbewerb/L1"

#link to club market values
market_value_url = "https://www.transfermarkt.de/bundesliga/startseite/wettbewerb/L1"

#link to the bundesliga matchday table
matchday_table_url = "https://www.transfermarkt.de/bundesliga/spieltagtabelle/wettbewerb/L1"

base_url = "https://www.transfermarkt.de/vergleich/bilanzdetail/verein/{}/gegner_id/{}"

#Request-Header
header = {
"User-Agent":
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36"
}

bundesliga_1 = {"Bayer": 15, "Bayern": 27, "Stuttgart": 79, "Leipzig": 23826, "Borussia": 18, "Eintracht": 24, "Freiburg": 60, "Augsburg": 167, "Hoffenheim": 533, "Heidenheim": 2036, "Werder": 86, "Wolfsburg": 82, "Union": 89, "Bochum": 80, "Mainz": 39, "Köln": 3, "Darmstadt": 105}


#Returns all available matchday-results [home, draw, away] for a given season
#For the parameter "season", the year in which the season started should be specified (e.g., for the 2019-2020 season, "season" is equal to 2019) 
def get_matchday_results(season):

    url = f"{matchday_url}?saison_id={season}"

    data = requests.get(url=url, headers=header)

    matches = {}

    if(data.status_code == 200):
        soup = BeautifulSoup(data.text, 'html.parser')
        tables = soup.find_all("div", attrs={"class":"box"})

        for table in tables:
            matchday = table.find("div", attrs={"class":"content-box-headline"})

            if(matchday is None):
                continue

            matchday_number = matchday.get_text()

            matches[matchday_number] = []

            #list of all tds for the home teams of a matchday
            matchday_home = matchday.parent.find("tbody").find_all("td", attrs={"class":"text-right no-border-rechts hauptlink"})
            #list of all tds for the results of a matchday
            matchday_result = matchday.parent.find("tbody").find_all("td", attrs={"class":"zentriert hauptlink"})
            #list of all tds for the away teams of a matchday
            matchday_away = matchday.parent.find("tbody").find_all("td", attrs={"class":"no-border-links hauptlink"})

            for i in range(len(matchday_home)):

                home_team = matchday_home[i].find("a").get("title")
                away_team = matchday_away[i].find("a").get("title")

                game_result = matchday_result[i].find("a").get_text()

                game_result = game_result.split(":")

                if(int(game_result[0]) > int(game_result[1])):
                    game_result = "home"
                elif(int(game_result[0]) < int(game_result[1])):
                    game_result = "away"
                else:
                    game_result = "draw"
            
                matches[matchday_number].append([home_team, away_team, game_result])

        return matches

    else:
        return f"Could not process request. Status Code {data.status_code}"


#Returns the market values of all 18 Bundesliga Clubs in a given season (returend as a dict)
#For the parameter "season", the year in which the season started should be specified (e.g., for the 2019-2020 season, "season" is equal to 2019) 
def get_market_values(season):

    url = f"{market_value_url}/plus/?saison_id={season}"

    data = requests.get(url=url, headers=header)

    market_values = {}

    soup = BeautifulSoup(data.text, 'html.parser')
    table = soup.find("table", attrs={"class":"items"})
    table_rows = table.find("tbody").find_all("tr")

    for row in table_rows:
        team = row.find("td", attrs={"class":"hauptlink no-border-links"}).find("a", title=True).get("title")
        market_value = row.find_all("td", attrs={"class":"rechts"})[1].find("a", title=True).get_text()
        market_values[team] = market_value.split(" ")[0].replace(",",".")

    return market_values



#Returns the transfermarkt ids of all 18 Bundesliga Clubs in a given season (returend as a dict)
#For the parameter "season", the year in which the season started should be specified (e.g., for the 2019-2020 season, "season" is equal to 2019) 
def get_transfermarkt_ids(season):

    url = f"{market_value_url}/plus/?saison_id={season}"

    data = requests.get(url=url, headers=header)

    ids = {}

    soup = BeautifulSoup(data.text, 'html.parser')
    table = soup.find("table", attrs={"class":"items"})
    table_rows = table.find("tbody").find_all("tr")

    for row in table_rows:
        team = row.find("td", attrs={"class":"hauptlink no-border-links"}).find("a", title=True).get("title")
        id = row.find("td", attrs={"class":"hauptlink no-border-links"}).find("a", title=True).get("href")
        ids[team] = int(id.split("verein/")[1].split("/")[0])

    return ids



#Returns the position of each club BEFORE the given matchday takes place (returned in an array of dicts)
#For the parameter "season", the year in which the season started should be specified (e.g., for the 2019-2020 season, "season" is equal to 2019)
#The parameter "spieltag" determines the number of matchdays displayed.
def get_matchday_positions(season, spieltage = 34, delay=2):

    matchday_tables = []

    #Read the data for each matchday
    for spieltag in range(spieltage):
        url = f"{matchday_table_url}?saison_id={season}&spieltag={spieltag+1}"
        
        data = requests.get(url=url, headers=header)

        soup = BeautifulSoup(data.text, 'html.parser')
        table = soup.find("table", attrs={"class":"items"})
        table_rows = table.find("tbody").find_all("tr")

        pos = 1
        matchday_tables.append(dict())
        for row in table_rows:
            club_name = row.find("td", attrs={"class":"no-border-links hauptlink"}).find("a", title = True).get("title")
            matchday_tables[spieltag][club_name] = pos
            pos += 1
        
        time.sleep(delay)

    #In order to get the position of each club BEFORE the matchday --> Shift the array forward by one position
    first_element = dict(matchday_tables[0])
    for key in first_element.keys():
        first_element[key]= 9

    matchday_tables.insert(0,first_element)
    matchday_tables.pop()

    return matchday_tables


#Returns list with the name of the winner from two selected teams of last 'n' games between them
#Parameter n: number of games
#Parameter team_a, team_b = names of the teams
def find_n_last_games(team_a, team_b, n):
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

#Returns dictionary with the final position of the teams from last season
def get_last_season_positions(season):
    last_season_tabelle_url = "https://www.transfermarkt.de/bundesliga/tabelle/wettbewerb/L1/saison_id/{}/plus/1"
    url = last_season_tabelle_url.format(season)

    data = requests.get(url=url, headers=header)
    soup = BeautifulSoup(data.text, 'html.parser')
    table = soup.find("table", attrs={"class": "items"})
    table_rows = table.find("tbody").find_all("tr")

    positions = {}

    for row in table_rows:
        team_name = row.find("td", attrs={"class": "no-border-links hauptlink"}).find("a", title=True).get("title")
        team_position = row.find("td", attrs={"class": "rechts hauptlink"}).get_text(strip=True)
        positions[team_name] = team_position

    return positions


#Get all games played with results and date of a season
#Parameter "season" determines the year / season 
def get_complete_matchday_data(season):

    url = f"{matchday_url}?saison_id={season}"

    data = requests.get(url=url, headers=header)

    matches = []

    if(data.status_code == 200):
        soup = BeautifulSoup(data.text, 'html.parser')
        tables = soup.find_all("div", attrs={"class":"box"})

        for table in tables:
            matchday = table.find("div", attrs={"class":"content-box-headline"})

            if(matchday is None):
                continue

            #list of all tds for the home teams of a matchday
            matchday_home = matchday.parent.find("tbody").find_all("td", attrs={"class":"text-right no-border-rechts hauptlink"})
            #list of all tds for the results of a matchday
            matchday_result = matchday.parent.find("tbody").find_all("td", attrs={"class":"zentriert hauptlink"})
            #list of all tds for the away teams of a matchday
            matchday_away = matchday.parent.find("tbody").find_all("td", attrs={"class":"no-border-links hauptlink"})
            #list of all date tds
            matchday_dates = matchday.parent.find("tbody").find_all("td", attrs={"class":"show-for-small", "colspan":"7"})

            for i in range(len(matchday_home)):

                home_team = matchday_home[i].find("a").get("title")
                away_team = matchday_away[i].find("a").get("title")

                game_result = matchday_result[i].find("a").get_text()

                game_result = game_result.split(":")

                date = matchday_dates[0].find("a").get_text()

                matches.append([home_team, away_team, game_result[0], game_result[1], date])
        return matches
    else:
        return f"Could not process request. Status Code {data.status_code}"



#Get all games played within a given time range
#Save the data into a csv file
#Parameter season_range: range of seasons "a-b", a inclusive, b exclusive  (e.g "2017-2024")
def generate_matchdata_csv(season_range):
    try:
        season_range = season_range.split("-")
        if(len(season_range) != 2):
            raise ValueError(f"Invalid param season_range {season_range}")
        if(int(season_range[0]) < 2000):
            raise ValueError(f"Invalid param season_range {season_range}. Do not enter values before the year 2000.")
        if(int(season_range[1]) > datetime.now().year):
            raise ValueError(f"Invalid param season_range {season_range}. Do not enter values after the year {datetime.now().year}.")

    except Exception as e:
        print(f"Exception thrown: {e}")
        return

    data = []

    for i in range(int(season_range[0]), int(season_range[1])):
        season_matches = get_complete_matchday_data(i)

        for season_match in season_matches:
            data.append(season_match)

    df = pd.DataFrame(data,columns = ["Home_Team","Away_Team","Goals_Home","Goals_Away","Date"])
    df["Date"] = pd.to_datetime(df['Date'])
    df.to_csv(f"csv-data/matchdata_{season_range[0]}-{season_range[1]}.csv")
    return df


#Get all games played within a given time range
#Save the data into a json file
#Parameter season_range: range of seasons "a-b", a inclusive, b exclusive  (e.g "2017-2024")
def generate_matchdata_json(season_range):
    try:
        season_range = season_range.split("-")
        if(len(season_range) != 2):
            raise ValueError(f"Invalid param season_range {season_range}")
        if(int(season_range[0]) < 2000):
            raise ValueError(f"Invalid param season_range {season_range}. Do not enter values before the year 2000.")
        if(int(season_range[1]) > datetime.now().year):
            raise ValueError(f"Invalid param season_range {season_range}. Do not enter values after the year {datetime.now().year}.")

    except Exception as e:
        print(f"Exception thrown: {e}")
        return

    data = []

    for i in range(int(season_range[0]), int(season_range[1])):
        season_matches = get_complete_matchday_data(i)

        for season_match in season_matches:
            data.append({"Home":season_match[0], "Away":season_match[1], "Goals_Home":season_match[2], "Goals_Away":season_match[3], "Date":season_match[4]})

    json_data = json.dumps(data, indent=4)
    with open(f"json-data/matchdata_{season_range[0]}-{season_range[1]}.json", 'w') as json_file:
        json_file.write(json_data)
    return json_data


#Create a dataframe out of all Bundesliga teams and their market values
#Parameter "season" determines the year / season 
def generate_mv_csv(season):
    data = get_market_values(season)
    df = pd.DataFrame(columns=["Teams","MarketValues"])
    df["Teams"] = list(data.keys())
    df["MarketValues"] = list(data.values())
    df.to_csv('csv-data/club_values.csv')
    return df


#Create a json file including all Bundesliga teams, their market values, and their transfermarkt ids
#Parameter "season" determines the year / season
def generate_team_json(season):
    mv_data = get_market_values(season)
    id_data = get_transfermarkt_ids(season)

    data = []

    for key in mv_data.keys():
        data.append({"Team":key ,"Market_Value":mv_data[key], "ID": id_data[key]})
    

    json_data = json.dumps(data, indent=4)
    with open(f"json-data/{season}_teams.json", 'w') as json_file:
        json_file.write(json_data)
    return json_data




#Create a dataframe out of the scraped data for our first ml-model
#Save the data as a csv
def create_dataframe_model_one():
    content = []
    for season in range(2014,2024):
        matches = get_matchday_results(season)
        club_values = get_market_values(season)
        matchday_positions = get_matchday_positions(season)


        for key in matches.keys():
            games_played = matches[key]

            for game in games_played:

                home_team = game[0]
                away_team = game[1]
                result = game[2]

                mv_home_team = club_values[home_team]
                mv_away_team = club_values[away_team]

                matchday_index = int(str(key).split(".")[0])-1
                pos_home_team = matchday_positions[matchday_index][home_team]
                pos_away_team = matchday_positions[matchday_index][away_team]

                content.append([home_team, away_team, result, mv_home_team, mv_away_team, pos_home_team, pos_away_team])

    df = pd.DataFrame(content)
    df.columns = ["HT","AT","R","MV_HT","MV_AT","POS_HT","POS_AT"]
    df = pd.get_dummies(df, columns=["HT", "AT"])
    df.to_csv('csv-data/data_model_one.csv')
    return df




def create_dataframe_model_two(start_season, end_season):
    all_data = []

    for season in range(start_season, end_season + 1):
        # Fetch data
        matchday_results = get_matchday_results(season)
        market_values = get_market_values(season)
        matchday_positions = get_matchday_positions(season, 34, 2)
        last_season_positions = get_last_season_positions(season - 1)

        data = []

        for matchday, matches in matchday_results.items():
            matchday_number = int(matchday.split('.')[0])
            positions = matchday_positions[matchday_number - 1]

            for match in matches:
                home_team, away_team, result = match
                home_market_value = market_values.get(home_team, 'NA')
                away_market_value = market_values.get(away_team, 'NA')
                home_position = positions.get(home_team, 'NA')
                away_position = positions.get(away_team, 'NA')
                home_position_last_season = last_season_positions.get(home_team, 'NA')
                away_position_last_season = last_season_positions.get(away_team, 'NA')

                data.append({
                    'Matchday': matchday_number,
                    'Home_Team': home_team,
                    'Away_Team': away_team,
                    'Result': result,
                    'Home_Market_Value': home_market_value,
                    'Away_Market_Value': away_market_value,
                    'Home_Position': home_position,
                    'Away_Position': away_position,
                    'Home_Position_Last_Season': home_position_last_season,
                    'Away_Position_Last_Season': away_position_last_season
                })

        # Add the current season to all seasons data
        all_data += data

    # Create DataFrame
    df = pd.DataFrame(all_data)

    # Save DataFrame as CSV
    # df.to_csv(f'bundesliga_season_{season}.csv', index=False)

    return df



"""generate_matchdata_csv("2000-2024")
generate_mv_csv(2023)
create_dataframe_model_one()"""

"""
generate_matchdata_json("2000-2024")
generate_team_json(2023)
"""

# TODO:
# 1) create_dataframe is slow (get_matchday_positions)
# 2) add more features: billanz, last results

# df = create_dataframe_model_two(2021, 2021)
# print(df)
