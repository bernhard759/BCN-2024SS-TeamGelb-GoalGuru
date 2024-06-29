import pandas as pd
from sklearn.linear_model import LogisticRegression
import joblib
from sklearn.tree import DecisionTreeClassifier

import utils


#A very simple AI model that selects the team with the longer name. 
class ModelOne:
    """
    A simple AI model that predicts the winning team based on the length of their names.

    Methods:
    predict(home, away): Selects the team with the longer name between two teams.
    """

    #Selects the team with the longer name between two teams.
    def predict(self, home, away):
        """
        Selects the team with the longer name between two teams.

        Parameters:
        home (str): The name of the home team.
        away (str): The name of the away team.

        Returns:
        dict: A dictionary containing the predicted result.
        """
        if len(home) > len(away):
            return utils.create_prediction(home, away, [1,0,0])
        elif len(away) > len(home):
            return utils.create_prediction(home, away, [0,0,1])
        else:
            return utils.create_prediction(home, away, [0,1,0])



#First ml-model trained with logistic Regression on our level one dataset ("data_model_one.csv")
class ModelTwo:
    """
    A machine learning model trained with logistic regression on the level one dataset.

    Methods:
    __init__(trainings_data): Initializes the model with training data.
    train(X, y): Trains the model with feature and target data.
    accuracy(X, y): Returns the accuracy of the model.
    predict(home, away): Predicts the match outcome between two teams.
    load(model_file_name): Loads the model from a file.
    save(model_file_name): Saves the model to a file.
    """



    def __init__(self, trainings_data = "csv-data/data_model_one.csv"):
        """
        Initializes the ModelTwo instance with logistic regression and training data.

        Parameters:
        trainings_data (str): The path to the training data CSV file.
        """
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
        """
        Trains the model with feature and target data.

        Parameters:
        X (DataFrame): The feature data.
        y (Series): The target data.
        """
        self.model.fit(X, y)
    

    def accuracy(self, X, y):
        """
        Returns the accuracy of the model.

        Parameters:
        X (DataFrame): The feature data.
        y (Series): The target data.

        Returns:
        float: The accuracy score of the model.
        """
        return self.model.score(X,y)
    

    def predict(self, home, away):
        """
        Predicts the match outcome between two teams.

        Parameters:
        home (str): The name of the home team.
        away (str): The name of the away team.

        Returns:
        dict: A dictionary containing the predicted result.
        """
        
        # Initialize dictionaries for home and away teams with False values
        team_dict_home = {key: False for key in self.home_teams}
        team_dict_away = {key: False for key in self.away_teams}

        # Set the specific home and away team keys to True
        team_dict_home[f"HT_{home}"] = True
        team_dict_away[f"AT_{away}"] = True

        # Load the database
        db = utils.load_db()
        
        # Query the market values for home and away teams
        mv_ht = utils.query_market_values(home, db)
        mv_at = utils.query_market_values(away, db)

        # Get the current positions of home and away teams
        pos_ht = utils.get_current_pos(home)
        pos_at = utils.get_current_pos(away)
        
        # Create a dictionary with the relevant features for prediction
        X = {"MV_HT":mv_ht, "MV_AT":mv_at, "POS_HT":pos_ht, "POS_AT":pos_at}
        X.update(team_dict_home)
        X.update(team_dict_away)
        
        # Convert the dictionary to a DataFrame
        X = pd.DataFrame(X, index=[0])
        
        # Predict the probabilities using the trained model
        result = self.model.predict_proba(X)
        
        # Create and return the prediction result
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
    """
    A machine learning model trained with a decision tree classifier on the level two dataset.

    Attributes:
    model (DecisionTreeClassifier): The decision tree classifier.
    home_teams (list): List of home team features.
    away_teams (list): List of away team features.

    Methods:
    train(X, y): Trains the model with feature and target data.
    accuracy(X, y): Returns the accuracy of the model.
    predict(home, away): Predicts the match outcome between two teams.
    load(model_file_name): Loads the model from a file.
    save(model_file_name): Save
    """
    
    def __init__(self, trainings_data="csv-data/data_model_one.csv", max_depth=5):
        """
        Initializes the ModelThree instance with a decision tree classifier and training data.

        Parameters:
        trainings_data (str): The path to the training data CSV file.
        max_depth (int): The maximum depth of the decision tree.
        """
        self.model = DecisionTreeClassifier(max_depth=max_depth)
        
         # Read the training data columns to identify home and away teams
        self.columns = pd.read_csv(trainings_data).columns
        self.home_teams = []
        self.away_teams = []
        
        # Separate home and away team columns
        for team in self.columns:
            if team.startswith('HT_'):
                self.home_teams.append(team)
            elif team.startswith('AT_'):
                self.away_teams.append(team)
    
    def train(self, X, y):
        """
        Trains the model with feature and target data.

        Parameters:
        X (DataFrame): The feature data.
        y (Series): The target data.
        """
        self.model.fit(X, y)

    def accuracy(self, X, y):
        """
        Returns the accuracy of the model.

        Parameters:
        X (DataFrame): The feature data.
        y (Series): The target data.

        Returns:
        float: The accuracy score of the model.
        """
        return self.model.score(X, y)

    def predict(self, home, away):
        """
        Predicts the match outcome between two teams.

        Parameters:
        home (str): The name of the home team.
        away (str): The name of the away team.

        Returns:
        dict: A dictionary containing the predicted result.
        """
        
        # Initialize dictionaries for home and away teams with False values
        team_dict_home = {key: False for key in self.home_teams}
        team_dict_away = {key: False for key in self.away_teams}

        # Set the specific home and away team keys to True
        team_dict_home[f"HT_{home}"] = True
        team_dict_away[f"AT_{away}"] = True

        # Load the database
        db = utils.load_db()
        
        # Query the market values for home and away teams
        mv_ht = utils.query_market_values(home, db)
        mv_at = utils.query_market_values(away, db)
        
        # Get the current positions of home and away teams
        pos_ht = utils.get_current_pos(home)
        pos_at = utils.get_current_pos(away)
        
        # Create a dictionary with the relevant features for prediction
        X = {"MV_HT": mv_ht, "MV_AT": mv_at, "POS_HT": pos_ht, "POS_AT": pos_at}
        X.update(team_dict_home)
        X.update(team_dict_away)
        
        # Convert the dictionary to a DataFrame
        X = pd.DataFrame(X, index=[0])

        # Predict the probabilities using the trained model
        result = self.model.predict_proba(X)
        
        # Create and return the prediction result
        return utils.create_prediction(home, away, [result[0][2], result[0][1], result[0][0]])

    # Loads the model
    def load(self, model_file_name="model_three.joblib"):
        try:
            self.model = joblib.load(f"models/{model_file_name}")
        except Exception as e:
            print(f"Exception thrown while loading the model. {e}")

    #Saves the model
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


