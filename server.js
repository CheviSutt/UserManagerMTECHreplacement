const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const path = require('path');
const jsonFile = __dirname + '/clients.json';

const app = express();

let jsonArray = {
    clients: []
};

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use('/', express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.post('/clientTable', (req, res) => {
    fs.readFile(jsonFile, 'utf8', (err, data) => {
    if (err) console.log(err);

    // let index = 0; // unique id
    // let prevData = JSON.parse(data); // unique id

    let jsonData = JSON.parse(data);
    let clientObj = {
        userid: req.body.userid,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        address: req.body.address,
        age: req.body.age
    };

        // prevData.clients.forEach(client => { // unique id block
        //     if (client.id === index) index++;
        //     jsonArray.clients.push(client);
        // });

        // clientObj.id = index; // unique id block
        // jsonArray.clients.push(clientObj); // unique id

        jsonData.clients.push(clientObj);
        res.render('clientTable', {clients: jsonData.clients});

        fs.writeFile(jsonFile, JSON.stringify(jsonData), 'utf8', err => console.log(err));
    });
    // res.sendFile(jsonFile); // unique id attept
});

app.listen(8080, () => {
    console.log('Listening on port 8080');
});