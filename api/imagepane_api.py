from flask.helpers import send_from_directory
from flask_restful import Resource
from flask_restful import reqparse
from flask import jsonify

from db_utils import *
import werkzeug
import json


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
            SELECT name, filepath, id 
            FROM files
        """
        res = exec_get_all(sql, [])
        files_json = []
        for l in res:
            files_json.append(
                {
                    "name": l[0],
                    "path": l[1],
                    "id": l[2]
                })
        return json.dumps(files_json)

class AddFavorite(Resource):
    def post(self, username, id):

        sql = """
            INSERT INTO favorites (username, id)
            VALUES (%s, %s)
        """
        return exec_commit(sql, (username, id))

class DeleteFavorite(Resource):
    def post(self, username, id):
    
        sql = """
            DELETE FROM favorites
            WHERE username = %s AND id = %s
        """
        return exec_commit(sql, (username, id))

class GetFavorites(Resource):
    def get(self, username):
        sql = """
            SELECT f.name, f.filepath, f.id
            FROM files f, favorites s
            WHERE s.username = %s
            AND f.id = s.id;
        """
        res = exec_get_all(sql, [username])
        files_json = []
        for l in res:
            files_json.append(
                {
                    "name": l[0],
                    "path": l[1],
                    "id": l[2]
                })
        return json.dumps(files_json)

class GetMyTags(Resource):
    def get(self, id):
        sql = """
            SELECT name, color
            FROM tags
            WHERE id = %s
            AND people = 0
        """
        return list(exec_get_all(sql, [id]))

class GetMyPeople(Resource):
    def get(self, id):
        sql = """
            SELECT name, color
            FROM tags
            WHERE id = %s
            AND people = 1
        """
        return list(exec_get_all(sql, [id]))

class GetAvailTags(Resource):
    def get(self, id):
        if not id:
            sql = """
                SELECT name, color
                FROM tags
                WHERE id = -1
                AND people = 0
            """
            return list(exec_get_all(sql,()))
        else:    
            sql = """
                SELECT name, color
                FROM tags
                WHERE id = -1
                AND people = 0
                AND name NOT IN
                    (
                        SELECT name
                        FROM tags
                        WHERE id = %s
                    )
            """
            avail_tags = list(exec_get_all(sql, [id]))
            return avail_tags

class GetAvailPeople(Resource):
    def get(self, id):
        if not id:
            sql = """
                SELECT name, color
                FROM tags
                WHERE id = -1
                AND people = 1
            """
            return list(exec_get_all(sql,()))
        else:    
            sql = """
                SELECT name, color
                FROM tags
                WHERE id = -1
                AND people = 1
                AND name NOT IN
                    (
                        SELECT name
                        FROM tags
                        WHERE id = %s
                    )
            """
            avail_tags = list(exec_get_all(sql, [id]))
            return avail_tags


class CreateTag(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('name', type=str)
        parser.add_argument('color', type=str)
        args = parser.parse_args()

        name = args['name']
        color = args['color']

        sql = """
            INSERT into tags (name, color)
            VALUES (%s, %s)
        """
        return exec_commit(sql, (name, color))

class CreatePerson(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('name', type=str)
        parser.add_argument('color', type=str)
        args = parser.parse_args()

        name = args['name']
        color = args['color']

        sql = """
            INSERT into tags (name, color, people)
            VALUES (%s, %s, %s)
        """
        return exec_commit(sql, (name, color, 1))


class AddTag(Resource):
    def post(self, id):
        parser = reqparse.RequestParser()
        parser.add_argument('name', type=str)
        parser.add_argument('color', type=str)
        args = parser.parse_args()

        name = args['name']
        color = args['color']

        sql = """
            INSERT into tags (name, color, id)
            VALUES (%s, %s, %s)
        """
        return exec_commit(sql, (name, color, id))

class DeleteTag(Resource):
    def post(self, id):
        parser = reqparse.RequestParser()
        parser.add_argument('name', type=str)
        parser.add_argument('color', type=str)
        args = parser.parse_args()

        name = args['name']
        color = args['color']

        sql = """
            DELETE FROM tags
            WHERE id = %s
            AND name = %s
            AND color = %s
        """
        return exec_commit(sql, (id, name, color))

class AddPerson(Resource):
    def post(self, id):
        parser = reqparse.RequestParser()
        parser.add_argument('name', type=str)
        parser.add_argument('color', type=str)
        args = parser.parse_args()

        name = args['name']
        color = args['color']

        sql = """
            INSERT into tags (name, color, id, people)
            VALUES (%s, %s, %s, %s)
        """
        return exec_commit(sql, (name, color, id, 1))

class DeletePerson(Resource):
    def post(self, id):
        parser = reqparse.RequestParser()
        parser.add_argument('name', type=str)
        parser.add_argument('color', type=str)
        args = parser.parse_args()

        name = args['name']
        color = args['color']

        sql = """
            DELETE FROM tags
            WHERE id = %s
            AND name = %s
            AND color = %s
            AND people = %s
        """
        return exec_commit(sql, (id, name, color, 1))