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
        if len(e1.get()) == 0 or len(e2.get()) == 0 or len(e3.get()) == 0 or len(e4.get()) == 0 or len(e5.get()) == 0 or len(e6.get()) == 0 or len(e7.get()) == 0 or len(e8.get()) == 0 or len(e9.get()) == 0 or len(e10.get()) == 0:
            empty = True

        ids = [e1.get(),e2.get(),e3.get(),e4.get(),e5.get(),e6.get(),e7.get(),e8.get(),e9.get(),e10.get()]

        if not empty:
            for i in products:
                i["recommended"] = 0
            for i in products:
                if i["p_id"] in ids:
                    i["recommended"] = 1

            e1.delete(0, END)
            e2.delete(0, END)
            e3.delete(0, END)
            e4.delete(0, END)
            e5.delete(0, END)
            e6.delete(0, END)
            e7.delete(0, END)
            e8.delete(0, END)
            e9.delete(0, END)
            e10.delete(0, END)
            messagebox.showinfo("Done", "Recommendations Changed.")
        elif empty:
            messagebox.showinfo("Err", "All Fields Are Required.")

        f.seek(0)
        json.dump(data, f, indent=4)
        f.truncate()

window.minsize(height=420, width=1300)
window.maxsize(height=420, width=1300)

p1 = Label(window,text = "Product ID", font=('Arial', 18))
p1.grid(row = 0, column = 0)
e1 = Entry(window, width=15, font =("Arial", 20, "bold"))
e1.grid(row = 0, column = 1)

p2 = Label(window,text = "Product ID", font=('Arial', 18))
p2.grid(row = 1, column = 0)
e2 = Entry(window, width=15, font =("Arial", 20, "bold"))
e2.grid(row = 1, column = 1)

p3 = Label(window,text = "Product ID", font=('Arial', 18))
p3.grid(row = 2, column = 0)
e3 = Entry(window, width=15, font =("Arial", 20, "bold"))
e3.grid(row = 2, column = 1)

p4 = Label(window,text = "Product ID", font=('Arial', 18))
p4.grid(row = 3, column = 0)
e4 = Entry(window, width=15, font =("Arial", 20, "bold"))
e4.grid(row = 3, column = 1)

p5 = Label(window,text = "Product ID", font=('Arial', 18))
p5.grid(row = 4, column = 0)
e5 = Entry(window, width=15, font =("Arial", 20, "bold"))
e5.grid(row = 4, column = 1)

p6 = Label(window,text = "Product ID", font=('Arial', 18))
p6.grid(row = 5, column = 0)
e6 = Entry(window, width=15, font =("Arial", 20, "bold"))
e6.grid(row = 5, column = 1)

p7 = Label(window,text = "Product ID", font=('Arial', 18))
p7.grid(row = 6, column = 0)
e7 = Entry(window, width=15, font =("Arial", 20, "bold"))
e7.grid(row = 6, column = 1)

p8 = Label(window,text = "Product ID", font=('Arial', 18))
p8.grid(row = 7, column = 0)
e8 = Entry(window, width=15, font =("Arial", 20, "bold"))
e8.grid(row = 7, column = 1)

p9 = Label(window,text = "Product ID", font=('Arial', 18))
p9.grid(row = 8, column = 0)
e9 = Entry(window, width=15, font =("Arial", 20, "bold"))
e9.grid(row = 8, column = 1)

p10 = Label(window,text = "Product ID", font=('Arial', 18))
p10.grid(row = 9, column = 0)
e10 = Entry(window, width=15, font =("Arial", 20, "bold"))
e10.grid(row = 9, column = 1)

btn = Button(window, text = "Done", fg = "black", command= added, width=8, height=2)
btn.grid(row = 10, column = 0)

window.mainloop()
