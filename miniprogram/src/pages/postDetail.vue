<template>
  <div class="container">
    <div class="cu-card dynamic no-card margin-bottom">
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
        <div class="text-content text-pre">{{post.content}}</div>
        <div class="grid flex-sub padding-lr">
          <img
            class="margin-bottom"
            style="width:100%"
            v-for="img in post.imgs"
            mode="widthFix"
            :src="img"
            :key="img"
            @click="previewImage(img)"
          />
        </div>
        <div v-if="post.record" hover-stop-propagation class="audio padding">
          <div
            class="sound"
            :class="{playing:post.isPlaying}"
            @click.stop="playRecord(post.record)"
          >
            <img :src="post.isPlaying?'/static/img/sound-playing.gif':'/static/img/sound-line.png'" />
          </div>
          <div class="duration">56''</div>
        </div>
        <div class="text-gray text-sm text-right padding flex tools">
          <div @click="handleLikePost">
            <text
              class="cuIcon-appreciatefill circle margin-lr-xs"
              :class="{'liked':post.isLike,'text-grey':!post.isLike}"
            ></text>
            <text>{{post.likeCount}}</text>
          </div>
          <div class="text-grey" @click="handleCollect">
            <text class="cuIcon-favorfill circle margin-lr-xs"></text>
            <text>收藏</text>
          </div>
          <button class="text-grey share" open-type="share">
            <text class="cuIcon-forwardfill circle margin-lr-xs"></text>
            <text>转发</text>
          </button>
          <div class="text-grey" v-if="userInfo.isAdmin" @click="deletePost">
            <text class="cuIcon-deletefill circle margin-lr-xs"></text>
            <text>删除</text>
          </div>
        </div>
      </div>
    </div>

    <div class="cu-list menu-avatar comment solids-top">
      <div
        class="cu-item"
        v-for="(comment,_index) in comments"
        :key="comment._id"
        @click="replyComment(comment)"
      >
        <div class="cu-avatar round" :style="{'background-image':'url('+comment.avatarUrl+')'}"></div>
        <div class="content">
          <div class="text-grey">{{comment.nickName}}</div>
          <div class="text-gray text-content text-df text-pre">{{comment.content}}</div>
          <div
            class="bg-grey padding-sm radius margin-top-sm text-sm"
            v-if="comment.replys&&comment.replys.length>0"
          >
            <div
              class="flex"
              v-for="reply in comment.replys"
              :key="reply._id"
              @click.stop="replyReply(comment._id,reply)"
            >
              <div>{{reply.nickName}}：</div>
              <div class="flex-sub">{{reply.content}}</div>
            </div>
          </div>
          <div class="margin-top-sm flex justify-between">
            <div class="text-gray text-df">{{comment.createdAt}}</div>
            <div style="padding:10rpx 20rpx;" @click.stop="handleLikeComment(comment._id)">
              <text class="text-grey text-sm">{{comment.likeCount}}</text>
              <text
                class="cuIcon-appreciatefill"
                :class="{'comment-liked':comment.isLike,'text-grey':!comment.isLike}"
              ></text>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="textarea-wrp" v-show="inputFocus"></div>
    <form class="bottom-form" @submit="sendComment">
      <div
        class="bottom-input"
        :style="{height:inputHeight+'px','padding-bottom':textAreaPaddingBottom+'px'}"
      >
        <textarea
          class="input"
          :show-confirm-bar="false"
          :cursor-spacing="10"
          :auto-height="true"
          :focus="inputFocus"
          @blur="handleInputBlur"
          @focus="handleInputFocus"
          @linechange="lineChange"
          @input="handleInputChange"
          :value="input"
          name="input"
          :fixed="true"
          :placeholder="inputPlacehodler"
          placeholder-style="font-size:15px;color:#999999;"
        />
        <button
          v-if="isLogin"
          class="send"
          :style="{marginBottom:sendMarginBottom+'px'}"
          formType="submit"
        >
          <text class="cuIcon-forwardfill send margin-lr-xs"></text>
        </button>
        <button
          v-else
          class="send"
          :style="{marginBottom:sendMarginBottom+'px'}"
          open-type="getUserInfo"
          @getuserinfo="handleLogin"
        >
          <text class="cuIcon-forwardfill send margin-lr-xs"></text>
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import dayjs from 'dayjs';
import db, { _, showLoading, hideLoading } from '@/utils';

export default {
    mpType: 'page',

    config: {
        navigationBarTitleText: '主题帖',
        enablePullDownRefresh: true,
        onReachBottomDistance: 150,
    },
    data() {
        return {
            post: { userInfo: { avatarUrl: '' }, imgs: [] },
            textAreaPaddingBottom: 10,
            sendMarginBottom: 8,
            inputHeight: 32,
            inputFocus: false,
            input: '',
            postInput: '',
            commentInput: '',
            replyType: 'post', // post ,comment ,reply
            comments: [],
            inputPlacehodler: '回复楼主',
            currentReplyCommentId: '',
            currentReplyComment: {},
            currentReplyReplyId: '',
            currentReplyReply: {},
            ipp: 10,
            page: 1,
            isNoMore: false,
        };
    },
    computed: {
        ...mapState(['posts', 'isLogin', 'openid', 'userInfo']),
    },
    methods: {
        ...mapMutations(['setUserInfo', 'setIsLogin']),
        lineChange(e) {
            console.log('line', e);
            this.inputHeight = e.mp.detail.height + 22;
        },
        handleInputChange(e) {
            this.input = e.mp.detail.value;
        },
        previewImage(img) {
            wx.previewImage({
                urls: this.post.imgs,
                current: img,
            });
        },
        playRecord(audio) {
            if (this.post.isPlaying) {
                this.recordAudioContext.stop();
                this.post.isPlaying = false;
            } else {
                this.recordAudioContext.src = audio;

                this.post.isPlaying = true;
            }
        },
        deletePost() {
            wx.showModal({
                title: '提示',
                content: '确认删除吗？',
                success: async () => {
                    showLoading();
                    try {
                        await db
                            .collection('post')
                            .doc(this.post._id)
                            .remove();
                        wx.navigateBack();
                    } finally {
                        hideLoading();
                    }
                },
            });
        },
        handleCollect() {
            wx.showToast({
                title: '收藏成功！',
            });
        },
        async sendComment(e) {
            if (e.mp.detail.value.input.trim() === '') {
                wx.showModal({
                    title: '提示',
                    content: '评论的内容不能为空哦',
                });
                return;
            }
            this._sendComment();
        },
        async handleLogin(e) {
            if (/fail/.test(e.mp.detail.errMsg)) {
                wx.showToast({
                    icon: 'none',
                    title: '不授权无法发布评论哦~',
                });
                return;
            }

            wx.setStorageSync('userinfo', e.mp.detail.userInfo);
            this.setUserInfo(e.mp.detail.userInfo);
            try {
                await db.collection('user').add({
                    data: {
                        hasNewMessage: '', // 空、post ,comment,like
                        userinfo: e.mp.detail.userInfo,
                    },
                });
                this.setIsLogin(true);
                this._sendComment();
            } catch (err) {
                console.log(err);
            }
        },
        async _sendComment() {
            try {
                wx.showLoading({
                    title: '发送中...',
                    mask: true,
                });
                const params = {
                    nickName: this.userInfo.nickName,
                    avatarUrl: this.userInfo.avatarUrl,
                    createdAt: new Date(),
                    content: this.inputCache.trim(),
                    likeCount: 0,
                };
                if (this.replyType === 'post') {
                    params.replyPostId = this.post._id;
                    params.replyUserOpenid = this.post._openid;
                    const { _id } = await db.collection('comment').add({
                        data: params,
                    });
                    params._id = _id;
                    params._openid = this.openid;

                    // db
                    //     .collection('user')
                    //     .doc(this.post._openid)
                    //     .update({
                    //         hasNewMessage: 'post',
                    //     });
                    wx.cloud.callFunction({
                        name: 'openapi',
                        data: {
                            openid: this.post._openid,
                            action: 'sendTemplateMessage',
                            content: params.content,
                            username: params.nickName,
                            messageType: 'post',
                        },
                    });
                } else if (this.replyType === 'comment') {
                    params.replyCommentId = this.currentReplyCommentId;
                    params.content = `${this.inputPlacehodler}：${params.content}`;
                    params.replyUserOpenid = this.currentReplyComment._openid;
                    const { _id } = await db.collection('reply').add({
                        data: params,
                    });
                    db
                        .collection('comment')
                        .doc(this.currentReplyCommentId)
                        .update({
                            data: {
                                replyIds: _.push([_id]),
                            },
                        });
                    params._id = _id;
                    params._openid = this.openid;

                    // notify
                    // db
                    //     .collection('user')
                    //     .doc(this.currentReplyComment._openid)
                    //     .update({
                    //         hasNewMessage: 'comment',
                    //     });
                    wx.cloud.callFunction({
                        name: 'openapi',
                        data: {
                            openid: this.currentReplyComment._openid,
                            action: 'sendTemplateMessage',
                            content: params.content.split('：')[1],
                            username: params.nickName,
                            messageType: 'comment',
                        },
                    });
                } else if (this.replyType === 'reply') {
                    params.replyCommentId = this.currentReplyCommentId;
                    params.replyUserOpenid = this.currentReplyReply._openid;
                    params.replyReplyId = this.currentReplyReplyId;
                    params.content = `${this.inputPlacehodler}：${params.content}`;
                    const { _id } = await db.collection('reply').add({
                        data: params,
                    });
                    db
                        .collection('comment')
                        .doc(this.currentReplyCommentId)
                        .update({
                            data: {
                                replyIds: _.push([_id]),
                            },
                        });
                    params._id = _id;
                    params._openid = this._openid;
                    // todo :notify
                    // db
                    //     .collection('user')
                    //     .doc(this.currentReplyReply._openid)
                    //     .update({
                    //         hasNewMessage: 'comment',
                    //     });
                    wx.cloud.callFunction({
                        name: 'openapi',
                        data: {
                            openid: this.currentReplyReply._openid,
                            action: 'sendTemplateMessage',
                            content: params.content.split('：')[1],
                            username: params.nickName,
                            messageType: 'comment',
                        },
                    });
                }

                this.input = '';

                wx.showToast({
                    icon: 'none',
                    title: '评论成功！',
                });
                this.refreshComments(params, 'add');
            } catch (err) {
                console.log(err);
            } finally {
                wx.hideLoading();
            }
        },
        async fetchComments() {
            try {
                const {
                    result: { comments },
                } = await wx.cloud.callFunction({
                    name: 'getComments',
                    data: { ipp: this.ipp, page: 1, postId: this.post._id },
                });
                // eslint-disable-next-line
                comments.map(comment => {
                    // eslint-disable-next-line
                    comment.createdAt = dayjs(comment.createdAt).format('M-D H:mm');
                });
                this.comments = comments;
                if (comments.length < this.ipp) {
                    this.isNoMore = true;
                }
            } catch (e) {
                console.log(e);
            }
        },
        refreshComments(replyData, refreshType) {
            // eslint-disable-next-line
            replyData.createdAt = dayjs(replyData.createdAt).format('M-D H:mm');
            if (this.replyType === 'post' && this.isNoMore) {
                this.comments.push(replyData);
            } else if (this.replyReply !== 'post') {
                // eslint-disable-next-line
                const replyComment = this.comments.find(
                    comment => comment._id === this.currentReplyCommentId,
                    // eslint-disable-next-line
                );

                if (replyComment.replys) {
                    replyComment.replys.push(replyData);
                } else {
                    this.$set(replyComment, 'replys', [replyData]);
                }
            }
            if (refreshType === 'add') {
                this.post.commentCount += 1;
                db
                    .collection('post')
                    .doc(this.post._id)
                    .update({ data: { commentCount: _.inc(1) } });
            } else if (refreshType === 'del') {
                this.post.commentCount -= 1;
                db
                    .collection('post')
                    .doc(this.post._id)
                    .update({ data: { commentCount: _.inc(-1) } });
            }
        },
        async fetchIsLikePost() {
            try {
                const { data } = await db
                    .collection('like')
                    .where({
                        _openid: this.openid,
                        likePostId: this.post._id,
                    })
                    .get();
                console.log('data', data);
                this.post.isLike = data.length > 0;
            } catch (e) {
                console.log(e);
            }
        },
        async handleLikePost() {
            wx.vibrateShort();
            this.post.isLike = !this.post.isLike;
            if (this.post.isLike) {
                this.post.likeCount += 1;
                db
                    .collection('post')
                    .doc(this.post._id)
                    .update({
                        data: {
                            likeCount: _.inc(1),
                        },
                    });
                db.collection('like').add({
                    data: {
                        likePostId: this.post._id,
                        isLike: true,
                    },
                });
            } else {
                this.post.likeCount -= 1;
                db
                    .collection('post')
                    .doc(this.post._id)
                    .update({
                        data: {
                            likeCount: _.inc(-1),
                        },
                    });
                const { data } = await db
                    .collection('like')
                    .where({
                        _openid: this.openid,
                        likePostId: this.post._id,
                    })
                    .get();
                db
                    .collection('like')
                    .doc(data[0]._id)
                    .remove();
            }
        },
        async handleLikeComment(commentId) {
            wx.vibrateShort();
            console.log(commentId);
            const comment = this.comments.find(item => item._id === commentId);

            comment.isLike = !comment.isLike;
            if (comment.isLike) {
                comment.likeCount += 1;
                db
                    .collection('comment')
                    .doc(comment._id)
                    .update({
                        data: {
                            likeCount: _.inc(1),
                        },
                    });
                db.collection('like').add({
                    data: {
                        likeCommentId: comment._id,
                        isLike: true,
                    },
                });
            } else {
                comment.likeCount -= 1;
                db
                    .collection('comment')
                    .doc(comment._id)
                    .update({
                        data: {
                            likeCount: _.inc(-1),
                        },
                    });
                const { data } = await db
                    .collection('like')
                    .where({
                        _openid: this.openid,
                        likeCommentId: comment._id,
                    })
                    .get();
                db
                    .collection('like')
                    .doc(data[0]._id)
                    .remove();
            }
        },
        replyComment(comment) {
            this.currentReplyComment = comment;
            this.currentReplyCommentId = comment._id;
            this.inputPlacehodler = `回复${comment.nickName}`;
            this.inputFocus = true;
            console.log('reply comment focus');
            this.replyType = 'comment';
        },
        replyReply(commentId, reply) {
            this.currentReplyCommentId = commentId;
            this.currentReplyReplyId = reply._id;
            this.currentReplyReply = reply;
            this.inputPlacehodler = `回复${reply.nickName}`;
            this.inputFocus = true;
            console.log('reply reply focus');
            this.replyType = 'reply';
        },

        handleInputBlur() {
            this.inputPlacehodler = '回复楼主';
            this.inputFocus = false;
            this.inputCache = this.input;
            this.input = '';
        },
        handleInputFocus() {
            if (!this.inputFocus) {
                this.inputFocus = true;
                console.log('on focus');
                this.replyType = 'post';
            }
        },
    },

    async mounted() {
        const { id } = this.$root.$mp.query;
        db
            .collection('post')
            .doc(id)
            .update({ data: { viewCount: _.inc(1) } });
        this.post = {
            userInfo: { avatarUrl: '' },
            imgs: [],
            isPlaying: false,
            ...this.posts.find(post => post._id === id),
            isLike: false,
        };
        if (!this.post._id) {
            try {
                const { data } = await db
                    .collection('post')
                    .doc(id)
                    .get();
                // eslint-disable-next-line
                data.isPlaying = false;
                this.post = data;
            } catch (e) {
                wx.showModal({
                    title: '提示',
                    content: '帖子已被删除',
                    showCancel: false,
                    success() {
                        wx.navigateBack();
                    },
                });
            }
        }
        this.fetchIsLikePost();
        this.fetchComments();
        console.log('post', this.post);

        this.recordAudioContext = wx.createInnerAudioContext();
        this.recordAudioContext.autoplay = true;
        this.recordAudioContext.onEnded(() => {
            this.post.isPlaying = false;
        });
    },
    onUnload() {
        Object.assign(this.$data, this.$options.data());
        this.recordAudioContext.stop();
    },
    async onReachBottom() {
        if (this.isNoMore) return;
        console.log('bottom');
        this.page = this.page + 1;
        const { ipp, page } = this;
        try {
            const {
                result: { comments },
            } = await wx.cloud.callFunction({
                name: 'getComments',
                data: { ipp, page, postId: this.post._id },
            });
            if (comments.length < ipp) {
                this.isNoMore = true;
            }
            // eslint-disable-next-line
            comments.map(comment => {
                // eslint-disable-next-line
                comment.createdAt = dayjs(comment.createdAt).format('M-D H:mm');
            });
            this.comments = [...this.comments, ...comments];
        } catch (e) {
            console.log(e);
        }
    },
};
</script>

<style lang = "less" scoped>
.container {
    width: 100vw;
    min-height: 100vh;
    background-color: #f5f5f5;
    padding-bottom: 70px;
}
.textarea-wrp {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
}
.tools {
    padding: 10px 30px 20px;
    background-color: #fff;
    display: flex;
    justify-content: space-between;
}
.circle {
    border: 1px solid #8799a3;
    padding: 3px;
    font-size: 15px;

    border-radius: 50%;
    &.liked {
        color: #0081ff;
        border: 1px solid #0081ff;
    }
}
.comment-liked {
    color: #0081ff;
}
.share {
    margin: 0;
    padding: 0;
    font-size: inherit;
    background-color: transparent;
    line-height: normal;
    overflow: visible;
    border-radius: 0;
}
.bottom-form {
    width: 100vw;
    position: fixed;
    bottom: 0;
    left: 0;
    height: 48px;
    .send {
        color: #0081ff;
    }
}
.bottom-input {
    width: 100vw;
    position: fixed;
    bottom: 0;
    left: 0;
    height: 48px;
    background: #eeeeee;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    .input {
        width: 320px;
        background-color: #fff;
        padding: 3px;
        margin-bottom: 8px;
    }
    .send {
        margin: 0;
        margin-bottom: 8px;
        margin-left: 8px;
        padding: 0;
        border: none;
        width: 56rpx;
        height: 80rpx;
        line-height: 40px;
        background-color: #eeeeee;

        .icon {
            width: 100%;
            height: 100%;
        }
    }
}
.text-content {
    white-space: pre-line;
}
button::after {
    border: none;
}
</style>
