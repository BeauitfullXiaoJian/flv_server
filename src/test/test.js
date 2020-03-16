const path = require('path');
const { getFilePreviewThumb } = require('../preview');



const tempPath = path.join(__dirname, '../../temp');
const toolPath = {
    ffmpegPath: path.join(__dirname, '../../bin/ffmpeg.exe')
};
getFilePreviewThumb('C:\\Users\\jian\\Desktop\\1.wmv', tempPath, toolPath).then(stream => console.log(stream));

// const { dirSearch, dirAll } = require('../dir');
// console.log(dirAll('C:\\Users\\jian\\Desktop'));
// console.log(dirSearch('C:\\Users\\jian\\Desktop'));