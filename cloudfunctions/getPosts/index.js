// 云函数入口文件
const cloud = require('wx-server-sdk');
cloud.init({ env: 'production-emhx9' });
// 初始化数据库链接
const db = cloud.database();
const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext();
    const { data: posts } = await db
        .collection('post')
        .orderBy('updatedAt', 'desc')
        .skip((event.page - 1) * event.ipp)
        .limit(event.ipp)
        .get();

    // const openids = postList.map(post => post._openid);
    // const { data: userData } = await db
    //     .collection('user')
    //     .where({ _openid: _.in(openids) })
    //     .get();

    // const posts = postList.map((post, index) => ({
    //     ...post,
    //     userInfo: userData.find(user => user._openid === post._openid).userinfo,
    // }));
    return {
        event,
        posts,
        openid: wxContext.OPENID,
        appid: wxContext.APPID,
        unionid: wxContext.UNIONID,
    };
};
