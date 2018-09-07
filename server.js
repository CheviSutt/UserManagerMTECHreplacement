const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const path = require('path');
const jsonFile = __dirname + '/clients.json';

const app = express();

// let jsonArray = {
//     clients: []
// };

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use('/', express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.post('/clientTable', (req, res) => {
    fs.readFile(jsonFile, 'utf8', (err, data) => {
    if (err) console.log(err);

    let index = 0; // unique id
    //let prevData = JSON.parse(data); // unique id

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

    clientObj.userId = index; // unique id block

    jsonData.clients.push(clientObj);
    res.render('clientTable', {clients: jsonData.clients});

    fs.writeFile(jsonFile, JSON.stringify(jsonData), 'utf8', err => console.log(err));
        //res.sendFile(jsonFile); // unique id attept
    });
    // res.sendFile(jsonFile); // unique id attept

});

app.get('/edit', (req, res) => { // Routes to edit page
    fs.readFile(jsonFile, 'utf8', (err, data) => {
        if (err) console.log(err);

        let jsonData = JSON.parse(data);

        res.render('edit', {clients: jsonData.clients});
        // fs.writeFile(jsonFile, JSON.stringify(jsonData), 'utf8', err => console.log(err));
    });
});

app.post('/editSubmit', (req, res) => { // test
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

// app.post('/remove', (req, res) => { // test
//
//     let index = Number(req.body.delete);
//     console.log('index' + index );
//
//     fs.readFile(Users, 'utf8', (err, data) => {
//         if (err) throw err;
//
//         let allUsers = JSON.parse(data);
//         //console.log(allUsers);
//         for(let i = 0; i <= allUsers.users.length; i++){
//             if(i === index){
//                 console.log('i' + i);
//                 allUsers.users.splice(index);
//             }
//         }
//         fs.writeFile(Users, JSON.stringify(allUsers));
//         console.log(allUsers.users);
//         res.render('users', {users: allUsers.users});
//     });
// });

app.post('/delete', (req,res) => {
    let index = Number(req.body.delete);
    console.log('index' + index);

    fs.readFile(jsonFile, 'utf8', (err, data) => {
        if(err) throw err;

        let allUsers =JSON.parse(data);
        for(let i = 0; i <= allUsers.clients.length; i++) {
            console.log(i);

            if (i === index) {
                console.log('i'+ i);
                allUsers.clients.splice(index);
            }
        }
        fs.writeFile(jsonFile, JSON.stringify(allUsers));
        console.log(allUsers.clients);
        res.render('clientTable', {clients: allUsers.clients});
    });
});

app.listen(8080, () => {
    console.log('Listening on port 8080');
});

// function play() {
// console.log('Deleted');
// }
