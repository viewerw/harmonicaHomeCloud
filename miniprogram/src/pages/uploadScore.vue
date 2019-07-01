<template>
  <div class="container">
    <form>
      <view class="cu-form-group margin-top">
        <view class="title">谱名</view>
        <input placeholder="谱名" @input="titleInput">
      </view>
      <view class="cu-form-group margin-top">
        <view class="title">分类</view>
        <picker @change="PickerChange" :value="classIndex" :range="picker">
          <view class="picker">{{classIndex>-1?picker[classIndex]:'选择曲谱类别'}}</view>
        </picker>
      </view>
      <view class="cu-bar bg-white margin-top">
        <view class="action">图片上传</view>
        <view class="action">{{imgList.length}}/4</view>
      </view>
      <view class="cu-form-group">
        <view class="grid col-4 grid-square flex-sub">
          <view
            class="bg-img"
            v-for="(item,index) in imgList"
            :key="index"
            @tap="ViewImage"
            :data-url="imgList[index]"
          >
            <img :src="imgList[index]" mode="aspectFill">
            <view class="cu-tag bg-red" @tap.stop="DelImg" :data-index="index">
              <text class="cuIcon-close"></text>
            </view>
          </view>
          <view class="solids" @tap="ChooseImage" v-if="imgList.length<4">
            <text class="cuIcon-cameraadd"></text>
          </view>
        </view>
      </view>
      <view class="cu-bar bg-white margin-top">
        <view class="action">数字曲谱</view>
      </view>
      <view class="cu-form-group">
        <textarea maxlength="-1" @input="textInput" placeholder="多行文本输入框"></textarea>
      </view>
      <view class="cu-bar bg-white margin-top">
        <view class="action">适合演奏的口琴</view>
      </view>
      <checkbox-group class="block padding" @change="CheckboxChange">
        <view class="cu-form-group">
          <view class="title">半音阶</view>
          <checkbox
            :class="checkbox[0].checked?'checked':''"
            :checked="checkbox[0].checked?true:false"
            value="半音阶"
          ></checkbox>
        </view>

        <view class="cu-form-group">
          <view class="title">复音</view>
          <checkbox
            :class="checkbox[1].checked?'checked':''"
            :checked="checkbox[1].checked?true:false"
            value="复音"
          ></checkbox>
        </view>
        <view class="cu-form-group">
          <view class="title">十孔</view>
          <checkbox
            :class="checkbox[2].checked?'checked':''"
            :checked="checkbox[2].checked?true:false"
            value="十孔"
          ></checkbox>
        </view>
      </checkbox-group>
      <view class="cu-bar bg-white margin-top">
        <view class="action">曲谱描述</view>
      </view>
      <view class="cu-form-group">
        <textarea maxlength="-1" @input="descriptionInput" placeholder="多行文本输入框"></textarea>
      </view>
      <view class="padding-xl">
        <div class="cu-btn block bg-blue margin-tb-sm lg" @click="handleSubmit">
          <text v-if="isLoading" class="cuIcon-loading2 cuIconfont-spin"></text>上传
        </div>
      </view>
    </form>
  </div>
</template>

<script>
import db from '@/utils';

export default {
    mpType: 'page',
    data() {
        return {
            formData: {},
            classIndex: -1,
            picker: ['ACG', '流行', '古典', '其他'],
            imgList: [],
            isLoading: false,
            checkbox: [
                {
                    value: '半音阶',
                    checked: true,
                },
                {
                    value: '复音',
                    checked: false,
                },
                {
                    value: '十孔',
                    checked: false,
                },
            ],
        };
    },

    methods: {
        PickerChange(e) {
            this.classIndex = e.mp.detail.value;
            this.formData.songClass = this.picker[e.mp.detail.value];
        },
        ChooseImage() {
            wx.chooseImage({
                count: 4,
                sizeType: ['original', 'compressed'],
                sourceType: ['album'],
                success: res => {
                    if (this.imgList.length !== 0) {
                        this.imgList = this.imgList.concat(res.tempFilePaths);
                    } else {
                        this.imgList = res.tempFilePaths;
                    }
                    console.log(this.imgList);
                },
            });
        },
        ViewImage(e) {
            wx.previewImage({
                urls: this.imgList,
                current: e.mp.currentTarget.dataset.url,
            });
        },
        DelImg(e) {
            wx.showModal({
                title: '提示',
                content: '确定要删除这张图片吗？',
                cancelText: '再看看',
                confirmText: '再见',
                success: res => {
                    if (res.confirm) {
                        this.imgList.splice(e.mp.currentTarget.dataset.index, 1);
                    }
                },
            });
        },
        CheckboxChange(e) {
            const items = this.checkbox;
            const values = e.mp.detail.value;
            this.formData = { ...this.formData, harmonicaType: values };
            // eslint-disable-next-line
            for (let i = 0, lenI = items.length; i < lenI; ++i) {
                items[i].checked = false;
                // eslint-disable-next-line
                for (let j = 0, lenJ = values.length; j < lenJ; ++j) {
                    if (items[i].value === values[j]) {
                        items[i].checked = true;
                        break;
                    }
                }
            }
        },
        titleInput(e) {
            this.formData = { ...this.formData, name: e.mp.detail.value };
        },
        textInput(e) {
            this.formData = { ...this.formData, text: e.mp.detail.value };
        },
        descriptionInput(e) {
            console.log(e.mp);
            this.formData = { ...this.formData, description: e.mp.detail.value };
        },

        uuidv4() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
                // eslint-disable-next-line
                const r = (Math.random() * 16) | 0;
                // eslint-disable-next-line
                const v = c === 'x' ? r : (r & 0x3) | 0x8;
                return v.toString(16);
            });
        },
        async handleSubmit() {
            this.isLoading = true;
            // eslint-disable-next-line
            const uploads = this.imgList.map(
                img => {
                    const imgType = img.split('.')[img.split('.').length - 1];
                    return wx.cloud.uploadFile({
                        cloudPath: `score/${this.uuidv4()}.${imgType}`,
                        filePath: img,
                    });
                },
                // eslint-disable-next-line
            );
            const res = await Promise.all(uploads);
            console.log(res);
            const imgFileIds = res.map(r => r.fileID);
            this.formData = { ...this.formData, imgs: imgFileIds };
            console.log(this.formData);
            try {
                await db.collection('songscore').add({
                    data: {
                        ...this.formData,
                        date: new Date(),
                        star: 0,
                        unstar: 0,
                        uper: 'viewerw',
                    },
                });
                wx.showToast({
                    icon: 'none',
                    title: '上传成功',
                });
                Object.assign(this.$data, this.$options.data());
            } catch (e) {
                console.log(e);
                wx.showToast({
                    icon: 'none',
                    title: '上传失败',
                });
            } finally {
                this.isLoading = false;
            }
        },
    },

    created() {},
};
</script>

<style lang = "less" scoped>
</style>
