'use strict';
const express = require('express');
const app = express();
const port =5000;
var cors = require('cors')

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({extended:false}));

var api = require('./routes/api');
const config = require('./config/config');
app.use('/', api);
app.use(express.static('public'));
app.use('/public', express.static('public'));
app.listen(port, async function () {
    console.log('localhost:' + port);
    // console.log("s3url",await config.getSignUrl("charrySaloon/uploadsvendor/image-1706618130540.jpeg"));
    // console.log("s3urls : ",await config.getImageSingedUrlById(22));
});