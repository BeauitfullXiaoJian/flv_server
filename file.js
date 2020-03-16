const fs = require('fs');

function getDirFiles(dirName) {
    const files = [];
    fs.readdirSync(dirName).forEach(file => {
        let filePath = dirName + '/' + file;
        const stat = fs.statSync(filePath);
        filePath = stat.isDirectory() ? getDirFiles(filePath) : [filePath];
        files.push(...filePath);
    });
    return files;
}

module.exports = { getDirFiles }