const db = wx.cloud.database();
export const toast = (title, icon = 'none') =>
    wx.showToast({
        icon,
        title,
    });
export const showLoading = (title, mask = true) =>
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
