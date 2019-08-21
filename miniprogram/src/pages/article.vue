<template>
  <div class="container">
    <wemark :md="md" link type="wemark"></wemark>
  </div>
</template>

<script>
import db from '@/utils';

export default {
    mpType: 'page',

    config: {
        usingComponents: {
            wemark: '../../static/wemark/wemark',
        },
    },
    data() {
        return {
            md: '',
        };
    },

    methods: {},

    created() {},
    async mounted() {
        console.log(this.$root.$mp.query);
        const { id } = this.$root.$mp.query;
        try {
            const {
                data: { content, title },
            } = await db
                .collection('article')
                .doc(id)
                .get();

            this.md = content.replace(/\\n\\n/g, '\n\n');
            wx.setNavigationBarTitle({
                title,
            });
        } catch (e) {
            console.log(e);
        }
    },
};
</script>

<style lang="less" scoped>
.container {
    padding: 0 20px;
}
</style>
