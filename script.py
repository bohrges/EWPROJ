import csv
import json
import re

def get_relationships(row):
    relationships = [] #(proc, kinship)
    kinship = re.compile(r"([\wãẽô\s]+)\.\s*Proc\.(\d+)")
    
    kinship_matches = kinship.findall(row)

    for match in kinship_matches:
        relationships.append((match[1], match[0]))
    

    #if relationships:
    #    print(relationships)
    
    return relationships

def get_parents(row):
    parent = re.compile(r"Filiação:\s([^.]+)\se\s*([^.]+)")
    father = ""
    mother = ""

    for match in parent.findall(row):
        father = match[0]
        mother = match[1]

        # print(father)
        # print(mother)

    return father, mother

# Function to convert a CSV to JSON and encapsulate the students in a dataset list
def csv_to_json(csvFilePath, jsonFilePath):
    
    # Initialize a list to hold all student records
    inqs = []
    
    # Open a csv reader called DictReader
    with open(csvFilePath, encoding='utf-8') as csvf:
        csvReader = csv.DictReader(csvf, delimiter=';')

        #print(csvReader.fieldnames)  # This will show all column names
        
        # Convert each row into a dictionary and add it to the list alunos
        for row in csvReader:
            # Handle the Byte Order Mark (BOM) if present in the 'ID' key
            if '\ufeffID' in row:
                row['_id'] = row.pop('\ufeffID')
            else:
                row['_id'] = row.pop('ID')

            # Handle familiar relations
            row['relationships'] = get_relationships(row['RelatedMaterial'])
            row['father'] = (get_parents(row['ScopeContent']))[0]
            row['mother'] = (get_parents(row['ScopeContent']))[1]

            inqs.append(row)

        print(row)  # This will show all column names

    # Open a json writer, and use the json.dumps() function to dump the list of students
    with open(jsonFilePath, 'w', encoding='utf-8') as jsonf:
        json.dump(inqs, jsonf, ensure_ascii=False)
        
# Driver Code

# Decide the two file paths according to your computer system
csvFilePath = r'PT-UM-ADB-DIO-MAB-006.CSV'
jsonFilePath = r'db.json'

# Call the make_json function
csv_to_json(csvFilePath, jsonFilePath)
