import pandas as pd
from sklearn.linear_model import LogisticRegression
import joblib
import utils

def create_prediction(home, away, results):
    return {
        "teams": [home, away],
        "probabilities": {
            "home": results[0],
            "draw": results[1],
            "away": results[2]
        }
    }

#A very simple AI model that selects the team with the longer name. 
class ModelOne:

    #Selects the team with the longer name between two teams.
    #Parameters: 
    # home: The name of the home team.
    # away: The name of the away team.
    def predict(self, home, away):
        if len(home) > len(away):
            return create_prediction(home, away, [100,0,0])
        elif len(away) > len(home):
            return create_prediction(home, away, [0,0,100])
        else:
            return create_prediction(home, away, [0,100,0])



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

        mv_ht = utils.get_market_value(home)
        mv_at = utils.get_market_value(away)

        pos_ht = utils.get_current_pos(home)
        pos_at = utils.get_current_pos(away)

        X = {"MV_HT":mv_ht, "MV_AT":mv_at, "POS_HT":pos_ht, "POS_AT":pos_at}
        X.update(team_dict_home)
        X.update(team_dict_away)

        X = pd.DataFrame(X, index=[0])

        result = self.model.predict_proba(X)
        return create_prediction(home, away, [result[2], result[1], result[0]])


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

    #Create ModelOne
    """
    model_one = ModelOne()
    model_one.predict("Bayern", "Dortmund")
    """


    #Create ModelTwo
    """
    model_two = ModelTwo()

    data = pd.read_csv("data_model_one.csv",index_col=0)
    df = pd.DataFrame(data)

    y = df["R"]
    X = df.drop("R", axis=1)
    
    model_two.train(X,y)

    model_two.save()"""
    

    #Load saved ModelTwo
    """
    model_two = ModelTwo()
    model_two.load()
    print(model_two.predict("1.FC Köln","Borussia Dortmund"))
    """
