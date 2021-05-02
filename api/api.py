import time
import requests
from flask import Flask

app = Flask(__name__)

@app.route('/locations')
def get_locations():
    print('locations')
    response = requests.get('http://open-api.myhelsinki.fi/v1/places/')
    return { 'data': response.json() }
