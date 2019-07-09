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
          />
        </div>
        <div class="text-gray text-sm text-right padding flex tools">
          <div @click="handleLikePost">
            <text
              class="cuIcon-appreciatefill circle margin-lr-xs"
              :class="{'liked':post.isLike,'text-grey':!post.isLike}"
            ></text>
            <text>{{post.likeCount}}</text>
          </div>
          <div class="text-grey">
            <text class="cuIcon-favorfill circle margin-lr-xs"></text>
            <text>收藏</text>
          </div>
          <button class="text-grey share" open-type="share">
            <text class="cuIcon-forwardfill circle margin-lr-xs"></text>
            <text>转发</text>
          </button>
        </div>
      </div>
    </div>

    <div class="cu-list menu-avatar comment solids-top">
      <div
        class="cu-item"
        v-for="(comment,_index) in comments"
        :key="comment._id"
        @click="replyComment(comment._id,comment.nickName)"
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
              @click.stop="replyReply(comment._id,reply._id,reply.nickName)"
            >
              <div>{{reply.nickName}}：</div>
              <div class="flex-sub">{{reply.content}}</div>
            </div>
          </div>
          <div class="margin-top-sm flex justify-between">
            <div class="text-gray text-df">{{comment.createdAt}}</div>
            <div style="padding:10rpx 20rpx;" @click.stop="handleLikeComment(comment._id)">
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
import db, { _ } from '@/utils';

export default {
    mpType: 'page',

    config: {
        enablePullDownRefresh: true,
        onReachBottomDistance: 150,
    },
    data() {
        return {
            post: { userInfo: {}, imgs: [] },
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
            currentReplyReplyId: '',
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
        async sendComment(e) {
            if (e.mp.detail.value.input.trim() === '') {
                wx.showModal({
                    title: '提示',
                    content: '评论的内容不能为空哦',
                });
                return;
            }

            try {
                wx.showLoading({
                    title: '发送中...',
                    mask: true,
                });
                const params = {
                    nickName: this.userInfo.nickName,
                    avatarUrl: this.userInfo.avatarUrl,
                    createdAt: new Date(),
                    content: e.mp.detail.value.input.trim(),
                    likeCount: 0,
                };
                if (this.replyType === 'post') {
                    params.replyPostId = this.post._id;

                    const { _id } = await db.collection('comment').add({
                        data: params,
                    });
                    params._id = _id;
                } else if (this.replyType === 'comment') {
                    params.replyCommentId = this.currentReplyCommentId;
                    params.content = `${this.inputPlacehodler}: ${params.content}`;
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
                    // todo:notify
                } else if (this.replyType === 'reply') {
                    params.replyCommentId = this.currentReplyCommentId;
                    params.replyReplyId = this.currentReplyReplyId;
                    params.content = `${this.inputPlacehodler} ${params.content}`;
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
                    // todo :notify
                }

                this.input = '';
                wx.hideLoading();
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
        async handleLogin(e) {
            if (/fail/.test(e.mp.detail.errMsg)) {
                wx.showToast({
                    icon: 'none',
                    title: '不授权无法发布评论哦~',
                });
                return;
            }
            if (this.input.trim() === '') {
                wx.showModal({
                    title: '提示',
                    content: '评论的内容不能为空哦',
                });
                return;
            }
            wx.setStorageSync('userinfo', e.mp.detail.userInfo);
            this.setUserInfo(e.mp.detail.userInfo);
            try {
                wx.showLoading({
                    title: '发送中...',
                    mask: true,
                });
                await db.collection('user').add({
                    data: {
                        userinfo: e.mp.detail.userInfo,
                    },
                });
                this.setIsLogin(true);
                const params = {
                    nickName: this.userInfo.nickName,
                    avatarUrl: this.userInfo.avatarUrl,
                    createdAt: new Date(),
                    content: e.mp.detail.value.input.trim(),
                    likeCount: 0,
                };
                if (this.replyType === 'post') {
                    params.replyPostId = this.post._id;

                    const { _id } = await db.collection('comment').add({
                        data: params,
                    });
                    params._id = _id;
                } else if (this.replyType === 'comment') {
                    params.replyCommentId = this.currentReplyCommentId;
                    params.content = `${this.inputPlacehodler}: ${params.content}`;
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
                    // todo:notify
                } else if (this.replyType === 'reply') {
                    params.replyCommentId = this.currentReplyCommentId;
                    params.replyReplyId = this.currentReplyReplyId;
                    params.content = `${this.inputPlacehodler} ${params.content}`;
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
                    // todo :notify
                }

                this.input = '';
                wx.hideLoading();
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
            } else {
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
        replyComment(commentId, nickName) {
            console.log(commentId);
            this.currentReplyCommentId = commentId;
            this.inputPlacehodler = `回复${nickName}`;
            this.inputFocus = true;
            console.log('reply comment focus');
            this.replyType = 'comment';
        },
        replyReply(commentId, replyId, nickName) {
            this.currentReplyCommentId = commentId;
            this.currentReplyReplyId = replyId;
            this.inputPlacehodler = `回复${nickName}`;
            this.inputFocus = true;
            console.log('reply reply focus');
            this.replyType = 'reply';
        },

        handleInputBlur() {
            this.inputPlacehodler = '回复楼主';
            this.inputFocus = false;
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

    mounted() {
        const { id } = this.$root.$mp.query;
        db
            .collection('post')
            .doc(id)
            .update({ data: { viewCount: _.inc(1) } });
        this.post = { ...this.posts.find(post => post._id === id), isLike: false };
        this.fetchIsLikePost();
        this.fetchComments();
        console.log('post', this.post);
    },
    onUnload() {
        Object.assign(this.$data, this.$options.data());
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
        color: #e54d42;
        border: 1px solid #e54d42;
    }
}
.comment-liked {
    color: #e54d42;
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
