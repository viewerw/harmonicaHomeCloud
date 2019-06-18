<template>
  <div class="container">
    <van-tag>social</van-tag>
    <van-tag type="danger">标签</van-tag>
    <van-tag type="primary">标签</van-tag>
    <van-tag type="success">标签</van-tag>
  </div>
</template>

<script>
export default {
    mpType: 'page',
    usingComponents: {
        'van-tag': 'vant-weapp/dist/tag/index',
    },
    config: {
        navigationStyle: 'custom',
        navigationBarBackgroundColor: '#eee',
    },
    data() {
        return {};
    },

    methods: {},

    created() {},
};
</script>

<style scoped>
</style>
