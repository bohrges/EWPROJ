import csv
import json
import re

def get_relationships(row):
    relationships = []
    kinship = re.compile(r"([\wãẽô\s]+)\.\s*Proc\.(\d+)")
    kinship_matches = kinship.findall(row)
    for match in kinship_matches:
        relationships.append((match[1], match[0]))
    return relationships

def get_parents(row):
    parent = re.compile(r"Filiação:\s([^.]+)\se\s*([^.]+)")
    father = ""
    mother = ""
    for match in parent.findall(row):
        father = match[0]
        mother = match[1]
    return father, mother

def get_name(row):
    name = re.compile(r'Inquirição de genere de (.+)$')
    for match in name.findall(row):
        return match

def get_lugar(row):
    lugar = re.compile(r'em ([\w\s\-,éãç]+), a(?:c*)tual')
    for match in lugar.findall(row):
        return match

def get_concelho(row):
    concelho = re.compile(r'concelho de ([\w\s\-,éãç]+)(?:\.| e dist)')
    for match in concelho.findall(row):
        return match

def get_distrito(row):
    distrito = re.compile(r'distrito (?:de|\(ou país\)) ([\w\s\-,éãç]+)')
    for match in distrito.findall(row):
        return match


def csv_to_json(csvFilePath, jsonFilePath):
    inqs = []
    with open(csvFilePath, encoding='utf-8') as csvf:
        csvReader = csv.DictReader(csvf, delimiter=';')
        # Deleting the first row
        next(csvReader)
        for row in csvReader:  
            
            # Renaming the 'UnitId' column to '_id'
            row['_id'] = row.pop('UnitId')

            # Getting the name of the person
            row['Name'] = get_name(row['UnitTitle'])

            # Getting the familiar relationships
            relationships = get_relationships(row['RelatedMaterial'])
            row['Relationships'] = []
            for r in relationships:
                # Might need to add 0s
                if len(r[0]) < 5:   
                    new_id = '0'*(5-len(r[0])) + r[0]
                row['Relationships'].append({'_id': new_id, 'Relationship': r[1]})

            # Changing stuff on the ScopeContent column
            row['ScopeContent'] = row['ScopeContent'].replace(';', ',')

            # Getting the parents
            parents = get_parents(row['ScopeContent'])
            row['Father'] = parents[0]
            row['Mother'] = parents[1]

            # Getting the location
            row['Lugar'] = get_lugar(row['ScopeContent'])
            row['Concelho'] = get_concelho(row['ScopeContent'])
            row['Distrito'] = get_distrito(row['ScopeContent'])

            inqs.append(row)

    with open(jsonFilePath, 'w', encoding='utf-8') as jsonf:
        json.dump(inqs, jsonf, ensure_ascii=False)

    print("Conversion completed!")

csvFilePath = r'PT-UM-ADB-DIO-MAB-006.CSV'
jsonFilePath = r'db.json'
csv_to_json(csvFilePath, jsonFilePath)
