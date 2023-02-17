import json
from tkinter import *
from tkinter import messagebox  

window = Tk()
window.title("Delete Product")

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
        
        if flag and not empty:
            messagebox.showinfo("Done", "Product Deleted!")
            e1.delete(0, END)
            del products[c]
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
    