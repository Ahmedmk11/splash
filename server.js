const express = require('express')
const mysql = require('mysql');

const app = express()

app.listen(8080)

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "SAam$*lA<3",
    database: "Splash"
});

connection.connect((err) => {
    if (err) {
      console.log(err)
      return
    }
    console.log('Database connected')
})

module.exports = connection

const getTable = (n) => {
    let t = chooseTable(n)
    return new Promise((resolve, reject) => {
        con.query(`SELECT * FROM view${t}`, (err, resp) => {
            (!err) ? resolve(resp) : reject(err)
        });
    })
}

const getTableData = async (n) => {
    const a = await getTable(n);
    let arr = []
    a.forEach(item => {
        arr.push(item)
    })
    return await arr
}

getTableData(3).then(data => {
    console.log(data)
});

function chooseTable(n) {
    switch (n) {
        case 1:
            return 'livingrooms'
        case 2:
            return 'masterbedrooms'
        case 3:
            return 'kidsbedrooms'
        case 4:
            return 'receptions'
        case 5:
            return 'diningrooms'
        case 6:
            return 'tvunits'
        case 7:
            return 'recommended'
        default:
            break;
    }
}
