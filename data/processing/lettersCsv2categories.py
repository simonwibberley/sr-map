import csv
import json


def produce_categories_csv():

    with open("../letters.csv") as csvfile:
        reader = csv.reader(csvfile)
        headers = next(reader)
        h = dict(zip(headers, range(len(headers))))
        listings = set()
        for row in reader:
            sr = row[h['Emotional valence/tone --> SR']].strip()
            if sr.strip(): 
                listings.add(sr)
            wlm = row[h['emotional valence/tone --> WLM ']].strip()
            if wlm.strip(): 
                listings.add(wlm)
                    
        
        listings = list(listings)
        listings.sort()

    with open("../letters_ev_out.csv", "w") as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(["listing", "category_1", "category_2"])
        for listing in listings:
            row = [listing]
            writer.writerow(row)



if __name__ == "__main__" :
    produce_categories_csv()