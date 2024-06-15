import pandas as pd
from sklearn.linear_model import LogisticRegression
import joblib


#A very simple AI model that selects the team with the longer name. 
class ModelOne:

    #Selects the team with the longer name between two teams.
    #Parameters: 
    # home: The name of the home team.
    # away: The name of the away team.
    def predict(self, home, away):
        if len(home) > len(away):
            return {"home":100, "draw":0, "away":0}
        elif len(away) > len(home):
            return {"home":0, "draw":0, "away":100}
        else:
            return {"home":0, "draw":100, "away":0}



#First ml-model trained with logistic Regression on our level one dataset ("data_model_one.csv")
class ModelTwo:

    def __init__(self, trainings_data = "data_model_one.csv"):
        self.model = LogisticRegression(solver="lbfgs",max_iter=1000)

        self.columns = pd.read_csv(trainings_data).columns
        self.home_teams = []
        self.away_teams = []

        for team in self.columns:
            if team.startswith('HT_'):
                self.home_teams.append(team)
            elif team.startswith('AT_'):
                self.away_teams.append(team)
    

    def train(self, X, y):
        self.model.fit(X, y)
    

    def accuracy(self, X, y):
        return self.model.score(X,y)
    

    def predict(self, home, away):
        team_dict_home = {key: False for key in self.home_teams}
        team_dict_away = {key: False for key in self.away_teams}

        team_dict_home[f"HT_{home}"] = True
        team_dict_away[f"AT_{away}"] = True

        #mv_ht = get_market_value(home)
        #mv_at = get_market_value(away)

        #pos_ht = get_current_pos(home)
        #pos_at = get_current_pos(away)

        return self.model.predict_proba(X)

    def load(self, model_file_name = "model_two.joblib"):
        try:
            self.model = joblib.load(model_file_name)
        except Exception as e:
            print(f"Exception thrown while loading the model. {e}")
    
    def save(self, model_file_name = "model_two.joblib"):
        try:
            joblib.dump(self.model, model_file_name)
        except Exception as e:
            print(f"Exception thrown while saving the model. {e}")


#TODO:
#Second ml-model trained on our level two dataset
class ModelThree:
    def __init__(self):
        pass
    
    def train(self, X, y):
        pass
    
    def predict(self, X):
        pass
    
    def load(self, model_file_name = "model_two.joblib"):
        pass

    def save(self, model_file_name = "model_two.joblib"):
        pass



if __name__ == "__main__":
    
    model_two = ModelTwo()

    data = pd.read_csv("data_model_one.csv")
    df = pd.DataFrame(data)

    y = df["R"]
    X = df.drop("R", axis=1)
    
    model_two.train(X,y)

    model_two.save()