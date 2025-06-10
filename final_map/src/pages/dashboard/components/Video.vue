<template>
    <div>
        <video ref="videoPlayer" width="640" height="360" controls :src="videoSrc" @play="onPlay" @pause="onPause"
            @ended="onEnded">
            您的浏览器不支持 HTML5 video 标签。
        </video>

        <div>
            <button @click="play">播放</button>
            <button @click="pause">暂停</button>
            <button @click="stop">停止</button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import video from "../images/video.mp4"
const videoSrc = ref(video);
const videoPlayer = ref(null);

const play = () => {
    videoPlayer.value.play();
};

const pause = () => {
    videoPlayer.value.pause();
};

const stop = () => {
    videoPlayer.value.pause();
    videoPlayer.value.currentTime = 0;
};

const onPlay = () => {
    console.log('视频开始播放');
};

const onPause = () => {
    console.log('视频已暂停');
};

const onEnded = () => {
    console.log('视频播放结束');
};
</script>