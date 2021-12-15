from flask.helpers import send_from_directory
from flask_restful import Resource
from flask import jsonify

from db_utils import *
import werkzeug


class LoginUser(Resource):
    def get(self, username, password):
        sql = """
            SELECT username FROM users
            WHERE username = %s and password = %s
        """
        user = exec_get_one(sql, (username, password))
        return user

class GetImage(Resource):
    def get(self, filename):
        #takes in name, get the file path from sql call
        sql = """
            SELECT filepath FROM files
            WHERE name = %s
        """
        path = exec_get_one(sql, (filename,))
        return send_from_directory(path[0], filename, as_attachment=True)

class GetAllImages(Resource):
    def get(self):
        
        sql = """
            SELECT name, filepath 
            FROM files
        """
        files = list(exec_get_all(sql, []))
        #pics = []
        #for namepath in files:
        #    pics.append(send_from_directory(namepath[1], namepath[0], as_attachment=True))
        #print(pics)
        #return jsonify(pics)
        return send_from_directory(files[0][1], files[0][0], as_attachment=True)