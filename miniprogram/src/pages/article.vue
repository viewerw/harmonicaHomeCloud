<template>
  <div class="container">
    <wemark :md="md" link type="wemark"></wemark>
  </div>
</template>

<script>
export default {
    mpType: 'page',

    config: {
        usingComponents: {
            wemark: '../../static/wemark/wemark',
        },
    },
    data() {
        return {
            md:
                '简谱起源于 18世纪的法国，在中国得到了最广泛的传播和使用。\n\n简谱是一种简易的记谱法，即利用一些数字记号或符号，将音的长短、高低、强弱、顺序记录下来。\n\n\t\n一份用简谱记录的谱子，应该包括调号、拍号、音符和小节、小节线、终止线等最基本的记号或符号。下面我们以贝多芬的《欢乐颂》为例来认识简谱的基本构成。\n\n\t\t\t\n欢乐颂![](cloud://production-emhx9.7072-production-emhx9/article/WechatIMG333.jpeg)',
        };
    },

    methods: {},

    created() {},
};
</script>

<style lang="less" scoped>
.container {
    padding: 0 20px;
}
</style>
