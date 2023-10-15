from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import json
from database import consultar

app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/save-json', methods=['POST'])
def save_json():
    pixel_map = request.get_json()

    pixel_map_json = json.dumps(pixel_map)

    try:
        consultar('INSERT INTO treino (dados, numero) VALUES (%s, %s);', [pixel_map_json, pixel_map['output']])
    except:
        return jsonify(False)

    return jsonify(True)

@app.route('/count', methods=['GET'])
def count():
    data = {numero['numero']: numero['COUNT(*)'] for numero in consultar('SELECT numero, COUNT(*) FROM treino GROUP BY numero;')}

    return jsonify(list({index: (data[index] if index in data else 0) for index in range(10)}.values()))

@app.route('/get-data', methods=['GET'])
def get_data():
    result = list(json.loads(item['dados']) for item in consultar('SELECT dados FROM treino;'))
    for item in result:
        number = item['output']
        item['output'] = [1 if n == number else 0 for n in range(10)]
    return jsonify(result)

app.run(host='0.0.0.0', port=80)
