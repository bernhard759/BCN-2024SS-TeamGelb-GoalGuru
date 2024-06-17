# Soccer Game Prediction API Specification

We use this as a reference to build our prediction api in the backend and also for setting up mock requests in the frontend.

## API Endpoints

* Prediction
```
GET /api/predict?home_team=<home_team>&away_team=<away_team>
```

This is for predicting the outcome. The backend should use the parameters and then ask our ml-model to predict and the result should then be sent to the frontend as json (see example responses below).


* Last matches

```
GET /api/matches?home_team=<home_team>&away_team=<away_team>&n=<number_of_matches>
```

This request could also be made using public api (openligadb)

* Available teams to select from:

```
GET /api/teams
```

This is needed for the frontend to populate the select boxes


## JSON Responses

* Response for prediction
```json
{
  "teams": ["Team 1", "Team 2"],
  "probabilities": {
    "home": 0.65,
    "draw": 0.25,
    "away": 0.10
  }
}
```

For a draw we could use `None` for the prediction property or maybe we only send the probabilities.

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
* Last n matches against each other
* Current form (last 5 matches outcome)
* Team formation

Possible APIs:
* https://www.api-football.com/
* https://www.openligadb.de/ (recommendation)

We want to use openligadb as our public api because it is free and has all the information we want. A possible challenge here is that our team names could be different than the team names from openligadb and tey even use ids for the teams. A good approach could be to make a mapping between our teams and the team ids from openligadb (maybe first query all teams from openligadb and then do a string similarity match and get the id of the match and then make an api call to openligadb with the id to get the information we want)

