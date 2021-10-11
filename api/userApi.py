from flask.helpers import send_from_directory
from flask_restful import Resource

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