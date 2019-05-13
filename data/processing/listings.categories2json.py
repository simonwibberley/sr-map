import json
import re

line_pattern = re.compile("^\s*(.*?)(?:\s+\(\d+x\)[\s.-]*)?([A-Z][A-Z\/ &-]*)\s*$")

def process2json(file_path):
    categories = {}
    print("Unmatched:")
    with open(file_path) as f:
        for line in f:
            match = line_pattern.match(line)
            if match:
                label = match.group(1).strip()
                cats = match.group(2).strip().split("/")
                for cat in cats: 
                    cat = cat.strip()
                    try:
                        categories[cat].append(label)
                    except KeyError:
                        categories[cat] = [label]
            else:
                print(line)

    # print("Categories:")

    listing_categories = {}

    for (category, listings) in categories.items():
        for listing in listings:
            try :
                listing_categories[listing].append(category)
            except KeyError:
                listing_categories[listing] = [category]

    with open("../listings.categories.json", "w") as f:
        json.dump(listing_categories, f)
    # print(json.dumps(categories, indent=4, sort_keys=True))    

    # print("Groupings:")
    # print(json.dumps(categories, indent=4, sort_keys=True))    


if __name__ == "__main__":
    process2json("../listings.categories.19-04-30.strimpel.txt")




