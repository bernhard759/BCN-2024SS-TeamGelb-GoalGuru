#!/bin/bash

#Generierung der Modeldaten, trainieren und speichern des Models


# Sicherstellen, dass das Skript im richtigen Verzeichnis läuft
cd "$(dirname "$0")"

echo "Running create_dataframe_model_one(True) from webscraping.py..."
python3 -c 'from webscraping import create_dataframe_model_one; create_dataframe_model_one(True)'


# Überprüfen, ob der vorherige Befehl erfolgreich war
if [ $? -ne 0 ]; then
  echo "Error: Failed to run create_dataframe_model_one(True)"
  exit 1
fi


CSV_PATH="csv-data/data_model_one.csv"

#Überprüfe, ob die Datei vorhanden ist
if [ ! -f "$CSV_PATH" ]; then
  echo "Error: $CSV_PATH not found"
  exit 1
fi

export CSV_PATH

echo "Training model with $CSV_PATH..."
python3 -c "
from utils import init_model_two
import os
csv_path = os.getenv('CSV_PATH')
init_model_two(csv_path)
"

# Überprüfen, ob der vorherige Befehl erfolgreich war
if [ $? -ne 0 ]; then
  echo "Error: Failed to train and save the model"
  exit 1
fi

echo "Model training and saving completed successfully."