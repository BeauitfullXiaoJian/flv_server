
const fs = require('fs');
const path = require('path');
const { getPath } = require('./shortcuts');

const fileType = {
    DIR: 'dir',
    IMG: 'img',
    VIDEO: 'video',
    PDF: 'pdf',
    OTHER: 'other'
};
const fileExName = {
    IMG: ['.jpg', '.jpeg', '.gif', '.webp', '.png', '.bmp'],
    PDF: ['.pdf'],
    VIDEO: ['.mp4', '.flv', '.wmv']
}

/**
 * 获取一个文件夹中的所有文件，包括子文件
 * @param {string} dirPath 文件夹地址
 * @return {string[]} 文件地址列表
 */
function dirAll(dirPath) {
    const fileResult = [];
    const dirPathArray = fs.readdirSync(dirPath);
    dirPathArray.forEach(filePath => {
        filePath = path.join(dirPath, filePath);
        const stat = fs.statSync(filePath);
        filePath = stat.isDirectory() ? dirAll(filePath) : [filePath]
        fileResult.push(...filePath);
    });
    return fileResult;
}

function dirSearch(dirPath) {
    const dirPathArray = fs.readdirSync(dirPath);
    const searchResult = { dir: [], img: [], video: [], other: [] };
    dirPathArray.forEach(filePath => {
        filePath = path.join(dirPath, filePath);
        const type = checkFileType(filePath);
        searchResult[type[0]].push(type[1]);
    });
    return searchResult;
}

/**
 * 检查文件类型
 * @param {string} filePath 文件地址
 * @returns {string[]}
 */
function checkFileType(filePath) {
    const stat = fs.lstatSync(filePath);
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
            if (exName === '.lnk') {
                filePath = getPath(filePath);
                console.log(filePath)
                return [fileType.OTHER, filePath];
            }
            return [fileType.OTHER, filePath];
        }
    }
    return [fileType.OTHER, filePath];
}

module.exports = { dirAll, dirSearch, checkFileType, fileExName, fileType };