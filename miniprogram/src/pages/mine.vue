<template>
  <div class="container">
    <van-tag>mine</van-tag>
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

    created() {},
};
</script>

<style scoped>
</style>
