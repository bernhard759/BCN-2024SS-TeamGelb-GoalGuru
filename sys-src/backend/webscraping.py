import requests
from bs4 import BeautifulSoup
import time

#link to all the fixtures and results
matchday_url = "https://www.transfermarkt.de/bundesliga/gesamtspielplan/wettbewerb/L1"

#link to club market values
market_value_url = "https://www.transfermarkt.de/bundesliga/startseite/wettbewerb/L1"

#link to the bundesliga matchday table
matchday_table_url = "https://www.transfermarkt.de/bundesliga/spieltagtabelle/wettbewerb/L1"

#Request-Header
header = {
"User-Agent":
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36"
}


 
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


#TODO:
#Create a dataframe out of the scraped data
#Save the data as a csv
def create_dataframe():
    pass
