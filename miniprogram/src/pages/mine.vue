<template>
  <div class="container">
    <div class="user-info bg-white margin-bottom flex align-center">
      <div class="avatar-wrp">
        <open-data class="avatar" type="userAvatarUrl"></open-data>
      </div>
      <open-data class="nickname" type="userNickName"></open-data>
    </div>
    <div class="cu-list menu sm-border">
      <div class="cu-item arrow margin-bottom">
        <navigator class="content" hover-class="none" url="../list/list" open-type="redirect">
          <text class="cuIcon-repairfill text-orange"></text>
          <text class="text-grey">曲谱转调工具</text>
        </navigator>
      </div>
      <div class="cu-item arrow">
        <div class="content">
          <text class="cuIcon-moneybagfill text-red"></text>
          <text class="text-grey">给作者加油</text>
        </div>
      </div>
      <div class="cu-item arrow">
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
        <navigator class="content" hover-class="none" url="../list/list" open-type="redirect">
          <text class="cuIcon-tagfill text-purple"></text>
          <text class="text-grey">关于口琴之家</text>
        </navigator>
      </div>
    </div>
  </div>
</template>

<script>
export default {
    mpType: 'page',
    config: {
        navigationBarTitleText: '我',
    },
    data() {
        return {};
    },

    methods: {
        translate() {
            const re = /(\d|\(\d\)|\[\d\])/g;
            '2(3)[4]'.replace(re, (match, d) => {
                const s = `${d}`;
                if (s.length === 1) {
                    return s - 1;
                } else if (s.startsWith('(')) {
                    return `(${s.substr(1, 1) - 1})`;
                }
                return `[${s.substr(1, 1) - 1}]`;
            });
        },
    },

    mounted() {},
};
</script>

<style lang="less" scoped>
.container {
    background-color: #f5f5f5;
    position: absolute;
    width: 100vw;
    min-height: 100vh;
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
