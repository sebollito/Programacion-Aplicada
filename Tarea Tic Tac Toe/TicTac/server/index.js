const express = require('express');
const socket = require('socket.io');
const path = require('path');
const  { port} = require('../config/index');

const app = express();

app.use(express.static(path.join(__dirname,"../public/")));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,"../public/index.html"));
});

const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
const io = socket(server);
require('./socket')(io);