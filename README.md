# Example For Express File Server

Support video, pdf, image.

## Run Environment

1. ffmpeg
2. imagemagick
3. ghostscript


## Installation
```
npm install
```

## Run
```
npm run start
```

### Express Api
1. `/dir` Get all files in the target directory.
2. `/file` Get all files in the public directory.
3. `/thumb` Get file's preview thumb.


<!-- ## Usage  -->

<!-- ### Video Source Dir && Get Video
1. You can put the video file into directory `public`
2. Request url like http://192.168.1.152:8000/flv?video=1.flv
 * 192.168.1.152:8000 ---- YOUR SEVER IP:PORT
 * 1.flv ---- A VIDEO IN PUBLIC DIRECTORY(`public/1.flv`)

### Get test flv video
```cmd
// input: source.mp4
// output: test.flv
ffmpeg -i source.mp4 -vcodec libx264 -c:a aac -flvflags add_keyframe_index test.flv
``` -->

