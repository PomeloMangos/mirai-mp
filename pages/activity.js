// pages/index.js

const app = getApp();
const qv = require("../utils/qv");

Page({

    /**
     * 页面的初始数据
     */
    data: {
        id: null,
        isFullScreen: app.globalData.isFullScreen,
        host: app.globalData.host,
        activity: null,
        active: null,
        layoutVariables: {
        }
    },
    onLoad: function(options) {
        this.setData(options);
        wx.$activity = this;
        this.loadActivity();
        this.switchTab2('reg');
    },
    onUnload: function() {
        wx.$activity = null;
    },
    switchTab: function(event) {
        let active = event.currentTarget.dataset.active;
        this.switchTab2(active);
    },
    switchTab2: function(active) {
        this.setData({
            active: active
        });
    },
    loadActivity: function() {
        wx.showLoading({
          title: '正在加载活动...',
        })
        let self = this;
        return qv.get(`${this.data.host}/api/activity/${this.data.id}`).then(result => {
            self.setData({ activity: result.data.data });
            wx.hideLoading({});
        });
    },
    onShareAppMessage: function () {

    }
})