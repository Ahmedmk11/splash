import json
import random
import string
from tkinter import *
from tkinter import messagebox 
import shutil 
import os
from natsort import natsorted

window = Tk()
window.title("Delete Product")
new_names_d = []
new_names_o = []

def rename_all(d):
    dirr = os.listdir(d)
    sortedDir = natsorted(dirr)
    
    ind = 0
    for file in sortedDir:
        if file.endswith('.jpg') or file.endswith('.jpeg'):
            ext = '.' + file.split('.')[-1]
            new_name =  os.path.abspath(d + '/' + str(ind)+ext)
            os.rename(os.path.abspath(d + '/' + file), new_name)
            ind += 1
            new_name_rel = "src/" + new_name.split('/src/')[-1]
            if "displayed" in d:
                new_names_d.append(new_name_rel)
            elif "original" in d:
                new_names_o.append(new_name_rel)

def random_string_generator(str_size, allowed_chars):
    return ''.join(random.choice(allowed_chars) for x in range(str_size))

def deleted():
    with open('src/scripts/db.json', 'r+') as f:
        data = json.load(f)
        products = data["Products"]
        flag = True
        empty = False

        if len(e1.get()) == 0:
            empty = True

        c = 0
        for i in products:
            if i["p_id"] == e1.get():
                flag = True
                break
            else:
                flag = False
            c += 1

        typ = products[c]["product_type"]

        if flag and not empty:
            displayed = products[c]["product_img_path_displayed"]
            original = products[c]["product_img_path_original"]
            displayedDir = displayed.split('/')
            displayedDir.pop()
            displayedDir = '/'.join(displayedDir)
            originalDir = original.split('/')
            originalDir.pop()
            originalDir = '/'.join(originalDir)

            disEXT = displayed.split('.')[1]
            ogEXT = original.split('.')[1]

            chars = string.ascii_letters

            filename = random_string_generator(16, chars)

            target1 = f"src/assets/images/pictures/products/deleted/displayed/{filename}.{disEXT}"
            target2 = f"src/assets/images/pictures/products/deleted/original/{filename}.{ogEXT}"

            del products[c]
            shutil.move(displayed, target1)
            shutil.move(original, target2)

            rename_all(displayedDir)
            rename_all(originalDir)

            e1.delete(0, END)

            print(new_names_d)
            for iiii in range(len(products)):
                print(iiii)

            typi = 0
            for ind in range(len(products)):
                p = products[ind]
                p["index"] = ind
                if p["product_type"] == typ:
                    p["product_img_path_displayed"] = new_names_d[typi]
                    p["product_img_path_original"] = new_names_o[typi]
                    typi += 1

            messagebox.showinfo("Done", "Product Deleted!")
        elif empty:
            messagebox.showinfo("Err", "No Value Entered")
        elif not flag:
            messagebox.showinfo("Err", "No Product Found.")
        f.seek(0)
        json.dump(data, f, indent=4)
        f.truncate()

window.minsize(height=200, width=300)
window.maxsize(height=200, width=300)

p_del = Label(window,text = "Product ID", font=('Arial', 18))
p_del.grid(row = 0, column = 0)
e1 = Entry(window, width=15, font =("Arial", 20, "bold"))
e1.grid(row = 0, column = 1)
btn = Button(window, text = "Delete", fg = "black", command= deleted)
btn.grid(row = 1, column = 0)

window.mainloop()
