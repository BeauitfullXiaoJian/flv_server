
const express = require('express');
const bodyParser = require('body-parser');
const { parseRange, parseRangeResponse } = require('./range');
const fs = require('fs');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

const gm = require('gm');
const { getDirFiles } = require('./file.js');

// 跨域设置
app.all("*", function (req, res, next) {
    if (req.path !== "/" && !req.path.includes(".")) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        res.header('Access-Control-Allow-Headers', 'Content-Type');
        res.header('Access-Control-Allow-Headers', 'range');
    }
    next();
});

app.get('/flv', function (request, response) {
    // 获取要播放的视频
    const params = request.query;
    if (!params.hasOwnProperty('video')) {
        return response.send('参数错误,缺少视频名称');
    }

    // 检查视频文件是否存在,并获取文件信息
    const filePath = __dirname + '/public/' + params.video;
    if (!fs.existsSync(filePath)) {
        return response.send('播放的视频不存在');
    }
    const fileStat = fs.statSync(filePath);


    // 根据range进行跳转
    if (request.headers['range']) {
        const range = parseRange(request.headers['range'], fileStat.size);
        const stream = fs.createReadStream(filePath, range);
        response = parseRangeResponse(range, response, 'video/x-flve');
        stream.pipe(response);
    } else {
        const stream = fs.createReadStream(filePath);
        response.writeHead('200', "Partial Content");
        stream.pipe(response);
    }
});


/**
 * 获取服务器所有文件
 */
app.get('/files', function (req, res) {
    const params = req.query;
    const limit = params.limit || 10;
    const offset = params.offset || 0
    const dir = __dirname + '/public';
    const files = getDirFiles(dir);
    res.send({
        result: true,
        code: 200,
        message: '',
        data: {
            total: files.length,
            rows: files.map(path => ({
                id: 0,
                videoTitle: path.replace(dir, ''),
                videoSourceUrl: 'http://192.168.31.215:8000/flv?video=' + path.replace(dir, ''),
                videoThumbUrl: 'http://192.168.31.215:8000/thumb?path=' + path.replace(dir, ''),
                videoLabel: ''
            })).splice(offset, limit)
        }
    });
});

app.get('/video', function (req, res) {
    res.send({
        result: true,
        code: 200,
        message: '',
        data: {
            id: 0,
            videoTitle: 'HOME/WAVR00024_A.mp4',
            videoSourceUrl: 'http://192.168.31.215:8000/flv?video=HOME/WAVR00024_C.mp4',
            videoThumbUrl: '',
            videoLabel: ''
        }
    });
});

app.get('/thumb', function (req, res) {
    const path = __dirname + '/public' + req.query.path;
    gm(path).resize(400).stream('JPG', (err, stream) => {
        res.set('Content-Type', 'image/jpeg');
        stream.pipe(res);
    });
});

app.listen(8000);
