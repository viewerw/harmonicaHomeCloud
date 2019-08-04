
<script>
import { mapActions, mapState } from 'vuex';
import db, { _ } from '@/utils';

export default {
    globalConfig: {
        usingComponents: {
            'van-tag': 'vant-weapp/dist/tag/index',
        },
    },
    computed: {
        ...mapState(['openid']),
    },
    methods: {
        ...mapActions(['initLogin', 'initReview']),
    },
    created() {
        this.initLogin();
        this.initReview();
    },
    mounted() {
        wx.getSystemInfo({
            success: e => {
                global.StatusBar = e.statusBarHeight;
                const custom = wx.getMenuButtonBoundingClientRect();
                global.Custom = custom;
                const temp = custom.bottom + custom.top;
                global.CustomBar = temp - e.statusBarHeight;
            },
        });
    },
    async onHide() {
        let formIds = wx.getStorageSync('formIds');
        if (formIds && formIds.length > 20) {
            formIds = formIds.slice(0, 20);
        }
        if (formIds && formIds.length > 0) {
            const { data } = await db
                .collection('formid')
                .where({ _openid: this.openid })
                .get();
            if (data.length === 0) {
                db.collection('formid').add({
                    data: { formIds },
                });
            } else if (data.length > 20) {
                db
                    .collection('formid')
                    .doc(data[0]._id)
                    .update({
                        data: { formIds: _.set(formIds) },
                    });
            } else {
                db
                    .collection('formid')
                    .doc(data[0]._id)
                    .update({
                        data: { formIds: _.push(formIds) },
                    });
            }
        }
        wx.setStorage({
            key: 'formIds',
            data: [],
        });
    },
};
</script>

<style lang="less">
@import 'colorui/main.css';
@import 'colorui/icon.css';

@primary: #0081ff;

.container {
    width: 100vw;
}

.van-tabs__line {
    background-color: @primary !important;
}
.active-tab {
    color: @primary !important;
}
.my-van-nav {
    color: #333333;
    background: #f5f5f5;
    border: none;
}
.cu-list.menu-avatar > .cu-item:after {
    border: none !important;
}
/* this rule will be remove */
* {
    transition: width 2s;
    -moz-transition: width 2s;
    -webkit-transition: width 2s;
    -o-transition: width 2s;
}
button {
    &::after {
        border: none;
    }

    &.button-hover {
        color: #fff;
    }
}

page {
    background: #f5f5f5;
    background-size: cover;
    background-attachment: fixed;
}
.nav-list {
    display: flex;
    flex-wrap: wrap;
    padding: 0px 40rpx 0px;
    justify-content: space-between;
}
.nav-li {
    padding: 30rpx;
    border-radius: 12rpx;
    width: 45%;
    margin: 0 2.5% 40rpx;
    background-image: url(https://cdn.nlark.com/yuque/0/2019/png/280374/1552996358352-assets/web-upload/cc3b1807-c684-4b83-8f80-80e5b8a6b975.png);
    background-size: cover;
    background-position: center;
    position: relative;
    z-index: 1;
}
.nav-li::after {
    content: '';
    position: absolute;
    z-index: -1;
    background-color: inherit;
    width: 100%;
    height: 100%;
    left: 0;
    bottom: -10%;
    border-radius: 10rpx;
    opacity: 0.2;
    transform: scale(0.9, 0.9);
}
.nav-li.cur {
    color: #fff;
    background: rgb(94, 185, 94);
    box-shadow: 4rpx 4rpx 6rpx rgba(94, 185, 94, 0.4);
}
.nav-title {
    font-size: 32rpx;
    font-weight: 300;
}
.nav-title::first-letter {
    font-size: 40rpx;
    margin-right: 4rpx;
}
.nav-name {
    font-size: 28rpx;
    text-transform: Capitalize;
    margin-top: 20rpx;
    position: relative;
}
.nav-name::before {
    content: '';
    position: absolute;
    display: block;
    width: 40rpx;
    height: 6rpx;
    background: #fff;
    bottom: 0;
    right: 0;
    opacity: 0.5;
}
.nav-name::after {
    content: '';
    position: absolute;
    display: block;
    width: 100rpx;
    height: 1px;
    background: #fff;
    bottom: 0;
    right: 40rpx;
    opacity: 0.3;
}
.nav-name::first-letter {
    font-weight: bold;
    font-size: 36rpx;
    margin-right: 1px;
}
.nav-li text {
    position: absolute;
    right: 30rpx;
    top: 30rpx;
    font-size: 52rpx;
    width: 60rpx;
    height: 60rpx;
    text-align: center;
    line-height: 60rpx;
}
.text-light {
    font-weight: 300;
}
@keyframes show {
    0% {
        transform: translateY(-50px);
    }
    60% {
        transform: translateY(40rpx);
    }
    100% {
        transform: translateY(0px);
    }
}
@-webkit-keyframes show {
    0% {
        transform: translateY(-50px);
    }
    60% {
        transform: translateY(40rpx);
    }
    100% {
        transform: translateY(0px);
    }
}
</style>
