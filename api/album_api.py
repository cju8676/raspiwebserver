from flask.helpers import send_from_directory
from flask_restful import Resource
from flask_restful import reqparse
from flask import jsonify

from db_utils import *
import werkzeug
import json


class CreateAlbum(Resource):
    def post(self, username, album_name):
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
            SELECT id, username
            FROM albums
            WHERE album_name = %s
            AND id <> -1;
        """
        res = exec_get_all(sql, [album_name])
        return res

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

class GetShareData(Resource):
    def get(self, album_name, user):
        
        avail_sql = """
            SELECT username, name
            FROM users
            WHERE username NOT IN
            (
                SELECT username
                FROM albums
                WHERE album_name = %s
            );
        """
        avail_res = exec_get_all(avail_sql, [album_name,])

        share_sql = """
            SELECT u.username, u.name
            FROM albums a, users u
            WHERE a.album_name = %s
            AND a.username <> %s
            AND a.username = u.username
            AND a.id = -1
        """
        share_res = exec_get_all(share_sql, [album_name, user])

        owner_sql = """
            SELECT owner
            FROM albums
            WHERE album_name = %s
            AND username = %s
        """
        owner_res = exec_get_one(owner_sql, [album_name, user])

        
        json = {
            "availShareUsers" : avail_res,
            "sharedWith" : share_res,
            "owner" : owner_res[0]
        }

        return json

class AddUserToAlbum(Resource):
    def post(self, album_name, new_user):
        sql = """
            INSERT INTO albums (username, album_name, id)
            VALUES (%s, %s, -1)
        """
        return exec_commit(sql, [new_user, album_name])

class DeleteUserFromAlbum(Resource):
    def post(self, album_name, del_user):
        sql = """
            DELETE FROM albums
            WHERE username = %s
            AND album_name = %s
        """
        return exec_commit(sql, [del_user, album_name])