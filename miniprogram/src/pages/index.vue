<template>
  <div class="container">
    <tutorial v-if="PageCur==='tutorial'"></tutorial>
    <score v-if="PageCur==='score'"></score>
    <social v-if="PageCur==='social'"></social>
    <mine v-if="PageCur==='mine'"></mine>
    <form reportSubmit @submit="formSubmit">
      <button form-type="submit" class="btn">
        <div class="cu-bar tabbar bg-white shadow foot">
          <div class="action" @click="NavChange" data-cur="tutorial">
            <div class="cuIcon-cu-image">
              <image
                :src="'/static/img/tutorial-bar' + [PageCur=='tutorial'?'-active':''] + '.png'"
              />
            </div>
            <div :class="PageCur=='basics'?'text-green':'text-gray'">教程</div>
          </div>
          <div class="action" @click="NavChange" data-cur="score">
            <div class="cuIcon-cu-image">
              <image :src="'/static/img/score-bar' + [PageCur == 'score'?'-active':''] + '.png'" />
            </div>
            <div :class="PageCur=='component'?'text-green':'text-gray'">曲谱</div>
          </div>
          <div v-if="!isReview" class="action" @click="NavChange" data-cur="social">
            <div class="cuIcon-cu-image">
              <image :src="'/static/img/social-bar' + [PageCur == 'social'?'-active':''] + '.png'" />
            </div>
            <div :class="PageCur=='plugin'?'text-green':'text-gray'">口琴交流</div>
          </div>
          <div class="action" @click="NavChange" data-cur="mine">
            <div class="cuIcon-cu-image">
              <image :src="'/static/img/mine-bar' + [PageCur == 'mine'?'-active':''] + '.png'" />
            </div>
            <div :class="PageCur=='plugin'?'text-green':'text-gray'">我的</div>
          </div>
        </div>
      </button>
    </form>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import formwrp from '../components/formWrp';

const TITLE = {
    tutorial: '教程',
    score: '曲谱',
    social: '口琴交流',
    mine: '我的',
};
export default {
    mpType: 'page',

    config: {
        enablePullDownRefresh: true,
        onReachBottomDistance: 150,
        usingComponents: {
            'van-tabs': 'vant-weapp/dist/tabs/index',
            'van-tab': 'vant-weapp/dist/tab/index',
        },
    },
    components: {
        formwrp,
    },
    data() {
        return {
            PageCur: 'tutorial',
        };
    },
    computed: {
        ...mapState(['nextPage', 'isReview']),
    },
    methods: {
        NavChange(e) {
            this.PageCur = e.currentTarget.dataset.cur;
            wx.setNavigationBarTitle({
                title: TITLE[this.PageCur],
            });
        },
        formSubmit(e) {
            const { formId } = e.mp.detail;
            if (formId) {
                const formIds = wx.getStorageSync('formIds');
                console.log(formId);
                // the formId is not  a mock one
                if (!/mock/.test(formId)) {
                    const formIdsCalc = formIds ? formIds.concat(formId) : [formId];
                    wx.setStorage({
                        key: 'formIds',
                        data: formIdsCalc,
                    });
                }
            }
        },
    },

    async mounted() {
        const { current } = this.$root.$mp.query;
        if (current) {
            this.PageCur = current;
        }

        wx.setNavigationBarTitle({
            title: TITLE[this.PageCur],
        });
        // const { data } = await db
        //     .collection('review')
        //     .doc('d119ef8d-95f9-4938-a31c-582a716ba59a')
        //     .get();
        // console.log('review', data);
        // this.isReview = pkg.version === data.version && data.isreview;
        if (this.nextPage) {
            wx.navigateTo({
                url: this.nextPage,
            });
            this.setNextPage('');
        }
    },
    onPullDownRefresh() {
        if (this.PageCur === 'social') {
            this.$children[0].onPullDownRefresh();
        } else {
            wx.stopPullDownRefresh();
        }
    },
    onReachBottom() {
        if (this.PageCur === 'social') {
            this.$children[0].onReachBottom();
        }
    },
};
</script>

<style lang = "less" scoped>
.btn {
    font-size: initial;
    text-align: initial;
    color: initial;
    margin: 0;
    padding: 0;
    background: transparent;
    overflow: visible;
    border: none;
    line-height: initial;

    &::after {
        border: none;
    }
}
</style>
