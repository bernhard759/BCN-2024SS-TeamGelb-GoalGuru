# Soccer Game Prediction API Specification

We use this as a reference to build our prediction api in the backend and also for setting up mock requests in the frontend.

## API Endpoints

* Prediction
```
GET /api/predict?home_team=<home_team>&away_team=<away_team>
```

* Last matches

```
GET /api/matches?home_team=<home_team>&away_team=<away_team>&n=<number_of_matches>
```

* Available teams to select from:

```
GET /api/teams
```


## JSON Responses

* Response for prediction
```json
{
  "prediction": "Team 1",
  "probabilities": {
    "win": 0.65,
    "draw": 0.25,
    "lose": 0.10
  }
}
```

* Response for matches

```json
{
  "matches": [
    {
      "home_team": "Team 1",
      "away_team": "Team 2",
      "home_goals": 3,
      "away_goals": 1,
      "date": "2023-04-15"
    },
    {
      "home_team": "Team 1",
      "away_team": "Team 2",
      "home_goals": 1,
      "away_goals": 1,
      "date": "2023-04-15"
    }
  ]
}
```

* Response for the available teams: 

```json
{
  "teams": [
    "Team 1",
    "Team 2",
    "Team 3",
  ]
}
```

## Public API requests

Information needed:
* Current form (last 5 matches outcome)
* Team formation

Possible APIs:
* https://sportdataapi.com/football-soccer-api/#pricingSection
* https://www.api-football.com/


