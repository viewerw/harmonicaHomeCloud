<template>
  <div class="container">
    <div class="detail">
      <view class="cu-bar bg-white solid-bottom">
        <view class="action">
          <text class="cuIcon-title text-blue"></text>歌曲风格
        </view>
      </view>
      <view class="flex flex-wrap">
        <view class="padding-xs">
          <view class="cu-tag bg-cyan">{{scoreDetail.songClass}}</view>
        </view>
      </view>
      <view class="cu-bar bg-white solid-bottom" v-if="scoreDetail.harmonicaType">
        <view class="action">
          <text class="cuIcon-title text-blue"></text>适合演奏的口琴
        </view>
      </view>
      <view class="flex flex-wrap">
        <view class="padding-xs" v-for="(item,index) in scoreDetail.harmonicaType" :key="index">
          <view class="cu-tag light" :class="'bg-' + color[index]">{{item}}</view>
        </view>
      </view>
      <view class="cu-bar bg-white solid-bottom" v-if="scoreDetail.imgs&&scoreDetail.imgs.length>0">
        <view class="action">
          <text class="cuIcon-title text-blue"></text>曲谱（图片）
        </view>
      </view>
      <div>
        <img
          class="score-img padding-sm"
          v-for="(img,index) in scoreDetail.imgs"
          :key="index"
          :src="img"
          mode="widthFix"
        >
      </div>
      <view class="cu-bar bg-white solid-bottom" v-if="scoreDetail.text">
        <view class="action">
          <text class="cuIcon-title text-blue"></text>曲谱（数字）
        </view>
      </view>
      <div class="score-text padding-sm text-df">{{scoreDetail.text}}</div>
      <view class="cu-bar bg-white solid-bottom">
        <view class="action">
          <text class="cuIcon-title text-blue"></text>上传信息
        </view>
      </view>
      <div class="score-text padding-sm text-df">{{scoreDetail.uper}}({{scoreDetail.date}})</div>
      <view class="cu-bar bg-white solid-bottom" v-if="scoreDetail.description">
        <view class="action">
          <text class="cuIcon-title text-blue"></text>说明
        </view>
      </view>
      <div class="score-text padding-sm text-df">{{scoreDetail.description}}</div>
    </div>
  </div>
</template>

<script>
import db from '@/utils';
import dayjs from 'dayjs';

export default {
    mpType: 'page',
    config: {},
    data() {
        return {
            songClasses: [],
            types: [],
            scoreDetail: {},
            color: ['cyan', 'blue', 'purple', 'mauve'],
        };
    },

    methods: {},

    async mounted() {
        const { id } = this.$root.$mp.query;
        try {
            const { data } = await db
                .collection('songscore')
                .doc(id)
                .get();
            data.date = dayjs(data.date).format('YYYY-MM-DD');
            this.scoreDetail = data;
            wx.setNavigationBarTitle({
                title: data.name,
            });
        } catch (e) {
            console.log(e);
        }
    },
};
</script>

<style lang = "less" scoped>
.container {
    .score-img {
        width: 100%;
    }
    .score-text {
        white-space: pre;
    }
}
</style>
