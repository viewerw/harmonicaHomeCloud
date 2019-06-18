<template>
  <div class="container">
    <van-tabs :active=" active " sticky @change="onChange" tab-active-class="active-tab">
      <van-tab v-for="tutorial in tutorials" :title="tutorial.title" :key="tutorial.id">
        <div class="article"></div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import db from '@/utils';

export default {
    mpType: 'page',

    config: {
        // navigationStyle: 'custom',
        navigationBarBackgroundColor: '#fff',
        usingComponents: {
            'van-tabs': 'vant-weapp/dist/tabs/index',
            'van-tab': 'vant-weapp/dist/tab/index',
        },
    },
    data() {
        return {
            tutorials: [],
            active: 0,
        };
    },

    methods: {
        onChange(event) {
            wx.showToast({
                title: `切换到标签 ${event.mp.detail.index + 1}`,
                icon: 'none',
            });
        },
    },

    created() {},
    async mounted() {
        try {
            const { data } = await db.collection('tutorials').get();
            this.tutorials = data;
        } catch (e) {
            console.log(e);
        }
    },
};
</script>

<style lang="less" scoped>
@primary: #0081ff;
.container {
}
</style>
