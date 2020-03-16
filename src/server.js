
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const { dirSearch, dirAll } = require('./dir');
const { getFilePreviewThumb } = require('./preview');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

function createSuccessData(data) {
    return {
        result: true,
        code: 200,
        message: 'success',
        data
    };
}

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

/**
 * 获取服务器所有文件
 */
app.get('/files', function (_, res) {
    const dir = path.join(__dirname, '../public');
    const files = dirAll(dir);
    res.send(createSuccessData({
        total: files.length,
        rows: files.map(p => ({
            id: 0,
            videoTitle: p,
            videoSourceUrl: 'http://192.168.31.215:8000/flv?video=' + p,
            videoThumbUrl: 'http://192.168.31.215:8000/thumb?path=' + p,
            videoLabel: ''
        }))
    }));
});

app.get('/thumb', function (req, res) {
    const filePath = req.query.path;
    const tempPath = path.join(__dirname, '../temp');
    const defaultFile = path.join(__dirname, 'assets/index.png');
    const toolPath = {
        ffmpegPath: path.join(__dirname, '../bin/ffmpeg/ffmpeg.exe'),
        gsPath: path.join(__dirname, '../bin/gs/gswin64c.exe')
    };
    getFilePreviewThumb(filePath, tempPath, toolPath, defaultFile).then(stream => {
        res.set('Content-Type', 'image/jpeg');
        if (stream) {
            stream.pipe(res);
        }
    });
});

app.listen(8000);
