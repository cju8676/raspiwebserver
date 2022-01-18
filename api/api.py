from flask import Flask, request, jsonify, redirect, url_for
from flask_restful import Resource, Api
import urllib.parse
from werkzeug.utils import secure_filename

from PIL import Image, ExifTags

from datetime import datetime

from db_utils import *
from userApi import *

UPLOAD_FOLDER='C:/Users/corey/Pictures/dbtest'
ALLOWED_EXTENSIONS = {'jpg', 'jpeg'}

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
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
    for key, val in exifdata.items():
        if key in ExifTags.TAGS:
            print(key, " : ", ExifTags.TAGS[key], ":", val)
    #TODO get Shot and ISO info added to this

    if len(exifdata) == 0:
        # len wid --- --- --- tags
        return jsonify([image.size[0], image.size[1], "---", "---", "---"])
    else:
        #print(datetime.strptime(exifdata[306], '%Y:%m:%d %H:%M:%S').strftime("%B %d, %Y -- %I:%M:%S %p"))
        formatted = datetime.strptime(exifdata[306], '%Y:%m:%d %H:%M:%S').strftime("%B %d, %Y -- %I:%M:%S %p")

        # len wid make model datetime tags
        return jsonify([image.size[0], image.size[1], exifdata[271], exifdata[272], formatted])

def allowed_file(filename):
    return '.' in filename and \
        filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/upload', methods=['POST'])
def fileUploadProfPic():
    target=os.path.join(UPLOAD_FOLDER, datetime.today().strftime("%m-%d-%Y"))
    if not os.path.isdir(target):
        os.mkdir(target)
    file = request.files['file'] 
    filename = secure_filename(file.filename)
    destination="/".join([target, filename])
    print(target)
    print(filename)
    file.save(destination)
    return send_from_directory(target, filename, as_attachment=True)

#FIXME combine with prof pic upload
@app.route('/uploadPic', methods=['POST'])
def fileUpload():
    target=os.path.join(UPLOAD_FOLDER, datetime.today().strftime("%m-%d-%Y"))
    if not os.path.isdir(target):
        os.mkdir(target)
    file = request.files['file'] 
    filename = secure_filename(file.filename)
    destination="/".join([target, filename])
    print(target)
    print(filename)
    file.save(destination)

    sql = """
        INSERT INTO files (name, filepath)
        VALUES (%s, %s)
    """
    return str(exec_commit(sql, (filename, target.replace('C:/Users/corey/', ""))))

    


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
api.add_resource(RemoveFromAlbum, '/removeFromAlbum/')
api.add_resource(GetMyTags, '/getTags/<string:id>')
api.add_resource(GetAvailTags, '/getAvailTags/<string:id>')
api.add_resource(CreateTag, '/createTag/')
api.add_resource(AddTag, '/addTag/<string:id>')
api.add_resource(DeleteTag, '/delTag/<string:id>')
api.add_resource(DeleteAccount, '/delAcc/<string:username>')
api.add_resource(UpdateName, '/updateName/')
api.add_resource(UpdateUsername, '/updateUsername/')

if __name__ == '__main__':
    print("Starting Flask backend")
    app.run(debug=True)