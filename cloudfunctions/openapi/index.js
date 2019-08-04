// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init({ env: 'production-emhx9' });
const db = cloud.database();
const _ = db.command;
// 云函数入口函数
exports.main = async (event, context) => {
    switch (event.action) {
        case 'sendTemplateMessage': {
            return sendTemplateMessage(event);
        }
        case 'getWXACode': {
            return getWXACode(event);
        }
        default: {
            return;
        }
    }
};

async function sendTemplateMessage(event) {
    // 接下来将新增模板、发送模板消息、然后删除模板
    // 注意：新增模板然后再删除并不是建议的做法，此处只是为了演示，模板 ID 应在添加后保存起来后续使用
    // const addResult = await cloud.openapi.templateMessage.addTemplate({
    //     id: 'AT0002',
    //     keywordIdList: [3, 4, 5],
    // });

    const templateId = 'XA2ptKIZWMIFozr61JaB9uq-WAj_uiSXGXvESvKYSzs';
    const { data } = await db
        .collection('formid')
        .where({ _openid: event.openid })
        .get();
    const formId = data[0].formIds.shift();
    await db
        .collection('formid')
        .doc(data[0]._id)
        .update({
            data: { formIds: _.shift() },
        });
    const sendResult = await cloud.openapi.templateMessage.send({
        touser: event.openid,
        templateId,
        formId,
        page: `pages/message?type=${event.messageType}`,
        data: {
            keyword1: {
                value: event.content,
            },
            keyword2: {
                value: event.username,
            },
        },
    });

    return sendResult;
}

async function getWXACode(event) {
    // 此处将获取永久有效的小程序码，并将其保存在云文件存储中，最后返回云文件 ID 给前端使用

    const wxacodeResult = await cloud.openapi.wxacode.get({
        path: 'pages/openapi/openapi',
    });

    const fileExtensionMatches = wxacodeResult.contentType.match(/\/([^\/]+)/);
    const fileExtension = (fileExtensionMatches && fileExtensionMatches[1]) || 'jpg';

    const uploadResult = await cloud.uploadFile({
        // 云文件路径，此处为演示采用一个固定名称
        cloudPath: `wxacode_default_openapi_page.${fileExtension}`,
        // 要上传的文件内容可直接传入图片 Buffer
        fileContent: wxacodeResult.buffer,
    });

    if (!uploadResult.fileID) {
        throw new Error(
            `upload failed with empty fileID and storage server status code ${
                uploadResult.statusCode
            }`,
        );
    }

    return uploadResult.fileID;
}
