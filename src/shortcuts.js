const execSync = require('child_process').execSync;
const iconv = require('iconv-lite');
const path = require('path');

function getCommand(lnkFile) {
    const normalizedFile = path.normalize(path.resolve(lnkFile))
    const getCOM = `(New-Object -COM WScript.Shell)`

    return `${getCOM}.CreateShortcut('${normalizedFile}').TargetPath;`
}

function getPath(lnkFile = '') {
    let commands = []

    if (process.platform !== 'win32') {
        return reject(new Error('Platform is not Windows'))
    }

    if (Array.isArray(lnkFile)) {
        for (const lnk of lnkFile) {
            commands.push(getCommand(lnk))
        }
    } else if (typeof lnkFile === 'string') {
        commands.push(getCommand(lnkFile))
    } else {
        console.log(typeof lnkFile)
        return reject(new Error('Input is neither string nor array!'))
    }
    let result = execSync(`powershell.exe -command "${commands.join('')}"`, { encoding: 'binary' });
    return iconv.decode(result, 'cp936');
}