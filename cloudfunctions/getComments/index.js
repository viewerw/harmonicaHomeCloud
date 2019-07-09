// 云函数入口文件
const cloud = require('wx-server-sdk');
cloud.init({ env: 'production-emhx9' });
// 初始化数据库链接
const db = cloud.database();
const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext();
    const { data: comments } = await db
        .collection('comment')
        .where({
            replyPostId: event.postId,
        })
        .orderBy('createdAt', 'asc')
        .skip((event.page - 1) * event.ipp)
        .limit(event.ipp)
        .get();

    await Promise.all(
        comments.map(
            comment =>
                new Promise(async (resolve, reject) => {
                    const { data: likes } = await db
                        .collection('like')
                        .where({
                            _openid: wxContext.OPENID,
                            likeCommentId: comment._id,
                        })
                        .get();
                    if (likes.length > 0) {
                        comment.isLike = true;
                    } else {
                        comment.isLike = false;
                    }
                    if (comment.replyIds && comment.replyIds.length > 0) {
                        try {
                            const { data: replys } = await db
                                .collection('reply')
                                .where({
                                    _id: _.in(comment.replyIds),
                                })
                                .orderBy('createdAt', 'asc')
                                .get();
                            comment.replys = replys;
                            resolve();
                        } catch (e) {
                            reject(e);
                        }
                    } else {
                        resolve();
                    }
                }),
        ),
    );
    return {
        event,
        comments,
        openid: wxContext.OPENID,
        appid: wxContext.APPID,
        unionid: wxContext.UNIONID,
    };
};
