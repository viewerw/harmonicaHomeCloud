<template>
  <div class="record-btns">
    <div class="re-record" @click="reRecord" :style="{display:recordComplete?'flex':'none'}">
      <div class="btn-m">
        <img src="/static/img/record-restart.png" />
      </div>
      <div class="hint">重录</div>
    </div>
    <div class="pre-listen" @click="preListen" :style="{display:recordComplete?'flex':'none'}">
      <div class="btn-m">
        <img :src="isRecordPlaying?'/static/img/record-stop.png':'/static/img/record-play.png'" />
      </div>
      <div class="hint">试听</div>
    </div>

    <div class="record" :style="{display:!recordComplete?'flex':'none'}">
      <div class="record-wrapper" @click="handleRecordClick">
        <div class="shadow-m" :class="{active:isRecordActive}"></div>
        <div class="shadow-s" :class="{active:isRecordActive}"></div>

        <div class="btn-m">
          <img src="/static/img/mic.png" />
        </div>
      </div>
      <div class="hint">{{isRecordActive?'停止录音':'开始录音'}}</div>
    </div>
    <!-- <div class="record-toast" v-if="isRecordActive">
      <img src="/static/img/recording.gif" />
      <span>正在录音，松开结束</span>
    </div>-->
  </div>
</template>
<script>
import { startRecord, stopRecord, getRecordAuth, setRecordAuth } from '@/utils/record';

const innerAudioContext = wx.createInnerAudioContext();
innerAudioContext.autoplay = true;
innerAudioContext.onError(error => console.log(error));
export default {
    data() {
        return {
            isRecordActive: false,
            recordComplete: false,
            tempFilePath: '',
            isRecordPlaying: false,
        };
    },
    methods: {
        onHide() {
            console.log('hide');
            Object.assign(this.$data, this.$options.data());
        },
        handleRecordClick() {
            if (this.isRecordActive) {
                this.handleRecordStop();
            } else {
                this.handleRecordStart();
            }
        },
        handleRecordStart() {
            console.log('record start');
            if (!getRecordAuth()) {
                console.log('no record auth');
                wx.authorize({
                    scope: 'scope.record',
                    success() {
                        setRecordAuth(true);
                    },
                });
                return;
            }
            startRecord(
                {
                    duration: 60000, // 最长时间30s
                    format: 'mp3',
                    numberOfChannels: 1, // 单通道
                    sampleRate: 16000, // 采样率16K https://github.com/oraleval/http_api_doc/blob/master/eval.md
                    encodeBitRate: 32000, // 比特率32kbps https://github.com/oraleval/http_api_doc/blob/master/eval.md
                },
                () => {
                    this.startTime = new Date().getTime();
                    this.isRecordActive = true;
                },
                ({ tempFilePath }) => {
                    console.log('tempfile', tempFilePath);
                    this.tempFilePath = tempFilePath;
                    this.isRecordActive = false;
                    this.recordComplete = true;
                    this.$emit('recordEnd', tempFilePath);
                },
            );
        },
        handleRecordStop() {
            if (!getRecordAuth()) {
                return;
            }
            this.endTime = new Date().getTime();
            if (this.endTime - this.startTime < 1000) {
                wx.showToast({
                    icon: 'none',
                    title: '录音时间太短啦',
                });
                this.isRecordActive = false;
                stopRecord(0, ({ tempFilePath }) => {
                    console.log('tempfile', tempFilePath);
                    this.tempFilePath = tempFilePath;
                });
            } else {
                this.isRecordActive = false;
                this.recordComplete = true;
                stopRecord();
            }
        },
        preListen() {
            if (this.isRecordPlaying) {
                innerAudioContext.stop();
                this.isRecordPlaying = false;
            } else {
                innerAudioContext.src = this.tempFilePath;
                innerAudioContext.play();
                this.isRecordPlaying = true;
            }
        },
        reRecord() {
            this.recordComplete = false;
            this.$emit('reRecord');
        },
    },
    mounted() {
        innerAudioContext.onStop(() => {
            this.isRecordPlaying = false;
        });
        innerAudioContext.onEnded(() => {
            this.isRecordPlaying = false;
        });
    },
};
</script>
<style lang="less" scoped>
.record-btns {
    width: 100%;
    height: 100%;
    padding: 6px 30px;
    font-size: 10px;
    color: #999999;
    box-sizing: border-box;
    display: flex;
    justify-content: space-around;
    align-items: flex-end;
    .pre-listen,
    .record,
    .re-record,
    .publish {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        align-items: center;
    }
    .record {
        .record-wrapper {
            position: relative;
            width: 44px;
            height: 44px;
            .btn-m {
                position: absolute;
                width: 100%;
                height: 100%;
                top: 0;
                left: 0;
            }
            .shadow-s,
            .shadow-m {
                position: absolute;
                width: 100%;
                height: 100%;
                top: 0;
                left: 0;
                border-radius: 50%;
            }
            .shadow-m {
                background-color: #fff6e4;
                &.active {
                    animation: shadow-m 2s ease infinite;
                }
            }
            .shadow-s {
                background-color: #ffe5b2;
                &.active {
                    animation: shadow-s 2s ease infinite;
                }
            }
        }
    }
    .pre-listen {
    }
    .btn-s,
    .btn-m {
        background-image: linear-gradient(to bottom, #fdca67, #e5b557);
        box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.1);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .btn-s {
        width: 36px;
        height: 36px;
        img {
            width: 22px;
            height: 22px;
        }
    }
    .btn-m {
        width: 44px;
        height: 44px;
        img {
            width: 24px;
            height: 24px;
        }
    }
    .hint {
        margin-top: 7px;
    }

    .record-toast {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 150px;
        height: 150px;
        opacity: 0.5;
        border-radius: 10px;
        background-color: #333333;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        z-index: 999;
        img {
            width: 90px;
            height: 90px;
        }
        span {
            font-size: 13px;
            letter-spacing: 0;
            color: #ffffff;
        }
    }
}
@keyframes shadow-s {
    50% {
        transform: scale(58/44, 58/44);
    }
    100% {
        transform: scale(1, 1);
    }
}
@keyframes shadow-m {
    50% {
        transform: scale(72/44, 72/44);
    }
    100% {
        transform: scale(1, 1);
    }
}
</style>
