import csv
import json


def produce_categories_csv():
    with open("../listings.categories.json") as fp:
        listing_categories = json.load(fp)
    
    with open("../listings.csv") as csvfile:
        reader = csv.reader(csvfile)
        headers = next(reader)
        h = dict(zip(headers, range(len(headers))))
        listings = set()
        for row in reader:
            listing = row[h['Listing']].strip()
            listings.add(listing)
        
        listings = list(listings)
        listings.sort()

    with open("../listings_out.csv", "w") as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(["listing", "category_1", "category_2"])
        for listing in listings:
            try :
                row = [listing] + listing_categories[listing]
            except KeyError:
                row = [listing]
            writer.writerow(row)



        





if __name__ == "__main__" :
    produce_categories_csv()