
<script>
import env from '@config';

export default {
    globalConfig: {
        usingComponents: {
            'van-tag': 'vant-weapp/dist/tag/index',
        },
    },
    created() {
        if (!wx.cloud) {
            console.error('请使用 2.2.3 或以上的基础库以使用云能力');
        } else {
            console.log(env);
            wx.cloud.init({
                env,
                traceUser: true,
            });
        }
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
/* this rule will be remove */
* {
    transition: width 2s;
    -moz-transition: width 2s;
    -webkit-transition: width 2s;
    -o-transition: width 2s;
}
button {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    margin: 0;
    color: #fff;
    border-radius: 0;
    background-color: transparent;
    outline: none;
    transition: transform 0.1s ease;

    &::after {
        border: none;
    }

    &.button-hover {
        color: #fff;
    }
}

page {
    background: linear-gradient(to bottom, #fff, #edf2fd);
    background-size: cover;
    background-attachment: fixed;
}
</style>
