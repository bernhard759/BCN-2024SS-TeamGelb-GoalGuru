import pandas as pd
from sklearn.linear_model import LogisticRegression
import joblib
from sklearn.tree import DecisionTreeClassifier

import utils


#A very simple AI model that selects the team with the longer name. 
class ModelOne:

    #Selects the team with the longer name between two teams.
    #Parameters: 
    # home: The name of the home team.
    # away: The name of the away team.
    def predict(self, home, away):
        if len(home) > len(away):
            return utils.create_prediction(home, away, [1,0,0])
        elif len(away) > len(home):
            return utils.create_prediction(home, away, [0,0,1])
        else:
            return utils.create_prediction(home, away, [0,1,0])



#First ml-model trained with logistic Regression on our level one dataset ("data_model_one.csv")
class ModelTwo:

    def __init__(self, trainings_data = "csv-data/data_model_one.csv"):
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

        db = utils.load_db()
        
        mv_ht = utils.query_market_values(home, db)
        mv_at = utils.query_market_values(away, db)

        pos_ht = utils.get_current_pos(home)
        pos_at = utils.get_current_pos(away)

        X = {"MV_HT":mv_ht, "MV_AT":mv_at, "POS_HT":pos_ht, "POS_AT":pos_at}
        X.update(team_dict_home)
        X.update(team_dict_away)

        X = pd.DataFrame(X, index=[0])

        result = self.model.predict_proba(X)
        return utils.create_prediction(home, away, [result[0][2], result[0][1], result[0][0]])


    def load(self, model_file_name = "model_two.joblib"):
        try:
            self.model = joblib.load(f"models/{model_file_name}")
        except Exception as e:
            print(f"Exception thrown while loading the model. {e}")
    
    def save(self, model_file_name = "model_two.joblib"):
        try:
            joblib.dump(self.model, f"models/{model_file_name}")
        except Exception as e:
            print(f"Exception thrown while saving the model. {e}")


#TODO:
#Second ml-model trained on our level two dataset
class ModelThree:
    def __init__(self, trainings_data="csv-data/data_model_one.csv", max_depth=5):
        self.model = DecisionTreeClassifier(max_depth=max_depth)

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
        return self.model.score(X, y)

    def predict(self, home, away):
        team_dict_home = {key: False for key in self.home_teams}
        team_dict_away = {key: False for key in self.away_teams}

        team_dict_home[f"HT_{home}"] = True
        team_dict_away[f"AT_{away}"] = True

        db = utils.load_db()

        mv_ht = utils.query_market_values(home, db)
        mv_at = utils.query_market_values(away, db)

        pos_ht = utils.get_current_pos(home)
        pos_at = utils.get_current_pos(away)

        X = {"MV_HT": mv_ht, "MV_AT": mv_at, "POS_HT": pos_ht, "POS_AT": pos_at}
        X.update(team_dict_home)
        X.update(team_dict_away)

        X = pd.DataFrame(X, index=[0])

        result = self.model.predict_proba(X)
        return utils.create_prediction(home, away, [result[0][2], result[0][1], result[0][0]])

    def load(self, model_file_name="model_three.joblib"):
        try:
            self.model = joblib.load(f"models/{model_file_name}")
        except Exception as e:
            print(f"Exception thrown while loading the model. {e}")

    def save(self, model_file_name="model_three.joblib"):
        try:
            joblib.dump(self.model, f"models/{model_file_name}")
        except Exception as e:
            print(f"Exception thrown while saving the model. {e}")



if __name__ == "__main__":

    #Create ModelOne
    """
    model_one = ModelOne()
    model_one.predict("Bayern", "Dortmund")
    """


    #Create ModelTwo
    """
    model_two = ModelTwo()

    data = pd.read_csv("csv-data/data_model_one.csv",index_col=0)
    df = pd.DataFrame(data)

    y = df["R"]
    X = df.drop("R", axis=1)
    
    model_two.train(X,y)

    model_two.save()
    """

    #Load saved ModelTwo
    #print some test predictions
    """
    model_two = ModelTwo()
    model_two.load()
    print(model_two.predict("1.FC K\u00f6ln","Borussia Dortmund"))
    print(model_two.predict("Borussia Dortmund","1.FC Köln"))
    print(model_two.predict("FC Bayern München","Borussia Mönchengladbach"))
    print(model_two.predict("Bayer 04 Leverkusen","Borussia Mönchengladbach"))
    print(model_two.predict("FC Bayern München","1.FC Union Berlin"))
    """
    #Test ModelThree
    """
    model_three = ModelThree()
    data = pd.read_csv("csv-data/data_model_one.csv", index_col=0)
    df = pd.DataFrame(data)
    y = df["R"]
    X = df.drop("R", axis=1)
    model_three.train(X, y)
    model_three.save()
    model_two = ModelThree()
    model_three.load()
    print(model_three.accuracy(X, y))
    print(model_three.predict("Borussia Dortmund", "FC Bayern München"))
    print(model_three.accuracy(X, y))
    """


