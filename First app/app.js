const express = require("express");

const fs = require('fs');

const path = require('path')

const app = express();

app.get("/", (req, res) => {
    res.send("Hello, Welcome to my first 8888 port");
});


app.get("/user", (req, res) => {
    let rawdata = fs.readFileSync(path.resolve(__dirname, 'mockdata.json'));
    let users = JSON.parse(rawdata);

    res.send(users);
});

app.listen(8888, function() {
    console.log("This is my welcome port");
});