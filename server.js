var express = require('express')
const fs = require('fs')
const cors = require('cors')
const bodyParser = require('body-parser')
var nodemailer = require('nodemailer')
var app = express()
let port = process.env.PORT || 3000

app.use(cors({
    origin: '*'
}));
app.use(bodyParser.json())

app.post('/', (req, res) => {
    console.log('inside post')
    let currentOrder = req.body.curr

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'splashordersmail@gmail.com',
            pass: process.env.pass,
        },
    })

    var mailOptions = {
        from: 'splashordersmail@gmail.com',
        to: currentOrder.order_address.email,
        subject: 'Your Order from Splash',
        text: `Your order from Splash will be delievered as soon as possible!\n
        Order ID: ${currentOrder.order_id}\n
        Subtotal (exc. shipping): ${currentOrder.order_subtotal}\n
        Items: ${currentOrder.order_items}`,
    }

    transporter.sendMail(mailOptions, function (error, info) {
        console.log('inside email 1')
        if (error) {
            console.log(error)
        }
    })

    let txt = currentOrder.order_address.apartment
        ? currentOrder.order_address.apartment
        : 'Not Specified'
    let txt2 = currentOrder.order_address.landmark
        ? currentOrder.order_address.landmark
        : 'Not Specified'
    let txt3 = currentOrder.order_address.instructions
        ? currentOrder.order_address.instructions
        : 'Not Specified'

    var mailOptions2 = {
        from: 'splashordersmail@gmail.com',
        to: 'splashordersmail@gmail.com',
        subject: `New Order Placed, ID: ${currentOrder.order_id}`,
        text: `Order ID: ${currentOrder.order_id}\n
        Subtotal (exc. shipping): ${currentOrder.order_subtotal}\n
        Time: ${currentOrder.order_datetime}\n
        Items: ${currentOrder.order_items}\n
        ------------------------------------
        Client:\n
        Name: ${currentOrder.order_address.username}\n
        Phone Number: ${currentOrder.order_address.phone}\n
        Email: ${currentOrder.order_address.email}\n
        City: ${currentOrder.order_address.city}\n
        Area: ${currentOrder.order_address.area}\n
        Street: ${currentOrder.order_address.street}\n
        Building / Villa: ${currentOrder.order_address.building}\n
        Floor: ${currentOrder.order_address.floor}\n
        Apartment: ${txt}\n
        Landmark: ${txt2}\n
        Extra Instructions: ${txt3}\n`,
    }

    transporter.sendMail(mailOptions2, function (error, info) {
        console.log('inside email 2')
        if (error) {
            console.log(error)
        }
    })

    let jsonString = JSON.stringify(req.body.db, null, 4)
    fs.writeFile('./src/scripts/db.json', jsonString, (err) => {
        if (err) {
            console.log('Error writing file', err)
        } else {
            res.status(200).send('Done!')
        }
    })
})

app.listen(port, (err) => {
    if (err) throw err
    console.log(`server running on port ${port}`)
})
