from PIL import Image, ExifTags
# Utilities for the flask api

# extract and calculate latitude and longitude from exif data
# return [latitude, longitude]
def get_coords(exif):
    gps = {}
    # extract GPS info data from main exif info dictionary
    for key in exif['GPSInfo'].keys():
        name = ExifTags.GPSTAGS.get(key,key)
        gps[name] = exif['GPSInfo'][key]
    
    if 'GPSLatitude' not in gps or 'GPSLongitude' not in gps:
        return []
    # GPSLat and GPSLong is formatted as (degrees, minutes, seconds)
    # Decimal Degrees = degrees + (minutes/60) + (seconds/3600)
    decimal_lat =float( gps['GPSLatitude'][0] + ((gps['GPSLatitude'][1])/60) + ((gps['GPSLatitude'][2])/3600))

    # invert if latitude south
    if (gps['GPSLatitudeRef'] == 'S') :
        decimal_lat = decimal_lat * -1

    # Decimal Degrees = degrees + (minutes/60) + (seconds/3600)
    decimal_long =float( gps['GPSLongitude'][0] + ((gps['GPSLongitude'][1])/60) + ((gps['GPSLongitude'][2])/3600))

    # invert if longitude west
    if (gps['GPSLongitudeRef'] == 'W') :
        decimal_long = decimal_long * -1
    
    return [decimal_lat, decimal_long]