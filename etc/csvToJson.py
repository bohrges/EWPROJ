import csv

# Custom function to format the JSON output
def format_json(records):
    formatted_records = ",\n".join(
        "{\n" + ",\n".join(
            f'  "{key}": "{value}"' if value else f'  "{key}": ""'
            for key, value in record.items()
        ) + "\n}"
        for record in records
    )
    return "[\n" + formatted_records + "\n]"

# Function to convert a CSV file directly to a JSON file with custom formatting
def make_json(csvFilePath, jsonFilePath):
    # Initialize an empty list to hold the CSV rows as dictionaries
    records = []
    
    # Open the CSV file for reading
    with open(csvFilePath, encoding='utf-8') as csvf:
        # Create a CSV DictReader with semicolon delimiter
        csvReader = csv.DictReader(csvf, delimiter=';')
        
        # Loop through each row in the CSV
        for row in csvReader:
            # Convert all values to string and append each row to the records list
            records.append({k: v for k, v in row.items()})

    # Open the JSON file for writing
    with open(jsonFilePath, 'w', encoding='utf-8') as jsonf:
        # Write the custom formatted JSON to the file
        jsonf.write(format_json(records))

# Specify the file paths
csvFilePath = r'PT-UM-ADB-DIO-MAB-006(1).csv'
jsonFilePath = r'inquiricoes_genere.json'

# Call the function
make_json(csvFilePath, jsonFilePath)
