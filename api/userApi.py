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
            SELECT name, filepath, id 
            FROM files
        """
        files = list(exec_get_all(sql, []))
        #print(files)
        #print(send_from_directory(files[0][1], files[0][0]))
        #print(send_from_directory(files[1][1], files[1][0]))
        #file = send_from_directory(files[0][1], files[0][0])
        return files

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
        return list(exec_get_all(sql, [username]))

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

class GetTags(Resource):
    def get(self, id):
        sql = """
            SELECT name, color
            FROM tags
            WHERE id = %s;
        """
        return list(exec_get_all(sql, [id]))

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