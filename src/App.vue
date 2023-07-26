<script>
export default {
  data() {
    return {
      recording: false,
      mediaRecorder: null,
      recordedChunks: [],
      videoURL: null,
      videoElement: null,
      isFullscreen: false,
    };
  },
  watch: {
    mediaRecorder(newVal, oldVal) {
      this.recording = !!newVal;
    },
  },
  mounted() {
    this.videoElement = this.$refs.videoPlayer;
  },
  methods: {
    async startRecording() {
      try {
        const constraints = {
          video: {
            width: {
              ideal: 1920,
              ideal: 1080,
            },
          },
          audio: true,
        };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        this.$refs.videoPlayer.srcObject = stream;
        this.recordedChunks = [];
        this.mediaRecorder = new MediaRecorder(stream, {
          mimeType: "video/webm",
          videoBitsPerSecond: 8000 * 1000,
        });
        this.mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            this.recordedChunks.push(event.data);
          }
        };
        this.mediaRecorder.onstop = () => {
          const blob = new Blob(this.recordedChunks, { type: "video/webm" });
          const url = URL.createObjectURL(blob);
          console.log("Recording stopped:", url);
          this.videoURL = url;
        };

        this.mediaRecorder.start();
        this.recording = true;
      } catch (error) {
        console.error("Error accessing media devices:", error);
      }
    },
    stopRecording() {
      console.log("this.mediaRecorder :>> ", this.mediaRecorder);
      this.mediaRecorder.stop();
      this.recording = false;
    },
    downloadVideo() {
      const a = document.createElement("a");
      a.href = this.videoURL;
      a.setAttribute("download", "recorded_video.webm");
      a.click();
    },
    fullScreenClick() {
      const videoElement = this.videoElement;
      if (videoElement.requestFullscreen) {
        videoElement.requestFullscreen();
      } else if (videoElement.mozRequestFullScreen) {
        // 兼容 Firefox
        videoElement.mozRequestFullScreen();
      } else if (videoElement.webkitRequestFullscreen) {
        // 兼容 Chrome, Safari and Opera
        videoElement.webkitRequestFullscreen();
      } else if (videoElement.msRequestFullscreen) {
        // 兼容 IE/Edge
        videoElement.msRequestFullscreen();
      }
    },
  },
};
</script>

<template>
  <div class="container">
    <div class="video-container" ref="videoWrapper">
      <video ref="videoPlayer" class="video" autoplay></video>
      <div class="video-btns">
        <img
          @click="fullScreenClick"
          v-if="!isFullscreen"
          src="./assets/fullscreen.png"
          alt=""
        />
      </div>
    </div>
    <div class="btn-container">
      <button
        class="start-btn btn"
        @click="startRecording"
        :disabled="recording"
      >
        Start
      </button>
      <button
        class="stop-btn btn"
        @click="stopRecording"
        :disabled="!recording"
      >
        Stop
      </button>
      <button
        class="download-btn btn"
        ref="downloadButton"
        @click="downloadVideo"
        :disabled="!videoURL"
      >
        download
      </button>
    </div>
  </div>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
}

.container {
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 24px;
}
.video-container {
  /* width: 100vw;
  height: 100vh; */
  /* width: 50%; */
  width: 100%;
  margin: 20px auto;
  position: relative;
  width: 100%;
  padding-bottom: 50%;
  overflow: hidden; /* 隐藏超出容器的部分 */
}

.video-container .video {
  border-radius: 8px;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  object-fit: cover;
}

.video-btns {
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 30px;
  height: 30px;
}

.video-btns img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  image-rendering: pixelated;
}

.btn-container {
  position: fixed;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  column-gap: 10px;
}

.btn {
  padding: 10px 15px;
}
</style>
