const { checkFileType, fileType } = require('./dir');
const path = require('path');
const fs = require('fs');
const mime = require('mime-types');
const execSync = require('child_process').execSync;
const { getPath } = require('./shortcuts');
const { Buffer } = require('buffer');
const sizeOf = require('image-size');

function getFileType(filePath, toolPath) {
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
        return [fileType.DIR, filePath];
    } else if (stat.isFile(filePath)) {
        let exName = path.extname(filePath);
        if (!exName) {
            return [fileType.OTHER, filePath];
        } else {
            exName = exName.toLowerCase();
            if (~fileExName.IMG.indexOf(exName)) {
                return [fileType.IMG, filePath];
            }
            if (~fileExName.VIDEO.indexOf(exName)) {
                return [fileType.VIDEO, filePath];
            }
            if (~fileExName.PDF.indexOf(exName)) {
                return [fileType.PDF, filePath];
            }
            if (~fileExName.MUSIC.indexOf(exName)) {
                return [fileType.MUSIC, filePath];
            }
            if (exName === '.lnk') {
                filePath = getPath(filePath);
                return getFileType(filePath, toolPath);
            }
            return [fileType.OTHER, filePath];
        }
    }
    return [fileType.OTHER, filePath];
}

// function getFilePreview(filePath) {
//     const fileReults = getFileType(filePath);
//     const tmpFile = path.join(tempPath, Buffer.from(filePath).toString('hex') + '.jpeg');

//     if(!fs.existsSync(tempPath)){

//     }

//     return new Promise((resolve, _) => resolve({
//         stream: fs.createReadStream(tmpFile),
//         mime: mime.lookup(tmpFile),
//         size: 
//     }));
// }

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

    // const tmpFile = path.join(tempPath, new Date().getTime() + '.jpeg');
    const tmpFile = path.join(tempPath, Buffer.from(filePath).toString('hex') + '.jpeg');

    if (fs.existsSync(tempPath)) {
        return new Promise((resolve, _) => resolve({
            stream: fs.createReadStream(tmpFile),
            mime: mime.lookup(tmpFile)
        }));
    }

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
        // execSync(`${toolPath.gsPath} -sDEVICE=jpeg -dFirstPage=1 -dLastPage=1 -sOutputFile=${tmpFile} ${filePath}`);
        // return new Promise((resolve, _) => resolve({
        //     stream: fs.createReadStream(tmpFile),
        //     mime: mime.lookup(tmpFile)
        // }));
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