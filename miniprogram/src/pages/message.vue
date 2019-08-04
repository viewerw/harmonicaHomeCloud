<template>
  <div class="container">
    <cu-custom bgcolor="bg-gradual-blue" :backType="backType" :back="handleBack">
      <block slot="backText">{{backType==='home'?'社区':''}}</block>
      <block slot="content">消息</block>
    </cu-custom>
    <van-tabs
      type="card"
      :active=" active "
      sticky
      swipeable
      @change="onChange"
      custom-class="my-message-tabs"
    >
      <van-tab title="回复帖子" :dot="messageType==='post'">
        <div class="cu-list menu-avatar comment solids-bottom" v-if="comments.length>0">
          <div
            class="cu-item"
            v-for="(comment,_index) in comments"
            :key="comment._id"
            @click="toPostDetail(comment.replyPostId)"
          >
            <div class="cu-avatar round" :style="{'background-image':'url('+comment.avatarUrl+')'}"></div>
            <div class="content">
              <div class="text-grey">{{comment.nickName}}</div>
              <div class="text-gray text-df">{{comment.createdAt}}</div>
              <div class="text-gray text-content text-df text-pre">{{comment.content}}</div>
              <div class="bg-grey padding-sm radius margin-top-sm text-sm">
                <div class="flex justify-between">
                  <div>回复我的主题帖</div>
                  <div class="post-title">{{comment.replyPostTitle}}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="empty flex flex-direction align-center justify-center">
          <text class="cuIcon-commentfill text-grey text-sl"></text>
          <text class="text-grey text-df">暂无消息</text>
        </div>
      </van-tab>
      <van-tab title="回复评论" :dot="messageType==='comment'">
        <div class="cu-list menu-avatar comment solids-bottom" v-if="replys.length>0">
          <div
            class="cu-item"
            v-for="(reply,_index) in replys"
            :key="reply._id"
            @click="toCommentDetail(reply.replyCommentId)"
          >
            <div class="cu-avatar round" :style="{'background-image':'url('+reply.avatarUrl+')'}"></div>
            <div class="content">
              <div class="text-grey">{{reply.nickName}}</div>
              <div class="text-gray text-df">{{reply.createdAt}}</div>
              <div class="text-gray text-content text-df text-pre">{{reply.content}}</div>
              <div class="bg-grey padding-sm radius margin-top-sm text-sm">
                <div class="flex justify-between">
                  <div>回复我的评论</div>
                  <div class="origin-content">{{reply.replyOriginContent}}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="empty flex flex-direction align-center justify-center">
          <text class="cuIcon-commentfill text-grey text-sl"></text>
          <text class="text-grey text-df">暂无消息</text>
        </div>
      </van-tab>
      <van-tab title="点赞" :dot="messageType==='like'">
        <div class="empty flex flex-direction align-center justify-center">
          <text class="cuIcon-commentfill text-grey text-sl"></text>
          <text class="text-grey text-df">暂无消息</text>
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import dayjs from 'dayjs';
import db, { showLoading, hideLoading } from '../utils';

export default {
    mpType: 'page',

    config: {
        navigationStyle: 'custom',
        usingComponents: {
            'van-tabs': 'vant-weapp/dist/tabs/index',
            'van-tab': 'vant-weapp/dist/tab/index',
        },
    },
    data() {
        return {
            backType: 'back',
            messageType: '',
            active: -1,
            comments: [],
            commentIpp: 20,
            commentPage: 0,
            replyPage: 0,
            replyIpp: 20,
            replys: [],
        };
    },
    computed: {
        ...mapState(['openid']),
    },
    watch: {
        async active(index) {
            console.log(index);
            if (index === 0) {
                const comments = await this.fetchComments(0, 10);
                this.comments = comments;
            } else if (index === 1) {
                const replys = await this.fetchReplys(0, 10);
                this.replys = replys;
            }
        },
    },
    methods: {
        ...mapMutations(['setNextPage']),
        handleBack() {
            if (this.backType === 'back') {
                wx.navigateBack();
            } else {
                wx.redirectTo({
                    url: '/pages/index?current=social',
                });
            }
        },
        onChange(e) {
            console.log(e);

            this.active = e.mp.detail.index;
        },
        async fetchComments(page = this.commentPage, ipp = this.commentIpp) {
            showLoading();
            try {
                const { data } = await db
                    .collection('comment')
                    .where({
                        replyUserOpenid: this.openid,
                    })
                    .orderBy('createdAt', 'desc')
                    .skip(page * ipp)
                    .limit(ipp)
                    .get();
                try {
                    const posts = await Promise.all(
                        data.map(comment =>
                            db
                                .collection('post')
                                .doc(comment.replyPostId)
                                .field({ title: true })
                                .get(),
                        ),
                    );
                    return data.map((comment, index) => ({
                        ...comment,
                        replyPostTitle: posts[index].data.title,
                        createdAt: dayjs(comment.createdAt).format('YYYY-MM-DD'),
                    }));
                } catch (e) {
                    return data.map(comment => ({
                        ...comment,
                        replyPostTitle: '',
                        createdAt: dayjs(comment.createdAt).format('YYYY-MM-DD'),
                    }));
                }
            } catch (e) {
                console.log(e);
            } finally {
                hideLoading();
            }
            return [];
        },
        async fetchReplys(page = this.replyPage, ipp = this.replyIpp) {
            showLoading();
            try {
                const { data } = await db
                    .collection('reply')
                    .where({
                        replyUserOpenid: this.openid,
                    })
                    .orderBy('createdAt', 'desc')
                    .skip(page * ipp)
                    .limit(ipp)
                    .get();
                console.log(data);
                const replys = await Promise.all(
                    data.map(reply => {
                        if (reply.replyReplyId) {
                            return db
                                .collection('reply')
                                .doc(reply.replyReplyId)
                                .field({
                                    content: true,
                                })
                                .get();
                        }
                        return db
                            .collection('comment')
                            .doc(reply.replyCommentId)
                            .field({ content: true })
                            .get();
                    }),
                );
                return data.map((comment, index) => ({
                    ...comment,
                    replyOriginContent: replys[index].data.content,
                    createdAt: dayjs(comment.createdAt).format('YYYY-MM-DD'),
                }));
            } catch (e) {
                console.log(e);
            } finally {
                hideLoading();
            }
            return [];
        },
        toPostDetail(postId) {
            // 是服务通知进来的
            if (this.messageType) {
                this.setNextPage(`/pages/postDetail?id=${postId}`);
                wx.redirectTo({
                    url: '/pages/index?current=social',
                });
            } else {
                wx.navigateTo({
                    url: `/pages/postDetail?id=${postId}`,
                });
            }
        },
        toCommentDetail(commentId) {
            console.log(commentId);
            wx.navigateTo({
                url: `/pages/commentDetail?id=${commentId}`,
            });
        },
    },

    mounted() {
        const { type } = this.$root.$mp.query;
        console.log('type', type);
        if (type) {
            this.backType = 'home';
        }
        this.messageType = type;
        if (type === 'comment') {
            this.active = 1;
        } else if (type === 'like') {
            this.active = 2;
        } else {
            this.active = 0;
        }
    },
    onUnload() {
        Object.assign(this.$data, this.$options.data());
    },
};
</script>

<style lang = "less" >
.container {
    width: 100vw;
    height: 100vh;
    background-color: #f5f5f5;

    .my-message-tabs {
        .van-tabs__scroll--card {
            border: none;
            background-color: #f5f5f5;
        }
        &.van-tabs--card {
            margin: 0;
        }
        .van-tabs__nav--card .van-tab {
            color: #999;
            border: none;
        }
        .van-tabs__nav--card .van-tab.van-tab--active {
            color: #333;
            font-weight: bold;
            background-color: #fff;
        }
    }
    .post-title,
    .origin-content {
        max-width: 150px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    .empty {
        margin-top: 100px;
    }
}
</style>
