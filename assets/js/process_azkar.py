import json

# Load the JSON data from the file
with open("../data/azkar.json", "r", encoding="utf-8") as f:
    data = json.load(f)

# Create a dictionary to hold the categorized azkar
categorized_azkar = {}

# Iterate over the data and categorize each zekr
for zekr in data["data"]:
    category = zekr["category"]
    if category not in categorized_azkar:
        categorized_azkar[category] = []
    categorized_azkar[category].append(zekr)

# Generate the JavaScript code
js_code = "const azkarData = {\n"
for category, azkar_list in categorized_azkar.items():
    js_code += f'    "{category}": [\n'
    for zekr in azkar_list:
        # Escape single quotes in zekr and description to prevent JavaScript errors
        escaped_zekr = zekr["zekr"].replace("'", "\\'")
        escaped_description = zekr["description"].replace("'", "\\'")
        escaped_reference = zekr["reference"].replace("'", "\\'")

        js_code += "        {\n"
        js_code += f'            "id": {zekr["id"]},\n'
        js_code += f'            "category": "{zekr["category"]}",\n'
        js_code += f'            "count": "{zekr["count"]}",\n'
        js_code += f'            "description": "{escaped_description}",\n'
        js_code += f'            "reference": "{escaped_reference}",\n'
        js_code += f'            "zekr": "{escaped_zekr}"\n'
        js_code += "        },\n"
    js_code += "    ],\n"
js_code += "};\n"

# Write the JavaScript code to the azkar-data.js file
with open("azkar-data.js", "w", encoding="utf-8") as f:
    f.write(js_code)

print("azkar-data.js file created successfully.")

