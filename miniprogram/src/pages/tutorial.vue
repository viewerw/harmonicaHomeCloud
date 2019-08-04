<template>
  <div class="container">
    <van-tabs :active=" active " sticky @change="onChange" tab-active-class="active-tab">
      <van-tab title="基本乐理">
        <div
          class="article solid-bottom text-lg padding-sm"
          v-for="(article,idx) in basicArticles"
          :key="article.id"
          @click="navArticle(article.id)"
        >{{num[idx]}}. {{article.title}}</div>
      </van-tab>
      <van-tab title="复音">
        <div
          class="article solid-bottom text-lg padding-sm"
          v-for="(article,idx) in doubleArticles"
          :key="article.id"
          @click="navArticle(article.id)"
        >{{num[idx]}}. {{article.title}}</div>
      </van-tab>
      <van-tab title="半音阶">
        <div
          class="article solid-bottom text-lg padding-sm"
          v-for="(article,idx) in halfArticles"
          :key="article.id"
          @click="navArticle(article.id)"
        >{{num[idx]}}. {{article.title}}</div>
      </van-tab>
      <van-tab title="十孔">
        <div
          class="article solid-bottom text-lg padding-sm"
          v-for="(article,idx) in blueArticles"
          :key="article.id"
          @click="navArticle(article.id)"
        >{{num[idx]}}. {{article.title}}</div>
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
    },
    data() {
        return {
            num: [
                '一',
                '二',
                '三',
                '四',
                '五',
                '六',
                '七',
                '八',
                '九',
                '十',
                '十一',
                '十二',
                '十三',
                '十四',
                '十五',
                '十六',
                '十七',
                '十八',
                '十九',
                '二十',
            ],
            tutorials: [],
            basicArticles: [],
            doubileArticles: [],
            halfArticles: [],
            blueArticles: [],
            active: 0,
        };
    },

    methods: {
        async onChange(e) {
            const tabIndex = e.mp.detail.index;
            if (tabIndex === 1 && this.doubileArticles.length === 0) {
                const {
                    data: { articles },
                } = await db
                    .collection('tutorials')
                    .doc('106c5c86-40e6-44ab-bed5-208d3ea7b8d0')
                    .get();
                this.doubileArticles = articles;
            } else if (tabIndex === 2 && this.halfArticles.length === 0) {
                const {
                    data: { articles },
                } = await db
                    .collection('tutorials')
                    .doc('e3bfbcd2-4fb3-4fff-81c7-4689c7d8e509')
                    .get();
                this.halfArticles = articles;
            } else if (tabIndex === 3 && this.blueArticles.length === 0) {
                const {
                    data: { articles },
                } = await db
                    .collection('tutorials')
                    .doc('29afb9a7-bc4f-4b44-b796-8b767dac1241')
                    .get();
                this.blueArticles = articles;
            }
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
            const { data } = await db
                .collection('tutorials')
                .doc('990e2b05-3804-44ba-ac25-812f5b877a68')
                .get();
            this.basicArticles = data.articles;
        } catch (e) {
            console.log(e);
        }
    },
};
</script>

<style lang="less" scoped>
@primary: #0081ff;
.container {
    .article {
        color: #666;
    }
}
</style>
