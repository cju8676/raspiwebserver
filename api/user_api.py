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




class DeleteAccount(Resource):
    def post(self, username):
        sql = """
            DELETE from albums
            WHERE username = %s;

            DELETE from favorites
            WHERE username = %s;

            DELETE from users
            WHERE username = %s;
        """
        return exec_commit(sql, (username, username, username))

class UpdateName(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('username', type=str)
        parser.add_argument('new_name', type=str)
        args = parser.parse_args()
        username = args['username']
        new_name = args['new_name']

        sql = """
            UPDATE users
            SET name = %s
            WHERE username = %s;
        """
        return exec_commit(sql, (new_name, username))

class UpdateUsername(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('username', type=str)
        parser.add_argument('new_username', type=str)
        args = parser.parse_args()

        username = args['username']
        new_username = args['new_username']
        sql = """
            UPDATE users
            SET username = %s
            WHERE username = %s;
        """
        return exec_commit(sql, (new_username, username))

class UpdatePassword(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('username', type=str)
        parser.add_argument('new_name', type=str)
        args = parser.parse_args()

        username = args['username']
        new_pass = hash_password(args['new_name'])
        sql = """
            UPDATE users
            SET password = %s
            WHERE username = %s;
        """
        return exec_commit(sql, (new_pass, username))

class DeleteImage(Resource):
    def post(self, id):
        sql = """
            DELETE from albums
            WHERE id = %s;

            DELETE from favorites
            WHERE id = %s;

            DELETE from tags
            WHERE id = %s;

            DELETE from files
            WHERE id = %s;
        """
        return exec_commit(sql, (id, id, id, id))
