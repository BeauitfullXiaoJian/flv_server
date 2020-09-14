const { checkFileType, fileType } = require('./dir');
const path = require('path');
const fs = require('fs');
const mime = require('mime-types');
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
    const type = checkFileType(filePath, toolPath)[0];

    const tmpFile = path.join(tempPath, new Date().getTime() + '.jpeg');

    if (type === fileType.VIDEO) {

        execSync(`${toolPath.ffmpegPath} -i "${filePath}" -ss 00:00:01.000 -vframes 1 ${tmpFile}`);
        return new Promise((resolve, _) => resolve({
            stream: fs.createReadStream(tmpFile),
            mime: mime.lookup(tmpFile)
        }));
    }

    if (type === fileType.IMG) {
        return new Promise((resolve, _) => resolve({
            stream: fs.createReadStream(filePath),
            mime: mime.lookup(filePath)
        }));
    }

    if (type === fileType.PDF) {
        execSync(`${toolPath.gsPath} -sDEVICE=jpeg -dFirstPage=1 -dLastPage=1 -sOutputFile=${tmpFile} ${filePath}`);
        return new Promise((resolve, _) => resolve({
            stream: fs.createReadStream(tmpFile),
            mime: mime.lookup(tmpFile)
        }));
    }

    if (type === fileType.MUSIC) {
        return new Promise((resolve, _) => resolve({
            stream: fs.createReadStream(path.join(__dirname, 'assets/audio.svg'),),
            mime: 'image/svg+xml'
        }));
    }

    if (type === fileType.DIR) {
        return new Promise((resolve, _) => resolve({
            stream: fs.createReadStream(path.join(__dirname, 'assets/storage.svg'),),
            mime: 'image/svg+xml'
        }));
    }

    return new Promise((resolve, _) => resolve({
        stream: fs.createReadStream(defaultFile),
        mime: 'image/svg+xml'
    }));
}

module.exports = { getFilePreviewThumb };