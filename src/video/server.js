
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const { addVideApi, printVideoUrl } = require('./range');
const { printIPAddress } = require('./../ip');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

addVideApi(app, '/');
printIPAddress();
printVideoUrl('/Users/xiaojian/Movies/视频/1598072094674888.mp4', 8000);
app.listen(8000);