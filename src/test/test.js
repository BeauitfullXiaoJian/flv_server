const path = require('path');
const { getFilePreviewThumb } = require('../preview');



const tempPath = path.join(__dirname, '../../temp');
const toolPath = {
    ffmpegPath: path.join(__dirname, '../../bin/ffmpeg/ffmpeg.exe'),
    gsPath: path.join(__dirname, '../../bin/gs/gswin64c.exe')
};
getFilePreviewThumb('E:\\Desktop\\区块链文章\\官方参考文档.pdf', tempPath, toolPath).then(stream => console.log(stream));

// const { dirSearch, dirAll } = require('../dir');
// console.log(dirAll('C:\\Users\\jian\\Desktop'));
// console.log(dirSearch('C:\\Users\\jian\\Desktop'));