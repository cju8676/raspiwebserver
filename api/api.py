from flask import Flask, request, jsonify, redirect, url_for
from flask_restful import Resource, Api
import urllib.parse
from werkzeug.utils import secure_filename
import imghdr
from pprint import pprint
from PIL import Image, ExifTags, GifImagePlugin
# from tinytag import TinyTag
from datetime import datetime

from db_utils import *
from user_api import *
from album_api import *
from imagepane_api import *
from utils import *
import json
import subprocess

#todo change for raspi integration
UPLOAD_FOLDER='C:/Users/corey/Pictures/dbtest'
CONVERSIONS_FOLDER='C:/Users/corey/Pictures/dbconversions'
ROOT_DIR = 'C://Users/corey/'
# assumes we are in ROOT_DIR
FFMPEG_DIR = '../../FFmpeg/bin/ffmpeg'

ALLOWED_EXTENSIONS = {'jpg', 'jpeg'}

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
api = Api(app)

@app.route("/")
def home():
    return "<html><body><h1>Flask backend. Visit port 3000 to view front end</h1></body></html>"

@app.route('/files/<id>', methods=['GET'])
def getpic(id):
    #decode UTF-8
    sql = """
        SELECT name, filepath
        FROM files
        WHERE id = %s;
    """
    res = exec_get_one(sql, (id, ))
    filename_str = res[0]
    path_str = res[1]
    # path_str = urllib.parse.unquote(path)
    # filename_str = urllib.parse.unquote(filename)

    # FIXME ADD for RASPI
    # For windows, assume we know everything is in C:/Users/corey/...
    path_str = 'C:/Users/corey/' + path_str
    # print(image.info)
    return send_from_directory(path_str, filename_str)

@app.route('/info/<path>/<filename>/<username>', methods=['GET'])
def getinfo(path, filename, username):
    file_name = urllib.parse.unquote(filename)
    directory = 'C:/Users/corey/' + urllib.parse.unquote(path) + '/'
    path_str = 'C:/Users/corey/' + urllib.parse.unquote(path) + '/' + file_name
    print(file_name[file_name.find('.'):])

    # if the file is a photo, gather photo info
    if(imghdr.what(path_str) is not None):

        image = Image.open(path_str)
        exif = None
        if(isinstance(image, GifImagePlugin.GifImageFile)):
            exifdata = {}
        else: 
            exif = image._getexif()
        if exif is not None:
            exifdata = dict(exif)
        else:
            exifdata = {}
        for key, val in exifdata.items():
            if key in ExifTags.TAGS:
                #int(key, " : ", ExifTags.TAGS[key], ":", val)
                name = ExifTags.TAGS.get(key, key)
                exif[name] = val
        # print(exifdata['34853'])
        # print(exif.keys())
        gps_coords = []
        if exif is not None and 'GPSInfo' in exif.keys():
            gps_coords = get_coords(exif)
        
        # check if img is already faved
        sql = """
            SELECT COUNT(1)
            FROM favorites
            WHERE username = %s
            AND id IN (
                SELECT id
                FROM files
                WHERE name = %s
                AND filepath = %s
            )
        """
        is_favorited = exec_get_one(sql, (username, urllib.parse.unquote(filename), urllib.parse.unquote(path)))[0]
        gps_json = None
        if len(gps_coords) != 0:
            gps_json = {
                    "lat" : gps_coords[0],
                    "long" : gps_coords[1]
                }

        if len(exifdata) == 0:
            # len wid --- --- --- tags
            # return jsonify([image.size[0], image.size[1], "---", "---", "---", is_favorited, gps_coords])
            return json.dumps({
                "len" : image.size[0],
                "wid" : image.size[1],
                "make" : "---",
                "model" : "---",
                "date" : "---",
                "isFavorited" : is_favorited,
                "gps" : gps_json
            })
        else:
            #print(datetime.strptime(exifdata[306], '%Y:%m:%d %H:%M:%S').strftime("%B %d, %Y -- %I:%M:%S %p"))
            if exifdata.get(306, "---") == "---":
                formatted = "---"
            else:
                formatted = datetime.strptime(exifdata.get(306, "---"), '%Y:%m:%d %H:%M:%S').strftime("%B %d, %Y -- %I:%M:%S %p")
            make = exifdata.get(271, "---")
            model = exifdata.get(272, "---")


            # len wid make model datetime tags
            # return jsonify([image.size[0], image.size[1], make, model, formatted, is_favorited, gps_coords])
            return json.dumps({
                "len" : image.size[0],
                "wid" : image.size[1],
                "make" : make,
                "model" : model,
                "date" : formatted,
                "isFavorited" : is_favorited,
                "gps" : gps_json
            })
    
    # otherwise gather video info
    else:
        # video = TinyTag.get(path_str)
        # print(video)
        # print(video.year)
        print(os.stat(path_str))
        print(datetime.fromtimestamp(os.path.getatime(path_str)).strftime('%Y-%m-%d %H:%M:%S'))
        # return jsonify(["---", "---", "---", "---", "---", None, []])
        return json.dumps({
                "len" : "---",
                "wid" :  "---",
                "make" : "---",
                "model" : "---",
                "date" : "---",
                "isFavorited" : None,
                "gps" : None
            })


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
    # print(target)
    # print(filename)
    file.save(destination)
    return send_from_directory(target, filename, as_attachment=True)

#FIXME combine with prof pic upload
@app.route('/uploadPic', methods=['POST'])
def fileUpload():
    target=os.path.join(UPLOAD_FOLDER, datetime.today().strftime("%m-%d-%Y"))
    if not os.path.isdir(target):
        os.mkdir(target)
    file = request.files['file']
    print("=--------" + file.content_type)
    if "/" in file.filename:
        idx = file.filename.find('/')
        target=os.path.join(target, file.filename[0:idx])
        if not os.path.isdir(target):
            os.mkdir(target)
        filename = secure_filename(file.filename[idx:])
    else:
        filename = secure_filename(file.filename)
    destination="/".join([target, filename])
    # print(target)
    # print(filename)
    file.save(destination)
    file_location = target + '/' + filename
    if(file.content_type[0:5] == 'image'):
        exif = Image.open(file_location)
        if(isinstance(exif, GifImagePlugin.GifImageFile)):
            exifdata = None
        else:
            exifdata = exif._getexif()
    elif(file.content_type[0:5] == 'video'):
        #todo extract date info from vid
        exifdata = None
    else:
        print("Unrecognized file type : " + file.content_type)
        print("File was still saved.")
        exifdata = None

    if exifdata is None:
        date = datetime.today()
    else:
        dict_exif = dict(exifdata)
        date = datetime.strptime(dict_exif.get(306, datetime.today().strftime('%Y:%m:%d %H:%M:%S')), '%Y:%m:%d %H:%M:%S')
    # Save file to db
    sql = """
        INSERT INTO files (name, filepath, date)
        VALUES (%s, %s, %s)
    """
    exec_commit(sql, (filename, target.replace('C:/Users/corey/', ""), date))
    # Get created tags at idx -2 and transfer them to our new file's id and delete them from -2 idx
    sql_id = """
        SELECT id FROM files WHERE name = %s AND filepath = %s;
    """
    id = exec_get_one(sql_id, (filename, target.replace('C:/Users/corey/', "")))

    sql_tags = """
        INSERT INTO tags (name, id, color, people)
        SELECT name, %s, color, people
        FROM tags
        WHERE id = -2;
    """
    return str(exec_commit(sql_tags, (id)))

@app.route('/convertToMP4/<movPath>/<filename>', methods=['GET'])
def convert(movPath, filename):
    print(movPath)
    print(filename)
    #DBCONVERSIONS SAVE TO AND THEN PULL FROM WHEN WE GETALLIMAGES

    # insert into files db conversions
    sql = """
        INSERT INTO files (name, filepath)
        VALUES (%s, %s)
    """
    exec_commit(sql, (filename + '.mp4', "Pictures/dbconversions"))

    os.chdir(ROOT_DIR)
    subprocess.call([FFMPEG_DIR, '-y', '-i', 'Downloads/'+ movPath +'/'+filename + '.mov', '-vcodec', 'h264', '-acodec', 'mp2', 'Pictures/dbconversions/' + filename + '.mp4'])
    # return the file to use in place of the original MOV
    return send_from_directory(ROOT_DIR + "Pictures/dbconversions", filename  + ".mp4")

api.add_resource(CreateUser, '/createUser/')
api.add_resource(LoginUser, '/login/<string:username>/<string:password>')
api.add_resource(GetImage, '/getImage/<string:filename>')
api.add_resource(GetAllImages, '/getAllImages/')
api.add_resource(AddFavorite, '/addFav/<string:username>/<string:id>')
api.add_resource(DeleteFavorite, '/removeFav/<string:username>/<string:id>')
api.add_resource(GetFavorites, '/getFavorites/<string:username>')
api.add_resource(GetFavoriteIDs, '/getFavoriteIDs/<string:username>')
api.add_resource(CreateAlbum, '/createAlbum/<string:username>/<string:album_name>')
api.add_resource(GetAllAlbums, '/getAlbums/<string:username>')
api.add_resource(AddToAlbum, '/addPicToAlbum/')
api.add_resource(GetAlbumPhotos, '/getAlbumPhotos/<string:username>/<string:album_name>')
api.add_resource(DeleteAlbum, '/delAlbum/<string:username>/<string:album_name>')
api.add_resource(RemoveFromAlbum, '/removeFromAlbum/')
api.add_resource(GetMyTags, '/getTags/<string:id>')
api.add_resource(GetMyPeople, '/getPeople/<string:id>')
api.add_resource(GetAvailTags, '/getAvailTags/<string:id>')
api.add_resource(GetAvailPeople, '/getAvailPeople/<string:id>')
api.add_resource(CreateTag, '/createTag/')
api.add_resource(AddTag, '/addTag/<string:id>')
api.add_resource(DeleteTag, '/delTag/<string:id>')
api.add_resource(CreatePerson, '/createPerson/')
api.add_resource(AddPerson, '/addPerson/<string:id>')
api.add_resource(DeletePerson, '/delPerson/<string:id>')
api.add_resource(DeleteAccount, '/delAcc/<string:username>')
api.add_resource(UpdateName, '/updateName/')
api.add_resource(UpdateUsername, '/updateUsername/')
api.add_resource(UpdatePassword, '/updatePassword/')
api.add_resource(UpdateTag, '/updateTag/')
api.add_resource(DeleteImage, '/deleteImage/<string:id>/<string:path>/<string:name>')
api.add_resource(GetImageAlbums, '/getImageAlbums/<string:id>/<string:user>')
api.add_resource(DeleteUploadTags, '/deleteUploadTags/')
api.add_resource(GetEditTags, '/getEditTags/<string:username>')
api.add_resource(GetEditPeople, '/getEditPeople/<string:username>')
api.add_resource(DeleteTagOverall, '/deleteTagOverall/<string:name>/<string:color>')
api.add_resource(DeletePersonOverall, '/deletePersonOverall/<string:name>/<string:color>')
api.add_resource(AddUserToAlbum, '/shareAlbum/<string:album_name>/<string:new_user>')
api.add_resource(DeleteUserFromAlbum, '/delUserFromAlbum/<string:album_name>/<string:del_user>')
api.add_resource(GetAllTags, '/getAllTags/')
api.add_resource(GetShareData, '/getShareData/<string:album_name>/<string:user>')

if __name__ == '__main__':
    print("Starting Flask backend")
    app.run(debug=True)