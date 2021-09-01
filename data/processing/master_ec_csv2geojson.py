import csv
import os
import glob
import re
import json
import dateparser
import random
import datetime
from calendar import monthrange
import pickle
import os.path
#from bng_to_latlon import OSGB36toWGS84
from geopy.geocoders import Nominatim
geolocator = Nominatim(user_agent="uos-bl-spare-rib-map-3")

DATE_FORMAT = "%Y-%m-%d"


outcodes = {}
places = {}
listing_categories = {}
def load_outcodes() :
    global outcodes
    with open("../geo/postcode-outcodes.csv") as csvfile:
        reader = csv.reader(csvfile)
        next(reader)
        for row in reader:
            lat, lng = float(row[2]), float(row[3])
            if lat != 0 and lng != 0:
                outcodes[row[1]] = {
                    "lat" : lat,
                    "lng" : lng
                }
    # print(outcodes)

pc_pattern = re.compile('[A-Z]{1,2}[0-9]{1,2}')

def get_postcode(data):
    match = pc_pattern.search(data)
    return match


#uk_box = [-11.53,49.79,2.82,61.17]
uk_box = [-11.18,49.14,1.88,61.03]

def outside_uk(coords) :

    if coords['lat'] < uk_box[1] or coords['lat'] > uk_box[3] or coords['lng'] < uk_box[0] or coords['lng'] > uk_box[2]:
        print(coords)
        return True
    else:
        return False

def query_nominatim(data):

    coords = False
    if data in cache:
        print("cached")
        coords = cache[data]
    else :
        print("query nominatim")
        try :
            location = geolocator.geocode(data)
            if location:
                coords = { 'lat' : location.latitude, 'lng' : location.longitude}
            else :
                cache[data] = None
                with open("geo-cache", "wb") as geo_cache:
                    pickle.dump(cache, geo_cache)
        except :
            print("nominatim error")

    if coords:
        cache[data] = coords
        with open("geo-cache", "wb") as geo_cache:
            pickle.dump(cache, geo_cache)


    if data == "Dublin":
        print(coords)
    return coords

def query_postcodes(data):

    pc_match = get_postcode(data)
    coords = False
    if(pc_match) :
        pc = pc_match.group(0)
        data = pc
        try :
            coords = outcodes[pc]
        except KeyError:
            pass
        #print(coords)
    return (coords, data)


def init_geo_cache():

    global cache
    if os.path.isfile("geo-cache") :
        with open("geo-cache", "rb") as geo_cache:
            cache = pickle.load(geo_cache)
    else :
        cache = {}



def get_lat_lng(data):

    coords = False
    if not data.lower().startswith("none") :

        try :
            coords = query_nominatim(data)
            if not coords or outside_uk(coords):
                print("outsiteUK" + data)
                coords = query_nominatim(data + ", United Kingdom")

        except KeyError:
            #print(data)
            pass

    return (coords, data)


issue_pattern = re.compile(r"(?:SR)?\s?(\d+).*?(\w+ \d{4})")
def process_listings_csv(file_path) :
    id = 0
    features = []

    str_ids = {}

    init_geo_cache()

    with open(file_path) as csvfile:
        reader = csv.reader(csvfile)
        headers = next(reader)
        h = dict(zip(headers, range(len(headers))))
        for row in reader:
            if not row[h['Postcode']] and not row[h['Location']] :
                continue
            (loc, match) = query_postcodes(row[h['Postcode']].strip())
            loc_str = match
            if not loc :
                (loc, match) = get_lat_lng(row[h['Location']].strip())
                loc_str = row[h['Location']]
            elif h['Location']:
                loc_str += " " + row[h['Location']]


            #if row[h['Title']].strip() == "Conference on Lesbianism":
            #    print(row)

            if loc:
                match = issue_pattern.match(row[h['Issue']])
                if match:

                    issue_no = match.group(1)
                    date_str = match.group(2)

                    print(issue_no)
                    print(date_str)

                    date = dateparser.parse(date_str)
                    start = datetime.date(date.year, 1, 1)
                    end = datetime.date(date.year, 12, 31)
                    title = row[h['Title']].strip()
                    theme = expand_themes(row[h['Theme']])
                    desc = row[h['Description']].strip()
                    issue = issue_no
                    page = row[h['Page']].strip()
                    author = row[h['Author']].strip()
                    type = row[h['Type']].strip()
                    categories = []
                    try :
                        categories.append(row[h['Cat 1']].strip())
                    except IndexError:
                        pass
                    try :
                        categories.append(row[h['Cat 2']].strip())
                    except IndexError:
                        pass
                    try :
                        categories.append(row[h['Cat 3']].strip())
                    except IndexError:
                        pass
                    try :
                        categories.append(row[h['Cat 4']].strip())
                    except IndexError:
                        pass


                    #try :
                    #    categories = listing_categories[listing]
                    #except KeyError:
                    #    print("%s not found" % listing)
                    #    categories = ["X"]

                    #r1 = random.randint(-10,10) * 0.01
                    #r2 = random.randint(-10,10) * 0.01
                    # print(r1)

                    str_id = title if title else theme

                    str_id += " " + date.strftime("%Y %b") + " " + loc_str

                    if(str_id in str_ids) :
                        str_ids[str_id].append(str_id)
                        str_id += " #" + str(len(str_ids[str_id]))

                    else :
                        str_ids[str_id] = [str_id]


                    data = {
                        "title" : title,
                        "theme" : theme,
                        "desc" : desc,
                        "type" : type,
                        "issue" : issue,
                        "page" : page,
                        "location" : loc_str,
                        "categories" : categories,
                        "str_id" : str_id
                    }
                    feature = {
                        "type": "Feature",
                        "properties" : {
                            "id" : id,
                            "date" : date.strftime(DATE_FORMAT),
                            "start" : start.strftime(DATE_FORMAT),
                            "end" : end.strftime(DATE_FORMAT),
                            "data" : data
                        },
                        "geometry" : {
                            "type" : "Point",
                            #"coordinates" : [float(loc["lng"])+r1, float(loc["lat"])+r2]
                            "coordinates" : [loc["lng"], loc["lat"]]
                        }
                    }
                    features.append(feature)
            elif row[h['Location']]  :
                print(row[h['Location']])


            id += 1
    print(len(features))
    return features


def expand_themes(_themes) :
    themes = _themes.split(",")
    expanded_themes = ""
    for theme in themes :
        theme = theme.lower().strip()
        if theme in theme_expansion :
            expanded_themes += theme_expansion[theme] + " "

    print(str(themes)  + " : " + expanded_themes)
    return expanded_themes + _themes



def load_categories() :
    global listing_categories
    with open("../listings.categories.json") as fp:
        listing_categories = json.load(fp)

def load_themes(file_path) :
    global theme_expansion
    theme_expansion = {}
    with open(file_path) as csvfile:
        reader = csv.reader(csvfile)
        headers = next(reader)
        h = dict(zip(headers, range(len(headers))))
        for row in reader:
            theme = row[0].lower().strip()
            words = row[1].replace(",", "")
            theme_expansion[theme] = words


if __name__ == "__main__" :
    load_outcodes()
    load_themes("20200930BOWW_SRmap_spreadsheet_EC-themes.csv")
    #load_os_places()
    #load_gn_places()
    #load_categories()
    features = process_listings_csv("20200930BOWW_SRmap_spreadsheet_EC.csv")
    with open("20200930BOWW_SRmap_spreadsheet_EC.csv.geo.json", "w") as f:
       json.dump(features, f, indent=4)
