// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init({ env: 'production-emhx9' });
// 初始化数据库链接
const db = cloud.database();
const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
    console.log('id', event.id);
    const wxContext = cloud.getWXContext();
    const { data } = await db
        .collection('tutorials')
        .doc(event.id)
        .get();
    console.log('data', data);
    const articles = await Promise.all(
        data.articles.map(articleId =>
            db
                .collection('article')
                .where({ _id: articleId })
                .get()
                .then(({ data }) => data[0]),
        ),
    );
    console.log('articles', articles);
    return {
        event,
        articles,
        openid: wxContext.OPENID,
        appid: wxContext.APPID,
        unionid: wxContext.UNIONID,
    };
};
