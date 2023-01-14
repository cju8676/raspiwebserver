from genericpath import exists
from flask import Flask, request, jsonify, redirect, url_for, send_file
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
from moviepy.video.io.VideoFileClip import VideoFileClip
import json
import subprocess
import ffmpeg
from iso6709 import Location
import re
import os
import time
from io import BytesIO

#todo change for raspi integration
UPLOAD_FOLDER='C:/Users/corey/Pictures/dbtest'
CONVERSIONS_FOLDER='C:/Users/corey/Pictures/dbconversions'
# ROOT_DIR = 'C:/Users/corey/'
ROOT_DIR = 'E:/'
# ROOT_DIR = '/media/pi/Elements SE/'
# assumes we are in ROOT_DIR
FFMPEG_DIR = '../../FFmpeg/bin/ffmpeg'

ALLOWED_EXTENSIONS = {'jpg', 'jpeg'}
VIDEO_EXTENSIONS = ['mov', 'mp4']

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
api = Api(app)

@app.route("/")
def home():
    return "<html><body><h1>Flask backend. Visit port 3000 to view front end</h1></body></html>"

def serve_pil_image(pil_img):
    img_io = BytesIO()
    pil_img.save(img_io, 'JPEG', quality=70)
    img_io.seek(0)
    return send_file(img_io, mimetype='image/jpeg')

@app.route('/files/<path:path>/<name>', methods=['GET'])
def getpic(path, name):
    name_str = urllib.parse.unquote(name)
    path_str = urllib.parse.unquote(path)
    
    # if video, get a thumbnail instead of loading the whole thing first
    if name_str.rsplit('.', 1)[1].lower() in VIDEO_EXTENSIONS:
        clips = VideoFileClip(os.path.join(ROOT_DIR + '/' + path_str, name_str))
        frame = clips.get_frame(0)
        thumb = Image.fromarray(frame)
        return serve_pil_image(thumb)


    path_str = ROOT_DIR + path_str
    # print(image.info)
    return send_from_directory(path_str, name_str)

@app.route('/videofile/<path:path>/<name>', methods=['GET'])
def getvidfile(path, name):
    name_str = urllib.parse.unquote(name)
    path_str = urllib.parse.unquote(path)
    path_str = ROOT_DIR + path_str
    return send_from_directory(path_str, name_str)

@app.route('/info/<path>/<filename>/<username>', methods=['GET'])
def getinfo(path, filename, username):
    file_name = urllib.parse.unquote(filename)
    directory = ROOT_DIR + urllib.parse.unquote(path) + '/'
    path_str = ROOT_DIR + urllib.parse.unquote(path) + '/' + file_name
    # print(file_name[file_name.find('.'):])
    if (exists(path_str) is False):
        print("WARNING: ", path_str, " does not exist!")
        return "False"
    # if the file is a photo, gather photo info
    elif(imghdr.what(path_str) is not None):

        image = Image.open(path_str)
        exif = None
        if(isinstance(image, GifImagePlugin.GifImageFile)):
            exifdata = {}
        else: 
            exif = image._getexif()
            # print("----EXIF----")
            # print(exif)
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
        print("gps json", gps_json)
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
        data = ffmpeg.probe(path_str)
        streams = data['streams'][0]
        vid_len = streams['height']
        vid_wid = streams['width']
        format_tags = data['format']['tags']
        tag_keys = dict(format_tags).keys()
        make_key = ''
        model_key = ''
        loc_key = ''
        for key in tag_keys:
            if 'make' in key:
                make_key = key
            elif 'model' in key:
                model_key = key
            elif 'location' in key:
                loc_key = key
        
        gps_json = None
        if loc_key != '':
            loc_string = format_tags[loc_key]
            loc = Location(loc_string)
            # don't think this parses longitude negative correctly
            # whichever format we will see a +/- for lat and long
            lat_long_signs = re.findall(r"[+-]", loc_string)
            lat_sign = 1 if lat_long_signs[0] == '+' else -1 
            long_sign = 1 if lat_long_signs[1] == '+' else -1 
            gps_json = {
                "lat" : str(loc.lat.degrees * lat_sign),
                "long": str(loc.lng.degrees * long_sign)
            }
        # video = TinyTag.get(path_str)
        # print(video)
        # print(video.year)
        # print(os.stat(path_str))
        # print(datetime.fromtimestamp(os.path.getatime(path_str)).strftime('%Y-%m-%d %H:%M:%S'))
        # return jsonify(["---", "---", "---", "---", "---", None, []])
        return json.dumps({
                "len" : vid_len,
                "wid" :  vid_wid,
                "make" : format_tags[make_key],
                "model" : format_tags[model_key],
                "date" : streams['tags']['creation_time'],
                "isFavorited" : None,
                "gps" : gps_json
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

def save_file(request, ):
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
    file.save(destination)
    return target, filename, destination

@app.route('/uploadPic/<tag>', methods=['POST'])
def fileUpload(tag):
    file = request.files['file']
    print("tag ", tag)
    target, filename, destination = save_file(request)

    file_location = target + '/' + filename
    if(file.content_type[0:5] == 'image'):
        exif = Image.open(file_location)
        if(isinstance(exif, GifImagePlugin.GifImageFile)):
            exifdata = None
        else:
            exifdata = exif._getexif()
    elif(file.content_type[0:5] == 'video'):
        exifdata = None
        vid = ffmpeg.probe(file_location)
        dicts = vid['streams'][0]
        creation_time = dicts['tags']['creation_time']

    else:
        print("Unrecognized file type : " + file.content_type)
        print("File was still saved.")
        exifdata = None

    if creation_time is not None:
        date = datetime.strptime(creation_time, '%Y-%m-%dT%H:%M:%S.%fZ')
    elif exifdata is None:
        date = datetime.today()
    else:
        dict_exif = dict(exifdata)
        date = datetime.strptime( \
            dict_exif.get(306,  \
            dict_exif.get(36867, \
            dict_exif.get(36868, \
            datetime.today().strftime('%Y:%m:%d %H:%M:%S')))), '%Y:%m:%d %H:%M:%S')
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
        WHERE id = %s;
    """
    return str(exec_commit(sql_tags, (id, tag)))



# add database instances for files in folders already locally stored
# how to use:
# - path = copy encodeURIComponent(path after E:/)
# - navigate to 192.168.0.208:5000/filesToDB/path
# - first test it does not break with specified folder
# - then uncomment and do SQL calls
@app.route('/filesToDB/<path:path>', methods=['GET', 'POST'])
def post_files(path):
    print("getting here", path)
    # get all files to path
    files = os.listdir(ROOT_DIR + path)
    print(files)
    # list of tuples that will be ran through and added to
    files_info = []
    for file in files:
        path_str = ROOT_DIR + path + '/' + file
        # skip directories
        if os.path.isdir(path_str):
            continue
        # if its photo get date the photo way
        if (imghdr.what(path_str) is not None):
            exif = Image.open(path_str)._getexif()
            if exif:
                dict_exif = dict(exif)
                date = dict_exif.get(306, \
                    dict_exif.get(36867, \
                    dict_exif.get(36868, \
                    datetime.fromtimestamp(os.path.getmtime(path_str)))))
                #date = Image.open(path_str)._getexif()[36867]
                if isinstance(date, str):
                    date = datetime.strptime(date, '%Y:%m:%d %H:%M:%S')
            # if no exif data use getmtime()
            else:
                date = time.ctime(os.path.getmtime(path_str))
        # otherwise get the video way
        else:
            ext = file.split('.')
            supported = ['mov', 'mp4']
            if ext[1].lower() not in supported:
                continue
            data = ffmpeg.probe(path_str)
            streams = data['streams'][0]
            date = streams['tags']['creation_time']
            date = datetime.strptime(date, '%Y-%m-%dT%H:%M:%S.%fZ')
        
        print("date for", file, " is ", date)
        files_info.append((file, date))
    
    #print(files_info)
    for tup in files_info:
        # for all valid files, save file to db
        sql = """
            INSERT INTO files (name, filepath, date)
            VALUES (%s, %s, %s)
        """
        exec_commit(sql, (tup[0], path, tup[1]))

    return "Success"

@app.route('/convertToMP4/', methods=['POST'])
def convert():
    target, filename, destination = save_file(request)

    extension_idx = filename.find('.')
    filename_wo_ext = filename[0:extension_idx]

    # insert into files db conversions
    sql = """
        INSERT INTO files (name, filepath)
        VALUES (%s, %s)
    """
    exec_commit(sql, (filename_wo_ext + '.mp4', "Pictures/dbconversions"))

    # convert saved mov to mp4
    os.chdir(ROOT_DIR)
    subprocess.call([FFMPEG_DIR, '-y', '-i', destination, '-vcodec', 'h264', '-acodec', 'mp2', 'Pictures/dbconversions/' + filename_wo_ext + '.mp4'])
    # return the file to use in place of the original MOV
    return send_from_directory(ROOT_DIR + "Pictures/dbconversions", filename_wo_ext + '.mp4')

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
api.add_resource(DeleteUploadTag, '/deleteUploadTag/<string:tag>')

if __name__ == '__main__':
    print("Starting Flask backend")
    app.run(debug=True)