<template>
  <view>
    <view class="cu-custom" :style="[{height:CustomBar + 'px'}]">
      <view
        class="cu-bar fixed"
        :style="style"
        :class="[bgImage!=''?'none-bg text-white bg-img':'',bgcolor]"
      >
        <view class="action" @tap="back" v-if="backType==='back'">
          <text class="cuIcon-back"></text>
          <slot name="backText"></slot>
        </view>
        <view class="action" @tap="back" v-if="backType==='home'">
          <text class="cuIcon-home"></text>
          <slot name="homeText"></slot>
        </view>
        <view class="content" :style="[{top:StatusBar + 'px'}]">
          <slot name="content"></slot>
        </view>
        <slot name="right"></slot>
      </view>
    </view>
  </view>
</template>

<script>
export default {
    data() {
        return {
            StatusBar: global.StatusBar,
            CustomBar: global.CustomBar,
        };
    },
    name: 'cu-custom',
    computed: {
        style() {
            // var StatusBar = this.StatusBar;
            // var CustomBar = this.CustomBar;
            // var bgImage = this.bgImage;
            const { StatusBar, CustomBar, bgImage } = this;
            let style = `height:${CustomBar}px;padding-top:${StatusBar}px;`;
            if (this.bgImage) {
                style = `${style}background-image:url(${bgImage});`;
            }
            return style;
        },
    },
    props: {
        bgcolor: {
            type: String,
            default: '',
        },
        backType: {
            type: String,
            default: 'back',
        },
        bgImage: {
            type: String,
            default: '',
        },
        back: {
            type: Function,
            default: () =>
                wx.navigateBack({
                    delta: 1,
                }),
        },
    },
    methods: {},
};
</script>

<style>
</style>
