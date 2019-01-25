# Example For Express Video Server

Support flv.js, ijkplayer

## Installation
```cmd
npm i
```

## Run
```cmd
node server.js

// or 
npm run start
```

## Usage 

### Video Source Dir && Get Video
1. You can put the video file into directory `public`
2. Request url like http://192.168.1.152:8000/flv?video=1.flv
 * 192.168.1.152:8000 ---- YOUR SEVER IP:PORT
 * 1.flv ---- A VIDEO IN PUBLIC DIRECTORY(`public/1.flv`)

### Get test flv vide
```cmd
// input: source.mp4
// output: test.flv
ffmpeg -i source.mp4 -vcodec libx264 -c:a aac -flvflags add_keyframe_index test.flv
```