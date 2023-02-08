const mysql = require('mysql');

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "SAam$*lA<3",
    database: "Splash"
});

const getMasterBedrooms = () => {
    return new Promise((resolve, reject) => {
        con.query("SELECT * FROM viewmasterbxedrooms", (err, resp) => {
            (!err) ? resolve(resp) : reject(err)
        });
    })
}

const getMasterBedroomsData = async () => {
    const a = await getMasterBedrooms();
    let arr = []
    a.forEach(item => {
        arr.push(item)
    })
    return await arr
}

const getKidsBedrooms = () => {
    return new Promise((resolve, reject) => {
        con.query("SELECT * FROM viewkidsbedrooms", (err, resp) => {
            (!err) ? resolve(resp) : reject(err)
        });
    })
}

const getKidsBedroomsData = async () => {
    const a = await getKidsBedrooms();

    let arr = []
    a.forEach(item => {
        arr.push(item)
    })
    return await arr
}

getMasterBedroomsData().then(data => {
    console.log(data)
});

getKidsBedroomsData().then(data => {
    console.log(data)
});
