<template>
  <div class="container">
    <div class="content">
      <div class="title">关于口琴之家</div>
      <div class="body">
        Hi! 口琴爱好者，欢迎你来到口琴之家！\n\n
        这里是口琴爱好者聚集的地方，在这里你可以随时查看乐理以及口琴吹奏的相关知识，你可以查找你想要吹奏的曲子简谱，你可以和志同道合的琴友交流你的口琴吹奏心得，
        还有一个曲谱转调的小工具，或许可以帮到你，小程序会在日后不断的进行完善，如果你有好的建议和想法，不妨通过 我的-反馈 将它告诉我，我会不断地优化小程序的使用体验。\n\n
        如果你觉得小程序有帮助到你，或者你觉得很赞，可以扫描赞赏码支持一下！\n\n
        不要在小程序内发布色情、暴力、恐怖信息、不要辱骂他人、不要发布广告。一旦发现违规用户，将进行禁言处理。\n\n
        小程序内所有教学资源来自网络，侵删。\n\n
        更多功能，我们一起期待！
      </div>
    </div>
  </div>
</template>

<script>
export default {
    mpType: 'page',

    config: {
        navigationBarTitleText: '关于',
    },
    data() {
        return {};
    },
    computed: {},
    methods: {},

    mounted() {},
};
</script>

<style lang = "less" scoped>
.container {
    display: flex;
    justify-content: center;
    padding-top: 20px;
}
.content {
    padding: 20px;
    width: 335px;
    box-sizing: border-box;
    background-color: #fff;
    border-radius: 8px;
    .title {
        font-size: 16px;
        color: #8799a3;
        text-align: center;
    }
    .body {
        margin-top: 20px;
        white-space: pre-line;
        font-size: 14px;
        color: #666;
    }
}
</style>
