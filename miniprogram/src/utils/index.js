import env from '@config';

if (!wx.cloud) {
    console.error('请使用 2.2.3 或以上的基础库以使用云能力');
} else {
    console.log(env);
    wx.cloud.init({
        env,
        traceUser: true,
    });
}
const db = wx.cloud.database();
export const toast = (title, icon = 'none') =>
    wx.showToast({
        icon,
        title,
    });
export const showLoading = (title = '', mask = true) =>
    wx.showLoading({
        mask,
        title,
    });
export const hideLoading = () => wx.hideLoading();
export const uuidv4 = () =>
    'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        // eslint-disable-next-line
        const r = (Math.random() * 16) | 0;
        // eslint-disable-next-line
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
export const _ = db.command;
export default db;

// "tabBar": {
//     "color": "#8799a3",
//     "selectedColor": "#0081ff",
//     "backgroundColor": "#ffffff",
//     "list": [
//         {
//             "pagePath": "pages/tutorial",
//             "text": "教程",
//             "iconPath": "/static/img/tutorial-bar.png",
//             "selectedIconPath": "/static/img/tutorial-bar-active.png"
//         },
//         {
//             "pagePath": "pages/score",
//             "text": "曲谱",
//             "iconPath": "/static/img/score-bar.png",
//             "selectedIconPath": "/static/img/score-bar-active.png"
//         },
//         {
//             "pagePath": "pages/social",
//             "text": "口琴交流",
//             "iconPath": "/static/img/social-bar.png",
//             "selectedIconPath": "/static/img/social-bar-active.png"
//         },
//         {
//             "pagePath": "pages/mine",
//             "text": "我的",
//             "iconPath": "/static/img/mine-bar.png",
//             "selectedIconPath": "/static/img/mine-bar-active.png"
//         }
//     ]
// },
