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
    }

    jsonData.clients.forEach(user => { // unique id block
        if (user.userId === index) index++;
    });
    clientObj.userId = index; // unique id

    jsonData.clients.push(clientObj);
    res.render('clientTable', {clients: jsonData.clients}); // rendering clientTable html

    fs.writeFile(jsonFile, JSON.stringify(jsonData), 'utf8', err => console.log(err));
    });
});

app.get('/edit', (req, res) => { // Routes to edit page
    fs.readFile(jsonFile, 'utf8', (err, data) => {
        if (err) console.log(err);

        let jsonData = JSON.parse(data);

        res.render('edit', {clients: jsonData.clients});
    });
});

app.post('/editSubmit', (req, res) => {
    //console.log(req);
    let users = [];
    console.log(req.body);
    let loop = req.body.userId.length;
    for(let i = 0; i <= loop; i++){
        let user = {
            userId: req.body.userId[i],
            firstName: req.body.firstName[i],
            lastName: req.body.lastName[i],
            email: req.body.email[i],
            age: req.body.age[i]
        };

        users.push(user);

    }
    let jsonData = {
        clients: users
    };
    console.log(users);
    fs.writeFile(jsonFile, JSON.stringify(jsonData), (err) => {
        if (err) throw err;
        fs.readFile(jsonFile, 'utf8', (err, data) => {
            if (err) throw err;

            let allUsers = JSON.parse(data);

            res.render('clientTable', {clients: allUsers.clients});
        });

    });
});

app.post('/delete', (req, res) => {
    let index = Number(req.body.delete);
   // console.log('index' + index);

    fs.readFile(jsonFile, 'utf8', (err, data) => {
        if(err) throw err;

        let allUsers = JSON.parse(data);
        for(let i = 0; i <= allUsers.clients.length; i++) {
            console.log(i);

            // if (allUsers.clients.userId === this.clients.userId) {
            //     console.log(this.clients.userId);
            // }

            if (i === index) {
                console.log('i'+ i);
                console.log('allUsers.userId' + i);
                allUsers.clients.splice(index, 1);
            }
        }
        fs.writeFile(jsonFile, JSON.stringify(allUsers)); // delete
        console.log(allUsers.clients); // delete
        res.render('clientTable', {clients: allUsers.clients});
    });
});

app.listen(3000, () => {
    console.log('Listening on port 3000');
});

// function play() {
// console.log('Play Function');
// }
