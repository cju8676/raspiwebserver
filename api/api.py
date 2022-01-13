from flask import Flask, request, jsonify
from flask_restful import Resource, Api
import urllib.parse

from PIL import Image, ExifTags

from db_utils import *
from userApi import *

app = Flask(__name__)
api = Api(app)

@app.route("/")
def home():
    return "<html><body><h1>Flask backend. Visit port 3000 to view front end</h1></body></html>"

@app.route('/files/<path>/<filename>', methods=['GET'])
def getpic(path, filename):
    #decode UTF-8
    path_str = urllib.parse.unquote(path)
    filename_str = urllib.parse.unquote(filename)

    # FIXME ADD for RASPI
    # For windows, assume we know everything is in C:/Users/corey/...
    path_str = 'C:/Users/corey/' + path_str
    # print(image.info)
    return send_from_directory(path_str, filename_str)

@app.route('/info/<path>/<filename>', methods=['GET'])
def getinfo(path, filename):
    path_str = 'C:/Users/corey/' + urllib.parse.unquote(path) + '/' + urllib.parse.unquote(filename)
    image = Image.open(path_str)
    exifdata = dict(image.getexif())
    # for key, val in exifdata.items():
    #     if key in ExifTags.TAGS:
    #         print(key, " : ", ExifTags.TAGS[key], ":", val)
    #TODO get Shot and ISO info added to this
    if len(exifdata) == 0:
        # len wid
        return jsonify([image.size[0], image.size[1]])
    else:
        # len wid make model datetime
        return jsonify([image.size[0], image.size[1], exifdata[271], exifdata[272], exifdata[306]])

api.add_resource(CreateUser, '/createUser/')
api.add_resource(LoginUser, '/login/<string:username>/<string:password>')
api.add_resource(GetImage, '/getImage/<string:filename>')
api.add_resource(GetAllImages, '/getAllImages/')
api.add_resource(AddFavorite, '/addFav/<string:username>/<string:id>')
api.add_resource(DeleteFavorite, '/removeFav/<string:username>/<string:id>')
api.add_resource(GetFavorites, '/getFavorites/<string:username>')
api.add_resource(CreateAlbum, '/createAlbum/<string:username>/<string:album_name>')
api.add_resource(GetAllAlbums, '/getAlbums/<string:username>')
api.add_resource(AddToAlbum, '/addPicToAlbum/')
api.add_resource(GetAlbumPhotos, '/getAlbumPhotos/<string:username>/<string:album_name>')
api.add_resource(DeleteAlbum, '/delAlbum/<string:username>/<string:album_name>')

if __name__ == '__main__':
    print("Starting Flask backend")
    app.run(debug=True)