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
        guild: null,
        active: null,
        layoutVariables: {
        }
    },
    onLoad: function(options) {
        this.setData(options);
        wx.$guild = this;
        wx.$guildId = options.id || options.scene;
        this.loadGuild();
        this.switchTab2('home');
    },
    onUnload: function() {

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
    loadGuild: function() {
        let self = this;
        return qv.get(`${this.data.host}/api/guild/${this.data.id}`).then(result => {
            let guild = result.data.data;
            wx.setNavigationBarTitle({
                title: guild.name,
            })
            self.setData({ guild: guild });
        });
    },
    onShareAppMessage: function () {
        return {
            title: '【公会活动】' + this.data.guild.name
        };
    }
})