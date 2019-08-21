<template>
  <!-- <formwrp> -->
  <div class="container">
    <div
      class="cu-card dynamic no-card margin-bottom"
      hover-class="hover-view"
      v-for="(post,index_) in posts"
      :key="post._id"
      @click="navPostDetail(post._id)"
    >
      <div class="cu-item shadow">
        <div class="cu-list menu-avatar">
          <div class="cu-item">
            <div
              class="cu-avatar round lg"
              :style="{'background-image':'url('+post.userInfo.avatarUrl+')'}"
            ></div>
            <div class="content flex-sub">
              <div>{{post.userInfo.nickName}}</div>
              <div class="text-gray text-sm flex justify-between">{{post.updatedAt}}</div>
            </div>
          </div>
        </div>
        <div class="text-title">{{post.title}}</div>
        <div class="text-content">{{post.content}}</div>
        <div
          class="grid flex-sub padding-lr"
          :class="post.imgs.length>1?'col-'+post.imgs.length+' grid-square':'grid-square col-2'"
        >
          <div
            class="bg-img img-wrp"
            v-for="(item,index) in post.imgs"
            :key="index"
            hover-stop-propagation
            @click.stop="previewImage(item,post.imgs)"
          >
            <img class="post-img" mode="aspectFill" :src="item" />
          </div>
        </div>
        <div v-if="post.record" hover-stop-propagation class="audio padding">
          <div
            class="sound"
            :class="{playing:post.isPlaying}"
            @click.stop="playRecord(post,index_)"
          >
            <img :src="post.isPlaying?'/static/img/sound-playing.gif':'/static/img/sound-line.png'" />
          </div>
          <div class="duration">56''</div>
        </div>
        <div class="text-gray text-sm text-right padding">
          <text class="cuIcon-attentionfill margin-lr-xs"></text>
          {{post.viewCount}}
          <text class="cuIcon-appreciatefill margin-lr-xs"></text>
          {{post.likeCount}}
          <text class="cuIcon-messagefill margin-lr-xs"></text>
          {{post.commentCount}}
        </div>
      </div>
    </div>
    <div class="write-wrp" v-if="!isReview">
      <navigator v-if="isLogin" class="write-btn" url="/pages/writePost">
        <img src="/static/img/write-btn.svg" />
      </navigator>
      <button v-else open-type="getUserInfo" @getuserinfo="handleUserInfo" class="write-btn">
        <img src="/static/img/write-btn.svg" />
      </button>
    </div>
  </div>
  <!-- </formwrp> -->
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import dayjs from 'dayjs';

import db, { showLoading, hideLoading } from '../utils';

export default {
    mpType: 'page',

    config: {
        navigationBarTitleText: '',
        enablePullDownRefresh: true,
        onReachBottomDistance: 150,
    },
    data() {
        return {
            isNoMore: false,
            ipp: 20,
            page: 1,
            isReview: false,
        };
    },
    computed: {
        ...mapState(['isLogin', 'posts', 'nextPage', 'isReview']),
    },

    methods: {
        ...mapMutations(['setIsLogin', 'setPosts', 'setNextPage', 'setUserInfo']),
        previewImage(img, imgs) {
            console.log('preview');
            wx.previewImage({
                urls: imgs,
                current: img,
            });
        },
        playRecord(post, index) {
            console.log('play audio', post.record);
            if (post.isPlaying) {
                this.recordAudioContext.stop();
                this.posts.forEach(item => {
                    // eslint-disable-next-line
                    item.isPlaying = false;
                });
                return;
            }
            this.recordAudioContext.src = post.record;
            this.recordAudioContext.play();
            this.posts.forEach((item, ind) => {
                if (ind !== index) {
                    // eslint-disable-next-line
                    item.isPlaying = false;
                } else {
                    // eslint-disable-next-line
                    item.isPlaying = true;
                }
            });
        },
        handleUserInfo(e) {
            console.log(e);
            if (/fail/.test(e.mp.detail.errMsg)) {
                wx.showToast({
                    icon: 'none',
                    title: '不授权无法发布帖子哦~',
                });
                return;
            }
            wx.setStorageSync('userinfo', e.mp.detail.userInfo);
            this.setUserInfo(e.mp.detail.userInfo);
            db.collection('user').add({
                data: {
                    userinfo: e.mp.detail.userInfo,
                },
                success: () => {
                    this.setIsLogin(true);
                    wx.navigateTo({
                        url: '/pages/writePost',
                    });
                },
                fail: err => {
                    console.log('err', err);
                },
            });
        },
        async fetchPosts() {
            showLoading();
            try {
                const {
                    result: { posts },
                } = await wx.cloud.callFunction({
                    name: 'getPosts',
                    // eslint-disable-next-line
                    data: { ipp: this.ipp, page: 1 },
                });
                // eslint-disable-next-line
                posts.map(post => {
                    // eslint-disable-next-line
                    post.updatedAt = dayjs(post.updatedAt).format('M-D H:mm');
                    // eslint-disable-next-line
                    post.createdAt = dayjs(post.createdAt).format('M-D H:mm');
                    // eslint-disable-next-line
                    post.isPlaying = false;
                });
                this.setPosts(posts);
            } catch (e) {
                console.log(e);
            } finally {
                hideLoading();
            }
        },
        navPostDetail(id) {
            wx.navigateTo({
                url: `/pages/postDetail?id=${id}`,
            });
        },
        async onPullDownRefresh() {
            await this.fetchPosts();
            wx.stopPullDownRefresh();
        },
        async onReachBottom() {
            if (this.isNoMore) return;
            showLoading();
            this.page = this.page + 1;
            const { ipp, page } = this;
            try {
                const {
                    result: { posts },
                } = await wx.cloud.callFunction({
                    name: 'getPosts',
                    data: { ipp, page },
                });
                if (posts.length < ipp) {
                    this.isNoMore = true;
                }
                // eslint-disable-next-line
                posts.map(post => {
                    // eslint-disable-next-line
                    post.updatedAt = dayjs(post.updatedAt).format('M-D H:m');
                    // eslint-disable-next-line
                    post.createdAt = dayjs(post.createdAt).format('M-D H:m');
                    // eslint-disable-next-line
                    post.isPlaying = false;
                });
                this.setPosts([...this.posts, ...posts]);
            } catch (e) {
                console.log(e);
            } finally {
                hideLoading();
            }
        },
    },

    async mounted() {
        if (!this.isReview) {
            this.fetchPosts();
        }
        this.recordAudioContext = wx.createInnerAudioContext();
        this.recordAudioContext.autoplay = true;
        this.recordAudioContext.onEnded(() => {
            this.posts.forEach(item => {
                // eslint-disable-next-line
                item.isPlaying = false;
            });
        });
    },
    onHide() {
        this.recordAudioContext.stop();
        this.posts.forEach(item => {
            // eslint-disable-next-line
            item.isPlaying = false;
        });
    },
    destroyed() {
        this.recordAudioContext.stop();
    },
};
</script>

<style lang="less" scoped>
.container {
    padding-bottom: 55px;
    background: #f5f5f5;
    .write-wrp {
        position: fixed;
        width: 50px;
        height: 50px;
        bottom: 80px;
        right: 15px;
        border: 2px solid #fff;
        border-radius: 50%;
        box-sizing: border-box;
        .write-btn {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background-color: #0081ff;
            padding: 0 14px;

            img {
                width: 100%;
                height: 100%;
            }
        }
    }
    .text-content {
        white-space: pre-line;
    }
    .img-wrp {
        border-radius: 3px;
    }
    .post-img {
        width: 100%;
        height: 100%;
    }
    .hover-view {
        opacity: 0.5;
    }
}
</style>
