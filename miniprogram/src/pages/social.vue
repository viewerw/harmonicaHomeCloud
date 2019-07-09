<template>
  <div class="container">
    <div
      class="cu-card dynamic no-card margin-bottom"
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
          <div class="bg-img img-wrp" v-for="(item,index) in post.imgs" :key="index">
            <img class="post-img" mode="aspectFill" :src="item" />
          </div>
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
    <div class="write-wrp">
      <navigator v-if="isLogin" class="write-btn" url="/pages/writePost">
        <img src="/static/img/write-btn.svg" />
      </navigator>
      <button v-else open-type="getUserInfo" @getuserinfo="handleUserInfo" class="write-btn">
        <img src="/static/img/write-btn.svg" />
      </button>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import db from '@/utils';
import dayjs from 'dayjs';

export default {
    mpType: 'page',

    config: {
        navigationBarTitleText: '社区',
        enablePullDownRefresh: true,
        onReachBottomDistance: 150,
    },
    data() {
        return {
            isNoMore: false,
            ipp: 20,
            page: 1,
        };
    },
    computed: {
        ...mapState(['isLogin', 'posts']),
    },

    methods: {
        ...mapMutations(['setIsLogin', 'setPosts']),
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
                });
                this.setPosts(posts);
            } catch (e) {
                console.log(e);
            }
        },
        navPostDetail(id) {
            wx.navigateTo({
                url: `/pages/postDetail?id=${id}`,
            });
        },
    },
    async onPullDownRefresh() {
        await this.fetchPosts();
        wx.stopPullDownRefresh();
    },

    mounted() {
        this.fetchPosts();
    },
    async onReachBottom() {
        if (this.isNoMore) return;
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
            });
            this.setPosts([...this.posts, ...posts]);
        } catch (e) {
            console.log(e);
        }
    },
};
</script>

<style lang="less" scoped>
.container {
    background: #f5f5f5;
    .write-wrp {
        position: fixed;
        width: 50px;
        height: 50px;
        bottom: 30px;
        right: 15px;
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
}
</style>
