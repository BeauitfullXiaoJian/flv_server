const { checkFileType, fileType } = require('./dir');
const path = require('path');
const fs = require('fs');
const execSync = require('child_process').execSync;
const PDFImage = require("pdf-image").PDFImage;

// path.join(__dirname, '../bin/ffmpeg.exe');

/**
 * 
 * @param {string}} filePath 预览文件地址
 * @param {string}} tempPath 缓存目录
 * @param {string}} toolPath 视频处理工具地址
 * 
 * @returns {Promise<Stream>}
 */
function getFilePreviewThumb(filePath, tempPath, toolPath) {
    const type = checkFileType(filePath)[0];

    const tmpFile = path.join(tempPath, new Date().getTime() + '.jpeg');

    if (type === fileType.VIDEO) {

        execSync(`${toolPath.ffmpegPath} -i ${filePath} -ss 00:00:01.000 -vframes 1 ${tmpFile}`);
        return new Promise((resolve, _) => resolve(fs.createReadStream(tmpFile)));
    }

    if (type === fileType.IMG) {

    }

    if (type === fileType.PDF) {
        return new PDFImage(filePath).convertPage(0).then(imagePath => fs.createReadStream(imagePath))
    }

    return new Promise((resolve, _) => resolve(null));
}

module.exports = { getFilePreviewThumb };