import { uuidv4 } from './index';

let recorderManager;
let onStopCallback;
let isRecording = false;
let stopRecordTimer;
let recordAuth = true;

const initRecordManager = () => {
    recorderManager = wx.getRecorderManager();
    recorderManager.onStop(async (...args) => {
        console.log('onStop');
        console.log(onStopCallback);
        clearTimeout(stopRecordTimer);
        try {
            await onStopCallback(...args);
        } finally {
            isRecording = false;
        }
    });
};

export const startRecord = (
    config = {
        duration: 60000, // 最长时间30s
        format: 'mp3',
        numberOfChannels: 1, // 单通道
        sampleRate: 16000, // 采样率16K https://github.com/oraleval/http_api_doc/blob/master/eval.md
        encodeBitRate: 32000, // 比特率32kbps https://github.com/oraleval/http_api_doc/blob/master/eval.md
    },
    startCallback = () => {},
    endCallback = () => {},
) => {
    if (isRecording) {
        return;
    }

    if (!recorderManager) {
        initRecordManager();
    }

    isRecording = true;
    console.log('true start');

    recorderManager.start(config);
    startCallback();
    onStopCallback = endCallback;
    // }
};

export const stopRecord = (times = 0, callback) => {
    if (times > 10) {
        return;
    }
    if (!isRecording) {
        return;
    }
    if (typeof callback === 'function') {
        onStopCallback = callback;
    }
    console.log('true end');
    recorderManager.stop();

    stopRecordTimer = setTimeout(() => {
        stopRecord(times + 1);
    }, 100);
};

export const uploadRecord = async tempFilePath => {
    const { fileID } = await wx.cloud.uploadFile({
        cloudPath: `audio/${uuidv4()}.mp3`,
        filePath: tempFilePath,
    });
    return fileID;
};
export const checkRecordAuth = () => {
    wx.getSetting({
        success(res) {
            if (!res.authSetting['scope.record']) {
                console.log('no auth record');
                recordAuth = false;
            }
        },
    });
};
export const setRecordAuth = val => {
    recordAuth = val;
};
export const getRecordAuth = () => recordAuth;
