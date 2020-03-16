/**
 * socket.js
 */
const net = require('net');
const http = require('http');

const server = http.createServer();
server.on('request', (req, res) => {
    console.log(req.url);
})
server.listen(8000);

const socket = net.createConnection({ host: '127.0.0.1', port: 8000 });
const data = Buffer.from(`GET https://fxcity.co.kr/ HTTP/1.1
Host: fxcity.co.kr:8000
Connection: keep-alive
Cache-Control: max-age=0
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9
Accept-Encoding: gzip, deflate
Accept-Language: zh-CN,zh;q=0.9

`);
socket.write(data);