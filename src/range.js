'use strict';

const fs = require('fs');
const mime = require('mime-types');

function parseRange(str, videoSize) {
    const endOffset = videoSize - 1;
    // bytes=162564492-
    // bytes=-162564492
    // bytes=162564492-162564499
    let strs = str.split('=');

    // 如果range参数格式错误，那么默认为获取整个视频
    if (strs.length !== 2) {
        return { start: 0, end: endOffset, size: videoSize };
    }

    // 162564492-
    // -162564492
    // 162564492-162564499
    // 对range参数进行切割，得到start与end
    strs = strs.pop().split('-');
    let end = parseInt(strs.pop(), 10) || endOffset;
    let start = parseInt(strs.pop(), 10);
    if (isNaN(start)) {
        start = end;
        end = endOffset;
    }
    return { start, end, size: videoSize };
}

function parseRangeResponse(range, response, contentType) {
    response.setHeader("Content-Type", contentType);
    response.setHeader("Content-Range", "bytes " + range.start + "-" + range.end + "/" + range.size);
    response.setHeader("Content-Length", (range.end - range.start + 1));
    response.writeHead('206', "Partial Content");
    return response;
}

function addVideoApi(app, path) {

    app.get(path, function (request, response) {

        // 检查视频路径参数
        const params = request.query;
        if (!params.hasOwnProperty('video')) {
            return response.send('参数错误,缺少视频名称');
        }

        // 检查视频文件是否存在,并获取文件信息
        const filePath = Buffer.from(params.video, 'hex').toString();
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
            response.setHeader('200', "Partial Content");
            response.setHeader("Content-Type", mime.lookup(filePath));
            response.setHeader("Content-Length", fileStat.size);
            stream.pipe(response);
        }
    });
}

module.exports = { parseRange, parseRangeResponse, addVideoApi };