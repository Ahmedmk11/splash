import os
import json

path = "src/scripts/db.json"
with open(path, 'r+') as f:
    data = json.load(f)
    products = data["Products"]
    for i in range(60):
        file_path = f"{i}.jpg"
        if os.path.exists(f"src/assets/images/pictures/products/displayed/interiordesign/{file_path}"):
            p_id = f"ID{i}"
            product_img_path_displayed = f"src/assets/images/pictures/products/displayed/interiordesign/{file_path}"
            product_img_path_original = f"src/assets/images/pictures/products/original/interiordesign/{file_path}"
            index = 49 + i
            dic = {
                "p_id": p_id,
                "product_type": "Interior Design",
                "product_img_path_displayed": product_img_path_displayed,
                "product_img_path_original": product_img_path_original,
                "recommended": 0,
                "index": index
            }
            products.append(dic)
    f.seek(0)
    json.dump(data, f, indent=4)
    f.truncate()