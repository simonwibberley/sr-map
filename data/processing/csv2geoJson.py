import csv
import os
import glob
import re
import json
import dateparser 
import datetime
from calendar import monthrange
from bng_to_latlon import OSGB36toWGS84

PLACES_OS_JSON = "places_os.json"
PLACES_GN_JSON = "places_gn.json"
DATE_FORMAT = "%Y-%m-%d"


outcodes = {}
places = {}
categories = {}
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


def load_os_places() :
    global places
    try :
        with open(PLACES_OS_JSON, "r") as f: 
            places = json.load(f)
            # print(places["London"])
        return
    except:
        pass
    with open("../geo/opname/DOC/OS_Open_Names_Header.csv") as f:
        headers = f.readline().split(",")
        h = b = dict(zip(headers, range(len(headers))))
    
    for path in glob.iglob("../geo/opname/DATA/*.csv"):

        with open(path) as csvfile:
            reader = csv.reader(csvfile)
            for row in reader:
                if(row[h['TYPE']] != 'populatedPlace'):
                    continue
                try :
                    easting, northing = row[h['GEOMETRY_X']], row[h['GEOMETRY_Y']]
                    (lat, lng) = OSGB36toWGS84(int(easting), int(northing))
                    name = row[h['NAME1']]
                    try :
                        places[name]
                    except KeyError: 
                        places[name] = []
                    places[name].append({
                        "lat" : lat,
                        "lng" : lng
                        # ,
                        # "meta" : row
                    })
                    # print((name, lat, lng))
                except ValueError:
                    pass

    with open(PLACES_OS_JSON, "w") as f: 
        json.dump(places, f, indent=4)

def load_gn_places() :
    headers = ['geonameid','name','asciiname','alternatenames','latitude','longitude','feature class','feature code','country code',
'cc2','admin1 code','admin2 code','admin3 code','admin4 code','population','elevation','dem','timezone','modification date']
    h = dict(zip(headers, range(len(headers))))

    global places
    try :
        with open(PLACES_GN_JSON, "r") as f: 
            places = json.load(f)
            # print(places["London"])
        return
    except:
        pass

    with open("../geo/geonames/GB.txt") as csvfile:
        reader = csv.reader(csvfile, dialect=csv.excel_tab)
        for row in reader:
            print(row)
            if( row[h['feature class']] not in set(['P', 'A'])):
                continue
            try :
                lat, lng = row[h['latitude']], row[h['longitude']]
                name = row[h['name']]
                try :
                    places[name]
                except KeyError: 
                    places[name] = []
                places[name].append({
                    "lat" : lat,
                    "lng" : lng
                    # ,
                    # "meta" : row
                })
                # print((name, lat, lng))
            except ValueError:
                pass

    with open(PLACES_GN_JSON, "w") as f: 
        json.dump(places, f, indent=4)
    


pc_pattern = re.compile('[A-Z]{1,2}[0-9]{1,2}')

def get_postcode(data):
    match = pc_pattern.search(data)
    return match


def get_lat_lng(data):
    pc_match = get_postcode(data)
    coords = False
    if(pc_match) :
        pc = pc_match.group(0)
        coords = outcodes[pc]
        #print(coords)
    elif data :
        try :
            coords = places[data][0]
        except KeyError:
            #print(data)
            pass
        # get_place_match()

    return coords


issue_pattern = re.compile(r".*(\(.*\))")
def process_listings_csv(file_path) :
    id = 0
    features = []
    with open(file_path) as csvfile:
        reader = csv.reader(csvfile)
        headers = next(reader)
        h = b = dict(zip(headers, range(len(headers))))
        for row in reader:
            loc = get_lat_lng(row[h['postcode']].strip())
            loc_str = row[h['postcode']]
            if not loc :
                loc = get_lat_lng(row[h['Town/city/county']].strip())
                loc_str = row[h['Town/city/county']]
            
            if loc:
                date_str = row[h['SR issue']]
                match = issue_pattern.match(date_str)
                if match:
                    date = dateparser.parse(match.group(1))
                    start = datetime.date(date.year, date.month, 1)
                    end = datetime.date(date.year, date.month, monthrange(date.year, date.month)[1])
                    listing = row[h['Listing']]
                    categories = categories[listing]

                    data = {
                        "listing" : listing,
                        "concerns_race" : row[h['Concerns race?']].lower().contains("yes"),
                        "concerns_sexuality" : row[h['Explicitly and foremost concerns sexuality?']].lower().contains("yes"),
                        "info" : row[h['Additional info']],
                        "type" : row[h['Type']],
                        "cultural_genre" : row[h['Cultural genre']],
                        "location" : loc_str
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
                            "coordinates" : [loc["lng"], loc["lat"]]
                        }
                    }
                    features.append(feature)
                    #print(feature)
            
            id += 1
    return features


def load_categories() :
    global categories
    with open("../listings.categories.json") as fp:
        categories = json.load(fp)

if __name__ == "__main__" :
    load_outcodes()
    #load_os_places()
    load_gn_places()
    load_categories()
    features = process_listings_csv("../listings.csv")
    with open("../listings.geo.json", "w") as f:
        json.dump(features, f, indent=4)
    
