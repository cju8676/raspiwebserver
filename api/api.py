from flask import Flask, request, jsonify
from flask_restful import Resource, Api
import urllib.parse

from db_utils import *
from userApi import *

app = Flask(__name__)
api = Api(app)

@app.route("/")
def home():
    return "<html><body><h1>Flask backend. Visit port 3000 to view front end</h1></body></html>"

@app.route('/files/<path>/<filename>', methods=['GET'])
def getpic(path, filename):
    #decode UTF-8
    path_str = urllib.parse.unquote(path)
    filename_str = urllib.parse.unquote(filename)

    # FIXME ADD for RASPI
    # For windows, assume we know everything is in C:/Users/corey/...
    path_str = 'C:/Users/corey/' + path_str

    # print("path : " + path_str + "   and   filename : " + filename_str)
    return send_from_directory(path_str, filename_str)

api.add_resource(LoginUser, '/login/<string:username>/<string:password>')
api.add_resource(GetImage, '/getImage/<string:filename>')
api.add_resource(GetAllImages, '/getAllImages/')

if __name__ == '__main__':
    print("Starting Flask backend")
    app.run(debug=True)