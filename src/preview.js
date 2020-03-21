const { checkFileType, fileType } = require('./dir');
const path = require('path');
const fs = require('fs');
const execSync = require('child_process').execSync;

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
    console.log(filePath);
    const type = checkFileType(filePath, toolPath)[0];

    const tmpFile = path.join(tempPath, new Date().getTime() + '.jpeg');

    if (type === fileType.VIDEO) {

        execSync(`${toolPath.ffmpegPath} -i "${filePath}" -ss 00:00:01.000 -vframes 1 ${tmpFile}`);
        return new Promise((resolve, _) => resolve(fs.createReadStream(tmpFile)));
    }

    if (type === fileType.IMG) {
        return new Promise((resolve, _) => resolve(fs.createReadStream(filePath)));
    }

    if (type === fileType.PDF) {
        execSync(`${toolPath.gsPath} -sDEVICE=jpeg -dFirstPage=1 -dLastPage=1 -sOutputFile=${tmpFile} ${filePath}`);
        return new Promise((resolve, _) => resolve(fs.createReadStream(tmpFile)));
    }

    if (type === fileType.DIR) {
        return new Promise((resolve, _) => resolve(fs.createReadStream(path.join(__dirname, 'assets/dir.png'))));
    }

    return new Promise((resolve, _) => resolve(fs.createReadStream(defaultFile)));
}

module.exports = { getFilePreviewThumb };