<template>
  <div class="container">
    <van-tabs :active=" active " sticky @change="onChange" tab-active-class="active-tab">
      <van-tab v-for="tutorial in tutorials" :title="tutorial.title" :key="tutorial.id">
        <div
          class="article solid-bottom text-df padding-sm"
          v-for="(article,idx) in articles"
          :key="article.id"
          @click="navArticle(article._id)"
        >{{idx+1}}.{{article.title}}</div>
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
        navigationBarTitleText: '教程',
        usingComponents: {
            'van-tabs': 'vant-weapp/dist/tabs/index',
            'van-tab': 'vant-weapp/dist/tab/index',
        },
    },
    data() {
        return {
            tutorials: [],
            articles: [],
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
        navArticle(id) {
            wx.navigateTo({
                url: `/pages/article?id=${id}`,
            });
        },
    },

    created() {},
    async mounted() {
        try {
            const { data } = await db.collection('tutorials').get();
            this.tutorials = data;
            // eslint-disable-next-line
            console.log(data[0]._id);
            const {
                result: { articles },
            } = await wx.cloud.callFunction({
                name: 'getTutorialArticles',
                // eslint-disable-next-line
                data: { id: data[0]._id },
            });
            this.articles = articles;
            console.log(articles);
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
