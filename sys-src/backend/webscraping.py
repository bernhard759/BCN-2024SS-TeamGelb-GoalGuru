import requests
from bs4 import BeautifulSoup

#link to all the fixtures and results
matchday_url = "https://www.transfermarkt.de/bundesliga/gesamtspielplan/wettbewerb/L1"

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
    
