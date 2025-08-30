import json

# قراءة الملف الجديد
with open('assets/data/adhkar_new.json', 'r', encoding='utf-8') as f:
    new_data = json.load(f)

# تحويل البيانات إلى تنسيق JavaScript
js_content = 'const azkarData = {\n'

for category in new_data:
    category_name = category['category']
    js_content += f'    "{category_name}": [\n'
    
    for item in category['array']:
        text = item['text'].replace('"', '\\"').replace('\n', '\\n')
        js_content += '        {\n'
        js_content += f'            "id": {item["id"]},\n'
        js_content += f'            "category": "{category_name}",\n'
        js_content += f'            "count": "{item["count"]}",\n'
        js_content += f'            "description": "",\n'
        js_content += f'            "reference": "",\n'
        js_content += f'            "zekr": "{text}"\n'
        js_content += '        },\n'
    
    js_content += '    ],\n'

js_content += '};\n\n'
js_content += 'if (typeof module !== "undefined" && module.exports) {\n'
js_content += '    module.exports = azkarData;\n'
js_content += '}\n'

# كتابة الملف الجديد
with open('assets/js/azkar-data.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

print('تم تحديث ملف azkar-data.js بنجاح')
