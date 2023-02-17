import json
from tkinter import *
from tkinter import messagebox  

window = Tk()
window.title("Add Product")

def added():
    with open('src/scripts/db.json', 'r+') as f:
        data = json.load(f)
        products = data["Products"]
        empty = False

        if len(e1.get()) == 0 or len(e2.get()) == 0 or len(e3.get()) == 0 or len(e4.get()) == 0 or len(e5.get()) == 0 or len(e6.get()) == 0 or len(e7.get()) == 0 or len(e8.get()) == 0:
            empty = True

        dic = {
            "p_id": e1.get(),
            "product_code_en": f"- ID: {e1.get()}",
            "product_code_ar": f"- \u0631\u0642\u0645 \u0627\u0644\u0645\u0646\u062a\u062c:  {e1.get()}",
            "product_title_en": e2.get(),
            "product_title_ar": e3.get(),
            "product_description_en": f"- Details: {e4.get()}",
            "product_description_ar": f"- \u0627\u0644\u062a\u0641\u0627\u0635\u064a\u0644: {e5.get()}",
            "product_price_en": f"{e6.get()} EGP",
            "product_price_ar": f"{e6.get()} \u062c.\u0645",
            "product_dimensions_en": f"- Dimensions: {e7.get()}",
            "product_dimensions_ar": f"- \u0627\u0644\u0627\u0628\u0639\u0627\u062f: {e7.get()}",
            "product_type": e8.get()
        }

        e1.delete(0, END)
        e2.delete(0, END)
        e3.delete(0, END)
        e4.delete(0, END)
        e5.delete(0, END)
        e6.delete(0, END)
        e7.delete(0, END)
        e8.delete(0, END)

        if not empty:
            messagebox.showinfo("Done", "Product Added!")
            products.append(dic)
        else:
            messagebox.showinfo("Err", "All Fields Are Required")

        f.seek(0)
        json.dump(data, f, indent=4)
        f.truncate()

window.minsize(height=350, width=400)
window.maxsize(height=350, width=400)

p1 = Label(window,text = "Product ID", font=('Arial', 18))
p1.grid(row = 0, column = 0)
e1 = Entry(window, width=15, font =("Arial", 20, "bold"))
e1.grid(row = 0, column = 1)

p2 = Label(window,text = "English Title", font=('Arial', 18))
p2.grid(row = 1, column = 0)
e2 = Entry(window, width=15, font =("Arial", 20, "bold"))
e2.grid(row = 1, column = 1)

p3 = Label(window,text = "Arabic Title", font=('Arial', 18))
p3.grid(row = 2, column = 0)
e3 = Entry(window, width=15, font =("Arial", 20, "bold"))
e3.grid(row = 2, column = 1)

p4 = Label(window,text = "English Description", font=('Arial', 18))
p4.grid(row = 3, column = 0)
e4 = Entry(window, width=15, font =("Arial", 20, "bold"))
e4.grid(row = 3, column = 1)

p5 = Label(window,text = "Arabic Description", font=('Arial', 18))
p5.grid(row = 4, column = 0)
e5 = Entry(window, width=15, font =("Arial", 20, "bold"))
e5.grid(row = 4, column = 1)

p6 = Label(window,text = "Price", font=('Arial', 18))
p6.grid(row = 5, column = 0)
e6 = Entry(window, width=15, font =("Arial", 20, "bold"))
e6.grid(row = 5, column = 1)

p7 = Label(window,text = "Dimensions", font=('Arial', 18))
p7.grid(row = 6, column = 0)
e7 = Entry(window, width=15, font =("Arial", 20, "bold"))
e7.grid(row = 6, column = 1)

p8 = Label(window,text = "Product Type", font=('Arial', 18))
p8.grid(row = 7, column = 0)
e8 = Entry(window, width=15, font =("Arial", 20, "bold"))
e8.grid(row = 7, column = 1)

btn = Button(window, text = "Add", fg = "black", command= added)
btn.grid(row = 8, column = 0)

window.mainloop()
