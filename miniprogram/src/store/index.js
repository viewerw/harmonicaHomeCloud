/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */

import Vue from 'vue';
import Vuex from 'vuex';
import pkg from '../../package.json';

Vue.use(Vuex);
const db = wx.cloud.database();

const store = new Vuex.Store({
    state: {
        isLogin: false,
        openid: '',
        posts: [],
        userInfo: {},
        hasNewMessage: '',
        nextPage: '',
        isReview: true,
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
        setHasNewMessage(state, hasNewMessage) {
            const obj = state;
            obj.hasNewMessage = hasNewMessage;
        },
        setPosts(state, posts) {
            const obj = state;
            obj.posts = posts;
        },
        setNextPage(state, url) {
            const obj = state;
            obj.nextPage = url;
        },
        setIsReview(state, isReview) {
            const obj = state;
            obj.isReview = isReview;
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
                    commit('setHasNewMessage', res.result.hasNewMessage);
                } else {
                    commit('setOpenid', openid);
                }

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
        async initReview({ commit }) {
            const { data } = await db
                .collection('review')
                .doc('d119ef8d-95f9-4938-a31c-582a716ba59a')
                .get();
            commit('setIsReview', pkg.version === data.version && data.isreview);
        },
    },
});

export default store;
