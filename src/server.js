
const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const { ServerConfig } = require('./config');
const { dirSearch, dirAll, fileType } = require('./dir');
const { getApi, saveApi } = require('./saver');
const { getFilePreviewThumb } = require('./preview');
const { parseRange, parseRangeResponse } = require('./range');
const mime = require('mime-types');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

const toolPath = {
    ffmpegPath: path.join(__dirname, '../bin/ffmpeg/ffmpeg.exe'),
    ffprobePath: path.join(__dirname, '../bin/ffmpeg/ffprobe.exe'),
    gsPath: path.join(__dirname, '../bin/gs/gswin64c.exe'),
    gmPath: path.join(__dirname, '../bin/gm/gm.exe'),
    tempPath: path.join(__dirname, '../temp')
};

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
app.get('/file', function (req, res) {
    const dir = path.join(__dirname, '../public');
    const files = dirAll(dir);
    const params = req.query;
    const limit = params.limit || 10;
    const offset = params.offset || 0;
    res.send(createSuccessData({
        total: files.length,
        rows: files.splice(offset, limit).map(filePath => ({
            filePath,
            previewUrl: `${ServerConfig.apiHost}/thumb?path=${filePath}`,
            downloadUrl: file.filePath.replace(dir, '').substring(1),
            parentDir: dir,
        }))
    }));
});

/**
 * 获取一个文件夹中的所有文件，不包含子目录
 */
app.get('/dir', function (req, res) {
    const dir = req.query.dir || path.join(__dirname, '../public');
    const apiName = '/dir' + dir;
    let data = getApi(apiName);
    if (data === null) {
        const files = dirSearch(dir, toolPath);
        data = createSuccessData(files.map(file => Object.assign(file, {
            previewUrl: `${ServerConfig.apiHost}/thumb?path=${new Buffer(file.filePath).toString('hex')}`,
            downloadUrl: file.filePath.replace(path.join(__dirname, '../public'), '').substring(1),
            parentDir: dir
        })).map(item => [fileType.VIDEO, ~fileType.MUSIC].indexOf(item.fileType) ? Object.assign(item, { downloadUrl: new Buffer(item.filePath).toString('hex') }) : item));
        saveApi(apiName, data);
    }
    res.send(data);
});

/**
 * 获取文件缩略图
 */
app.get('/thumb', function (req, res) {
    const filePath = new Buffer(req.query.path, 'hex').toString();
    const tempPath = path.join(__dirname, '../temp');
    const defaultFile = path.join(__dirname, 'assets/other.png');
    getFilePreviewThumb(filePath, tempPath, toolPath, defaultFile).then(stream => {
        res.set('Content-Type', 'image/jpeg');
        if (stream) {
            stream.pipe(res);
        }
    });
});

/**
 * 视频播放
 */
app.get('/video', function (request, response) {
    // 获取要播放的视频
    const params = request.query;
    if (!params.hasOwnProperty('video')) {
        return response.send('参数错误,缺少视频名称');
    }

    // 检查视频文件是否存在,并获取文件信息
    const filePath = new Buffer(params.video, 'hex').toString();
    if (!fs.existsSync(filePath)) {
        return response.send('播放的视频不存在');
    }
    const fileStat = fs.statSync(filePath);


    // 根据range进行跳转
    if (request.headers['range']) {
        const range = parseRange(request.headers['range'], fileStat.size);
        const stream = fs.createReadStream(filePath, range);
        response = parseRangeResponse(range, response, mime.lookup(filePath));
        stream.pipe(response);
    } else {
        const stream = fs.createReadStream(filePath);
        response.writeHead('200', "Partial Content");
        stream.pipe(response);
    }
});

app.listen(8000);
