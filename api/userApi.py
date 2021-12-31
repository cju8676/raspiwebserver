from flask.helpers import send_from_directory
from flask_restful import Resource
from flask_restful import reqparse
from flask import jsonify

from db_utils import *
import werkzeug

# If you get an error 0 in Flask, try casting list( ) around exec_..._ call

class CreateUser(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('username', type=str)
        parser.add_argument('password', type=str)
        parser.add_argument('name', type=str)
        args = parser.parse_args()

        username = args['username']
        password = hash_password(args['password'])
        name = args['name']
        sql = """
            INSERT INTO users (username, password, name)
            VALUES (%s, %s, %s)
        """
        
        return exec_commit(sql, (username, password, name))

class LoginUser(Resource):
    def get(self, username, password):

        sql = """
            SELECT username, name
            FROM users
            WHERE username = %s and password = %s
        """
        newPass = hash_password(password)
        user = exec_get_one(sql, (username, newPass))
        if user is None:
            return None
        return list(user)

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
        #print(files)
        #print(send_from_directory(files[0][1], files[0][0]))
        #print(send_from_directory(files[1][1], files[1][0]))
        #file = send_from_directory(files[0][1], files[0][0])
        return files