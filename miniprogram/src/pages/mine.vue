<template>
  <div class="container">
    <div class="user-info bg-white margin-bottom flex align-center">
      <div class="avatar-wrp">
        <open-data class="avatar" type="userAvatarUrl"></open-data>
      </div>
      <open-data class="nickname" type="userNickName"></open-data>
    </div>
    <div class="cu-list menu sm-border">
      <div v-if="!isReview" class="cu-item arrow">
        <navigator class="content" hover-class="none" url="/pages/message" open-type="navigate">
          <text class="cuIcon-messagefill text-yellow"></text>
          <text class="text-grey" :class="{badge:hasNewMessage}">我的消息</text>
        </navigator>
      </div>
      <div class="cu-item arrow margin-bottom">
        <navigator
          class="content"
          hover-class="none"
          url="/pages/tonalModification"
          open-type="navigate"
        >
          <text class="cuIcon-repairfill text-orange"></text>
          <text class="text-grey">曲谱转调工具</text>
        </navigator>
      </div>
      <div class="cu-item arrow" @click="feedAuthor">
        <div class="content">
          <text class="cuIcon-moneybagfill text-red"></text>
          <text class="text-grey">给作者加油</text>
        </div>
      </div>
      <div v-if="!isReview" class="cu-item arrow" @click="wxGroup">
        <div class="content">
          <text class="cuIcon-group_fill text-cyan"></text>
          <text class="text-grey">口琴交流群</text>
        </div>
      </div>
      <div class="cu-item arrow">
        <button class="cu-btn content" open-type="feedback">
          <text class="cuIcon-commentfill text-olive"></text>
          <text class="text-grey">建议与反馈</text>
        </button>
      </div>
      <div class="cu-item arrow">
        <navigator class="content" hover-class="none" url="/pages/about" open-type="navigate">
          <text class="cuIcon-tagfill text-purple"></text>
          <text class="text-grey">关于口琴之家</text>
        </navigator>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import db from '@/utils';

export default {
    mpType: 'page',
    config: {
        navigationBarTitleText: '我',
    },
    data() {
        return {
            feedAuthorImage: '',
            wxGroupImage: '',
        };
    },
    computed: {
        ...mapState(['hasNewMessage', 'isReview']),
    },
    methods: {
        feedAuthor() {
            wx.previewImage({
                current: this.feedAuthorImage,
                urls: [this.feedAuthorImage],
            });
        },
        wxGroup() {
            wx.previewImage({
                current: this.wxGroupImage,
                urls: [this.wxGroupImage],
            });
        },
    },

    async mounted() {
        const { data } = await db
            .collection('config')
            .doc('7727324b-779c-441f-bccb-55cdbd5d01cd')
            .get();
        this.feedAuthorImage = data.feedAuthor;
        this.wxGroupImage = data.wxGroupImage;
    },
};
</script>

<style lang="less" scoped>
.container {
    background-color: #f5f5f5;
    position: absolute;
    width: 100vw;
    min-height: 100vh;
    .badge {
        position: relative;
        &:before {
            content: '';
            position: absolute;
            top: 4rpx;
            right: -20rpx;
            border-radius: 50%;
            display: block;
            margin: auto;
            width: 16rpx;
            height: 16rpx;
            background-color: #e54d42;
        }
    }
    .user-info {
        width: 100%;
        display: flex;
        align-items: center;
        padding: 10px;
        margin: 20px 0;
        .avatar-wrp {
            border-radius: 50%;
            width: 50px;
            height: 50px;
            overflow: hidden;
            margin-right: 15px;
            margin-left: 15px;
            .avatar {
                width: 50px;
                height: 50px;
            }
        }
        .nickname {
        }
    }
}
</style>
