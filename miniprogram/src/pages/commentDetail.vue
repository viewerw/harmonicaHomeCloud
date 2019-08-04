<template>
  <div class="container">
    <cu-custom bgcolor="bg-gradual-blue" :backType="backType" :back="handleBack">
      <block slot="content">查看原帖</block>
    </cu-custom>
    <div class="cu-list menu-avatar comment solids-top">
      <div class="cu-item" @click="replyComment">
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
            <!-- <div style="padding:10rpx 20rpx;" @click.stop="handleLikeComment(comment._id)">
            <text
              class="cuIcon-appreciatefill"
              :class="{'comment-liked':comment.isLike,'text-grey':!comment.isLike}"
            ></text>
            </div>-->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs';
import db, { _ } from '../utils';

export default {
    mpType: 'page',

    config: {
        navigationStyle: 'custom',
    },
    data() {
        return {
            comment: {},
            backType: 'back',
        };
    },

    methods: {
        handleBack() {
            wx.navigateBack();
        },
    },

    async mounted() {
        const { id } = this.$root.$mp.query;
        const { data: comment } = await db
            .collection('comment')
            .doc(id)
            .get();
        if (comment.replyIds.length > 0) {
            const { data: replys } = await db
                .collection('reply')
                .where({ _id: _.in(comment.replyIds) })
                .orderBy('createdAt', 'asc')
                .get();
            comment.replys = replys;
        }
        // eslint-disable-next-line
        comment.createdAt = dayjs(comment.createdAt).format('M-D H:mm');
        this.comment = comment;
    },
};
</script>

<style lang = "less" scoped>
</style>
