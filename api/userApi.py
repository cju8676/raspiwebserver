from flask_restful import Resource

from db_utils import *

class LoginUser(Resource):
    def get(self, username, password):
        sql = """
            SELECT username FROM users
            WHERE username = %s and password = %s
        """
        user = exec_get_one(sql, (username, password))
        return username