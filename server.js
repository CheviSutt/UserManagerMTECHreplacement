const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const path = require('path');
const jsonFile = __dirname + '/clients.json';

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use('/', express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/clientTable', (req, res) => {
    fs.readFile(jsonFile, 'utf8', (err, data) => {
        if (err) console.log(err);
        let jsonData = JSON.parse(data);
        res.render('clientTable', {clients: jsonData.clients});
    });
});

app.post('/clientTable', (req, res) => {
    fs.readFile(jsonFile, 'utf8', (err, data) => { // reads clients,json
    if (err) console.log(err);

    let index = 0; // unique id

    let jsonData = JSON.parse(data);

    let clientObj = {
        userId: 0, // unique id
        //userId: req.body.userId,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        address: req.body.address,
        age: req.body.age
    };

    jsonData.clients.forEach(user => { // unique id block
        if (user.userId === index) index++;
    });
    clientObj.userId = Number(index); // unique id

    jsonData.clients.push(clientObj);
    res.render('clientTable', {clients: jsonData.clients}); // rendering clientTable html

    fs.writeFile(jsonFile, JSON.stringify(jsonData), 'utf8', err => console.log(err));
    });
});

app.get('/edit/:clientId', (req, res) => { // Routes to edit page
    let clientId = req.params.clientId;
    let forEachCallBack = (index, jsonData) => {
        console.log(jsonData.clients[index]);
        res.render('edit', {client: jsonData.clients[index]}); // .userId to populate single user
    }
    fs.readFile(jsonFile, 'utf8', (err, data) => {
        if (err) console.log(err);

        let jsonData = JSON.parse(data);

        jsonData.clients.forEach((user, index) => {
            if (Number(user.userId) === Number(clientId)) {
                forEachCallBack(index, jsonData);
            }
        });
    });
});

app.post('/edit/:clientId', (req, res) => {
    //console.log(req);
    let clientId = req.params.clientId;

    let user = {
        userId: req.body.userId,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        age: req.body.age
    };

    let forEachCallBack = (index, jsonData) => {
        jsonData.clients[index] = user;
        fs.writeFile(jsonFile, JSON.stringify(jsonData), (err) => {
            if (err) throw err;
        });
        res.render('clientTable', {clients: jsonData.clients});
    }

    fs.readFile(jsonFile, 'utf8', (err, data) => {
        if (err) console.log(err);

        let jsonData = JSON.parse(data);

        jsonData.clients.forEach((user, index) => {
            if (Number(user.userId) === Number(clientId)) {
                forEachCallBack(index, jsonData);
            }
        });
    });
});

app.get('/delete/:clientId', (req, res) => {
    let clientId = req.params.clientId;

    let forEachCallBack = (index, jsonData) => {
        jsonData.clients.splice(index,1);
        console.log(jsonData);
        res.redirect('/clientTable');
        fs.writeFile(jsonFile, JSON.stringify(jsonData), (err) => {
            if (err) throw err;
        });
    }

    fs.readFile(jsonFile, 'utf8', (err, data) => {
        if (err) console.log(err);

        let jsonData = JSON.parse(data);

        jsonData.clients.forEach((user, index) => {
            if (Number(user.userId) === Number(clientId)) {
                forEachCallBack(index, jsonData);
            }
        });
    });
});

app.listen(5000, () => {
    console.log('Listening on port 5000');
});


