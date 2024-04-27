import csv
import json

# Converts the dataset from CSV to JSON, so that it can be loaded into mongo
def csv_to_json(csv_file, json_file):
    with open(csv_file, encoding='utf-8') as f:
        reader = csv.DictReader(f)
        rows = list(reader)

    with open(json_file, 'w', encoding='utf-8') as f:
        json.dump(rows, f, indent=4)

csv_file_path = 'PT-UM-ADB-DIO-MAB-006(1).csv'
json_file_path = 'dataset_proj.json'
csv_to_json(csv_file_path, json_file_path)