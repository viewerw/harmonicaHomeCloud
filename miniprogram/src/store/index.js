/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */

import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        isLogin: false,
        openid: '',
        posts: [],
        userInfo: {},
    },
    mutations: {
        setIsLogin(state, isLogin) {
            const obj = state;
            obj.isLogin = isLogin;
        },
        setUserInfo(state, userInfo) {
            const obj = state;
            obj.userInfo = userInfo;
        },
        setOpenid(state, openid) {
            const obj = state;
            obj.openid = openid;
        },
        setPosts(state, posts) {
            const obj = state;
            obj.posts = posts;
        },
    },
    actions: {
        async initLogin({ commit, state }) {
            const openid = wx.getStorageSync('openid');
            try {
                if (!openid) {
                    const res = await wx.cloud.callFunction({
                        name: 'login',
                        data: {},
                    });
                    wx.setStorageSync('openid', res.result.openid);
                    commit('setOpenid', res.result.openid);
                } else {
                    commit('setOpenid', openid);
                }
                const db = wx.cloud.database();

                const res = await db
                    .collection('user')
                    .where({
                        _openid: state.openid,
                    })
                    .get();
                console.log(res);
                if (res.data.length !== 0) {
                    wx.setStorageSync('userinfo', res.data[0].userinfo);
                    commit('setIsLogin', true);
                    commit('setUserInfo', res.data[0].userinfo);
                }
            } catch (e) {
                commit('setIsLogin', false);
                console.log(e);
            }
        },
    },
});

export default store;
