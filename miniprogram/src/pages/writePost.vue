<template>
  <div class="container">
    <div class="bg-white flex justify-end">
      <button class="cu-btn margin-right bg-blue shadow" @click="post">发送</button>
    </div>
    <form>
      <div class="cu-form-group margin-top">
        <input placeholder="标题" maxlength="30" @input="handleTitleChangle" />
      </div>
      <div class="cu-form-group margin-top">
        <textarea
          maxlength="-1"
          :disabled="modalName!=null"
          @input="handleContentChangle"
          placeholder="内容"
        ></textarea>
      </div>
      <div class="cu-bar bg-white margin-top">
        <div class="action">图片</div>
        <div class="action">{{imgList.length}}/3</div>
      </div>
      <div class="cu-form-group">
        <div class="grid col-4 grid-square flex-sub">
          <div
            class="bg-img"
            v-for="(item,index) in imgList"
            :key="index"
            @tap="divImage"
            :data-url="imgList[index]"
          >
            <img :src="imgList[index]" mode="aspectFill" />
            <div class="cu-tag bg-red" @tap.stop="DelImg" :data-index="index">
              <text class="cuIcon-close"></text>
            </div>
          </div>
          <div class="solids" @tap="ChooseImage" v-if="imgList.length<3">
            <text class="cuIcon-cameraadd"></text>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import db, { toast, uuidv4, showLoading, hideLoading } from '../utils';

export default {
    mpType: 'page',

    config: {
        navigationBarTitleText: '发表帖子',
    },
    data() {
        return {
            imgList: [],
            imgFileIds: [],
            title: '',
            content: '',
        };
    },
    computed: {
        ...mapState(['userInfo']),
    },
    methods: {
        ChooseImage() {
            wx.chooseImage({
                count: 3,
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
        divImage(e) {
            wx.predivImage({
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
        handleTitleChangle(e) {
            this.title = e.mp.detail.value;
        },
        handleContentChangle(e) {
            this.content = e.mp.detail.value;
        },
        async post() {
            if (this.imgList.length > 3) {
                toast('最多发布三张图片！');
                return;
            }
            if (!this.title.trim()) {
                toast('标题不能为空！');
                return;
            }
            showLoading('上传中...');
            // eslint-disable-next-line
            const uploads = this.imgList.map(
                img => {
                    const imgType = img.split('.')[img.split('.').length - 1];
                    return wx.cloud.uploadFile({
                        cloudPath: `post/${uuidv4()}.${imgType}`,
                        filePath: img,
                    });
                },
                // eslint-disable-next-line
            );
            const res = await Promise.all(uploads);
            console.log(res);
            const imgFileIds = res.map(r => r.fileID);
            this.imgFileIds = imgFileIds;
            try {
                await db.collection('post').add({
                    data: {
                        createdAt: db.serverDate(),
                        updatedAt: db.serverDate(),
                        userInfo: {
                            nickName: this.userInfo.nickName,
                            avatarUrl: this.userInfo.avatarUrl,
                        },
                        title: this.title,
                        content: this.content,
                        imgs: this.imgFileIds,
                        viewCount: 0,
                        likeCount: 0,
                        commentCount: 0,
                    },
                });
                toast('上传成功');
                Object.assign(this.$data, this.$options.data());
                wx.navigateBack();
            } catch (e) {
                console.log(e);
                toast('上传失败');
            } finally {
                hideLoading();
            }
        },
    },

    mounted() {},
    onUnload() {
        Object.assign(this.$data, this.$options.data());
    },
};
</script>

<style lang = "less" scoped>
.container {
    width: 100vw;
    height: 100vh;
    background-color: #f5f5f5;
}
</style>
