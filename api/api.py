from flask import Flask
from flask_restful import Resource, Api

from db_utils import *
from userApi import *

app = Flask(__name__)
api = Api(app)

@app.route("/")
def home():
    return "<html><body><h1>Flask backend. Visit port 3000 to view front end</h1></body></html>"

api.add_resource(LoginUser, '/login/<string:username>/<string:password>')

if __name__ == '__main__':
    print("Starting Flask backend")
    app.run