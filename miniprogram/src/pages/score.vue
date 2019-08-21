<template>
  <div class="container">
    <div class="cu-bar search bg-white padding">
      <div class="search-form round">
        <text class="cuIcon-search"></text>
        <input
          :adjust-position="false"
          type="text"
          placeholder="输入曲谱名搜索"
          @input="handleInputChange"
          confirm-type="search"
        />
      </div>
      <div class="action">
        <button class="cu-btn bg-green shadow-blur round" @click="handleSearch">搜索</button>
      </div>
    </div>
    <div class="nav-list" v-if="result.length==0">
      <div
        class="nav-li"
        :class="'bg-'+item.color"
        :style="[{animation: 'show ' + ((index+1)*0.2+1) + 's 1'}]"
        v-for="(item,index) in songClasses"
        :key="index"
        @click="handleSongClassSearch(item.title)"
      >
        <div class="nav-title">{{item.title}}</div>
        <div class="nav-name">{{item.name}}</div>
        <text :class="'cuIcon-' + item.cuIcon"></text>
      </div>
      <!-- <navigator url="/pages/uploadScore" type="navigate" class="upload text-blue">上传谱子</navigator> -->
    </div>
    <div v-else class="cu-list menu card-menu margin-top padding flex-center">
      <div
        class="cu-item solid-bottom arrow text-df"
        v-for="score in result"
        :key="score._id"
        @click="navScoreDetail(score._id)"
      >{{score.name}}</div>
    </div>
  </div>
</template>

<script>
import db from '@/utils';

export default {
    mpType: 'page',

    config: {
        navigationBarTitleText: '曲谱',
    },
    data() {
        return {
            songClasses: [
                {
                    title: '热门',
                    name: 'hot',

                    color: 'red',
                    cuIcon: 'btn',
                },
                {
                    title: '儿歌',
                    name: 'children',
                    color: 'green',
                    cuIcon: 'loading2',
                },
                {
                    title: '流行',
                    name: 'popular',
                    color: 'cyan',
                    cuIcon: 'newsfill',
                },
                {
                    title: '古典',
                    name: 'classic',
                    color: 'blue',
                    cuIcon: 'colorlens',
                },
                {
                    title: 'ACG',
                    name: 'acg',
                    color: 'purple',
                    cuIcon: 'font',
                },
                {
                    title: '其他 ',
                    name: 'other',
                    color: 'mauve',
                    cuIcon: 'cuIcon',
                },
            ],
            searchValue: '',
            result: [],
        };
    },

    methods: {
        async handleSearch() {
            if (this.searchValue) {
                const { data } = await db
                    .collection('songscore')
                    .where({
                        name: db.RegExp({
                            regexp: this.searchValue,
                        }),
                    })
                    .get();
                this.result = data;
            } else {
                this.result = [];
            }
        },
        handleInputChange(e) {
            this.searchValue = e.mp.detail.value;
            this.handleSearch();
        },
        navScoreDetail(id) {
            wx.navigateTo({
                url: `/pages/scoreDetail?id=${id}`,
            });
        },
        async handleSongClassSearch(songClass) {
            const { data } = await db
                .collection('songscore')
                .where({
                    songClass,
                })
                .get();
            this.result = data;
        },
    },

    created() {},
};
</script>

<style lang="less" scoped>
.upload {
    width: 100%;
    font-size: 14px;
    text-align: center;
}
</style>
