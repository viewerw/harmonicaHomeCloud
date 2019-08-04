<template>
  <div class="container">
    <form>
      <div class="cu-form-group">
        <textarea
          class="origin-textarea"
          maxlength="-1"
          :value="originTone"
          placeholder="示例：1(#5)[2]"
          @input="handleInput"
          :focus="isFocus"
        ></textarea>
      </div>
      <div class="flex align-center justify-between margin-sm">
        <picker @change="handleOriginChange" :value="originIndex" :range="toneList">
          <button class="cu-btn line-blue">原调:{{toneList[originIndex]}}</button>
        </picker>
        <picker @change="handleToChange" :value="changeIndex" :range="toneList">
          <button class="cu-btn line-blue">变调:{{toneList[changeIndex]}}</button>
        </picker>
        <!-- <button class="cu-btn line-blue" @click="handleShortKey">()</button> -->
        <button class="cu-btn bg-blue" @click="modifyTone">生成</button>
      </div>
      <div class="cu-form-group padding-top padding-bottom">
        <div class="result-tone">{{resultTone}}</div>
      </div>
      <button class="cu-btn block bg-blue margin-tb-sm lg" @click="handleCopy">复制到粘贴板</button>
    </form>
  </div>
</template>

<script>
export default {
    mpType: 'page',

    config: {},
    data() {
        return {
            originTone: '',
            modifiedTone: '',
            originIndex: 0,
            changeIndex: 0,
            resultTone: '',
            isFocus: false,
            toneList: ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'],
            allTone: [
                '(1)',
                '(#1)',
                '(2)',
                '(#2)',
                '(3)',
                '(4)',
                '(#4)',
                '(5)',
                '(#5)',
                '(6)',
                '(#6)',
                '(7)',
                '1',
                '#1',
                '2',
                '#2',
                '3',
                '4',
                '#4',
                '5',
                '#5',
                '6',
                '#6',
                '7',
                '[1]',
                '[#1]',
                '[2]',
                '[#2]',
                '[3]',
                '[4]',
                '[#4]',
                '[5]',
                '[#5]',
                '[6]',
                '[#6]',
                '[7]',
                '[[1]]',
            ],
        };
    },
    computed: {},
    methods: {
        handleOriginChange(e) {
            this.originIndex = e.mp.detail.value;
        },
        handleToChange(e) {
            this.changeIndex = e.mp.detail.value;
        },
        handleInput(e) {
            this.originTone = e.mp.detail.value;
            wx.getSelectedTextRange({
                complete: res => {
                    console.log('getSelectedTextRange res', res);
                },
            });
        },
        modifyTone() {
            const step = this.changeIndex - this.originIndex;
            if (step === 0) {
                this.resultTone = this.originTone;
                return;
            }

            const re = /(#?\d|\(#?\d\)|\[#?\d\])/g;
            this.resultTone = this.originTone.replace(re, (match, d) => {
                const s = `${d}`;

                const index = this.allTone.findIndex(tone => tone === s);
                if (index === -1) {
                    return '';
                }
                return this.allTone[index - step] || '';
            });
        },
        handleCopy() {
            wx.setClipboardData({
                data: this.resultTone,
                success() {
                    wx.showToast({ title: '复制成功！' });
                },
            });
        },
        handleShortKey() {
            this.isFocus = true;
            wx.getSelectedTextRange({
                complete: res => {
                    console.log('getSelectedTextRange res', res.start, res.end);
                },
            });
        },
    },

    mounted() {},
};
</script>

<style lang = "less" scoped>
.origin-textarea {
    border: 1px solid #f5f5f5;
    border-radius: 5px;
    padding: 10px;
    min-height: 200px;
    font-size: 13px;
}
.result-tone {
    border: 1px solid #f5f5f5;
    border-radius: 5px;
    padding: 10px;
    min-height: 200px;
    white-space: pre-line;
    width: 100%;
    font-size: 13px;
}
</style>
