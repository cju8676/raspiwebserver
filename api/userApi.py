from flask.helpers import send_file
from flask_restful import Resource

from db_utils import *
import requests

class LoginUser(Resource):
    def get(self, username, password):
        sql = """
            SELECT username FROM users
            WHERE username = %s and password = %s
        """
        user = exec_get_one(sql, (username, password))
        return user

class GetImage(Resource):
    def post(self, filename):
        #takes in name, get the file path from sql call
        sql = """
            SELECT filepath FROM files
            WHERE name = %s
        """
        path = exec_get_one(sql, (filename))
        return send_file(path, mimetype='image/jpg')