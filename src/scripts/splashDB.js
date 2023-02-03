var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "SAam$*lA<3",
    database: "Splash"
});

con.connect(function(err) {
    if (err) {throw err;};
    console.log("Connected!");
    con.query("SELECT * FROM test", function (err, result, fields) {
        if (err) throw err;
        console.log(result);
    });
});
