from flask.helpers import send_from_directory
from flask_restful import Resource
from flask_restful import reqparse
from flask import jsonify

from db_utils import *
import werkzeug


class CreateAlbum(Resource):
    def post(self, username, album_name):
        # parser = reqparse.RequestParser()
        # parser.add_argument('username', type=str)
        # parser.add_argument('album_name', type=str)
        # args = parser.parse_args()

        # username = args['username']
        # album_name = args['album_name']

        print(username, "         ", album_name)
        sql = """
            INSERT INTO albums (username, album_name)
            VALUES (%s, %s)
        """ 
        return exec_commit(sql, (username, album_name))

class GetAllAlbums(Resource):
    def get(self, username):
        sql = """
            SELECT album_name
            FROM albums
            WHERE username = %s
            AND id = -1;
        """
        return list(exec_get_all(sql, [username]))

class AddToAlbum(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('username', type=str)
        parser.add_argument('album_name', type=str)
        parser.add_argument('id', type=str)
        args = parser.parse_args()

        username = args['username']
        album_name = args['album_name']
        id = args['id']
        
        sql = """
            INSERT INTO albums (username, album_name, id)
            VALUES (%s, %s, %s)
        """
        return exec_commit(sql, (username, album_name, id))

class GetAlbumPhotos(Resource):
    def get(self, username, album_name):
        
        sql = """
            SELECT f.name, f.filepath, f.id 
            FROM files f, albums a
            WHERE f.id = a.id
            AND a.username = %s
            AND a.album_name = %s;
        """
        files = list(exec_get_all(sql, [username, album_name]))
        return files

class DeleteAlbum(Resource):
    def post(self, username, album_name):
        sql = """
            DELETE FROM albums
            WHERE username = %s AND album_name = %s;
        """
        return exec_commit(sql, (username, album_name))

class RemoveFromAlbum(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('username', type=str)
        parser.add_argument('album_name', type=str)
        parser.add_argument('id', type=str)
        args = parser.parse_args()

        username = args['username']
        album_name = args['album_name']
        id = args['id']
        
        sql = """
            DELETE FROM albums
            WHERE username = %s
            AND album_name = %s
            AND id = %s
        """
        return exec_commit(sql, (username, album_name, id))