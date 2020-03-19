const { checkFileType, fileType } = require('./dir');
const path = require('path');
const fs = require('fs');
const execSync = require('child_process').execSync;
const gm = require('gm');

/**
 * 
 * @param {string} filePath 预览文件地址
 * @param {string} tempPath 缓存目录
 * @param {string} toolPath 视频处理工具地址
 * @param {string} defaultFile 默认显示图片
 * 
 * @returns {Promise<Stream>}
 */
function getFilePreviewThumb(filePath, tempPath, toolPath, defaultFile) {
    const type = checkFileType(filePath)[0];

    const tmpFile = path.join(tempPath, new Date().getTime() + '.jpeg');

    if (type === fileType.VIDEO) {

        execSync(`${toolPath.ffmpegPath} -i ${filePath} -ss 00:00:10.000 -vframes 1 ${tmpFile}`);
        return new Promise((resolve, _) => resolve(fs.createReadStream(tmpFile)));
    }

    if (type === fileType.IMG) {
        return new Promise((resolve, _) => resolve(fs.createReadStream(filePath)));
        // return new Promise((resolve, _) => {
        //     gm(filePath).resize(400).stream('JPG', (_, stream) => resolve(stream));
        // });
    }

    if (type === fileType.PDF) {
        execSync(`${toolPath.gsPath} -sDEVICE=jpeg -dFirstPage=1 -dLastPage=1 -sOutputFile=${tmpFile} ${filePath}`);
        return new Promise((resolve, _) => resolve(fs.createReadStream(tmpFile)));
    }

    return new Promise((resolve, _) => resolve(fs.createReadStream(defaultFile)));
}

module.exports = { getFilePreviewThumb };