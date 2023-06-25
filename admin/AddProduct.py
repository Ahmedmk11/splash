import json
import os
from tkinter import *
from tkinter import messagebox  
from tkinter import filedialog
from tkinter.filedialog import askopenfile
from PIL import Image, ImageTk

window = Tk()
window.title("Add Product")
images = []
e11 = 0
e12 = 0
p11 = 0
p12 = 0
  
def callback(*args):
    if variable.get() != 'Product Type':
        e9['state'] = ACTIVE
    else:
        e9['state'] = DISABLED

def save_img():
    first = True
    paths = []
    for img in images:
        path = ''
        path2 = ''
        if first == True:
            path = "src/assets/images/pictures/products/displayed/"
            first = False
        else:
            path = "src/assets/images/pictures/products/original/"
        if variable.get() == "Living Rooms":
            path2 = "livingrooms/"
        elif variable.get() == "Dressings":
            path2 = "dressings/"
        elif variable.get() == "Kids Bedrooms":
            path2 = "bedrooms/kids/"
        elif variable.get() == "Master Bedrooms":
            path2 = "bedrooms/master/"
        elif variable.get() == "Diningrooms":
            path2 = "diningrooms/"
        elif variable.get() == "Receptions":
            path2 = "receptions/"
        elif variable.get() == "TV Units":
            path2 = "tvunits/"
        elif variable.get() == "Interior Design":
            path2 = "interiordesign/"

        indx = len(os.listdir(f'{path}{path2}'))
        p = f'{path}{path2}{indx-1}.jpg'
        img.save(p, 'JPEG')
        paths.append(p)
    return paths

def upload_file(i,b):
    try:
        f_types = [('Jpg Files', '*.jpg')]
        filename = filedialog.askopenfilename(filetypes=f_types)
        img=Image.open(filename)
        images.append(img)
        width, height = img.size  
        width_new=int(width/10)
        height_new=int(height/10)
        img=img.resize((width_new,height_new))
        img=ImageTk.PhotoImage(img)
        if i == 0:
            global e11
            global p11
            e11 = Label(window)
            e11.place(x=450, y=0)
            p11 = Label(window,text = "Displayed Image", font=('Arial', 18))
            p11.place(x=450, y=height_new+20)
            e11.image = img
            e11['image']=img
            e10['state']=ACTIVE
        else:
            global e12
            global p12
            e12 = Label(window)
            e12.place(x=760, y=0)
            p12 = Label(window,text = "Original Image", font=('Arial', 18))
            p12.place(x=760, y=height_new+20)
            e12.image = img
            e12['image']=img
        b['state']=DISABLED
    except Exception as e:
        messagebox.showinfo("Err", e)

def added():
    path = "src/scripts/db.json"
    with open(path, 'r+') as f:
        data = json.load(f)
        products = data["Products"]
        empty = False
        toolong = False
        if (len(e1.get()) == 0 
            # or len(e2.get()) == 0 or len(e3.get()) == 0 
            # or len(e4.get()) == 0 or len(e5.get()) == 0 or len(e6.get()) == 0 or len(e7.get()) == 0 
            or variable.get() == "Product Type" or len(images) != 2):
            empty = True
        # if len(e2.get()) >= 20 or len(e3.get()) >= 20:
        #     toolong = True
        
        dup = False

        for i in products:
            if i["p_id"] == e1.get().capitalize():
                dup = True
                break

        if not empty and not dup and not toolong:
            paths = save_img()
            dic = {
                "p_id": e1.get().capitalize(),
                "product_code_en": f"- ID: {e1.get().capitalize()}",
                "product_code_ar": f"- \u0631\u0642\u0645 \u0627\u0644\u0645\u0646\u062a\u062c:  {e1.get().capitalize()}",
                "product_title_en": variable.get(),
                "product_title_ar": variable.get(),
                "product_description_en": '', #f"- Details: {e4.get()}",
                "product_description_ar": '', #f"- \u0627\u0644\u062a\u0641\u0627\u0635\u064a\u0644: {e5.get()}",
                "product_price_en": '', #f"{e6.get()} EGP",
                "product_price_ar": '', #f"{e6.get()} \u062c.\u0645",
                "product_price": '', #int(e6.get()),
                "product_dimensions_en": 'For further inquiries please contact us', #f"- Dimensions: {e7.get()}",
                "product_dimensions_ar": 'لمزيد من الاستفسارات يرجى الاتصال بنا', #f"- \u0627\u0644\u0627\u0628\u0639\u0627\u062f: \u200e{e7.get()}",
                "product_type": variable.get(),
                "product_img_path_displayed": paths[0],
                "product_img_path_original": paths[1],
                "recommended": 0,
                "index": len(products)
            }
            products.append(dic)
            e1.delete(0, END)
            # e2.delete(0, END)
            # e3.delete(0, END)
            # e4.delete(0, END)
            # e5.delete(0, END)
            # e6.delete(0, END)
            # e7.delete(0, END)
            global e11
            global e12
            global p11
            global p12
            e11.destroy()
            e12.destroy()
            p11.destroy()
            p12.destroy()
            variable.set("Product Type")
            images.clear()
            empty = True
            toolong = False
            messagebox.showinfo("Done", "Product Added.")
        elif empty:
            messagebox.showinfo("Err", "All Fields Are Required.")
        elif dup:
            messagebox.showinfo("Err", "Product ID Already Exists.")
        elif toolong:
            messagebox.showinfo("Err", "Use Shorter Titles (40 Characters).")

        f.seek(0)
        json.dump(data, f, indent=4)
        f.truncate()

window.minsize(height=420, width=1300)
window.maxsize(height=420, width=1300)

p1 = Label(window,text = "Product ID", font=('Arial', 18))
p1.grid(row = 0, column = 0)
e1 = Entry(window, width=15, font =("Arial", 20, "bold"))
e1.grid(row = 0, column = 1)

# p2 = Label(window,text = "English Title", font=('Arial', 18))
# p2.grid(row = 1, column = 0)
# e2 = Entry(window, width=15, font =("Arial", 20, "bold"))
# e2.grid(row = 1, column = 1)

# p3 = Label(window,text = "Arabic Title", font=('Arial', 18))
# p3.grid(row = 2, column = 0)
# e3 = Entry(window, width=15, font =("Arial", 20, "bold"))
# e3.grid(row = 2, column = 1)

# p4 = Label(window,text = "English Description", font=('Arial', 18))
# p4.grid(row = 3, column = 0)
# e4 = Entry(window, width=15, font =("Arial", 20, "bold"))
# e4.grid(row = 3, column = 1)

# p5 = Label(window,text = "Arabic Description", font=('Arial', 18))
# p5.grid(row = 4, column = 0)
# e5 = Entry(window, width=15, font =("Arial", 20, "bold"))
# e5.grid(row = 4, column = 1)

# p6 = Label(window,text = "Price", font=('Arial', 18))
# p6.grid(row = 5, column = 0)
# e6 = Entry(window, width=15, font =("Arial", 20, "bold"))
# e6.grid(row = 5, column = 1)

# p7 = Label(window,text = "Dimensions", font=('Arial', 18))
# p7.grid(row = 6, column = 0)
# e7 = Entry(window, width=15, font =("Arial", 20, "bold"))
# e7.grid(row = 6, column = 1)

p8 = Label(window,text = "Product Type", font=('Arial', 18))
p8.grid(row = 7, column = 0)
variable = StringVar(window)
variable.set("Product Type")
variable.trace("w", callback)
e8 = OptionMenu(window, variable, "Living Rooms", "Dressings", "Kids Bedrooms", "Master Bedrooms", "Diningrooms", "Receptions", "TV Units", "Interior Design")
e8.grid(row = 7, column = 1)

p9 = Label(window,text = "Import Image", font=('Arial', 18))
p9.grid(row = 8, column = 0)
e9 = Button(window, text='Upload Displayed', width=20,command = lambda:upload_file(0,e9), state=DISABLED)
e9.grid(row=8, column=1) 

p10 = Label(window,text = "Import Image", font=('Arial', 18))
p10.grid(row = 9, column = 0)
e10 = Button(window, text='Upload Original', width=20,command = lambda:upload_file(1,e10), state=DISABLED)
e10.grid(row= 9, column=1)

btn = Button(window, text = "Add Product", fg = "black", command= added, width=8, height=2)
btn.grid(row = 10, column = 0)

window.mainloop()
