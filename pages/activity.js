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
        active: null,
        layoutVariables: {
        },
        activity: null,
        raids: [],
        bossNames: null,
        itemSets: null
    },
    onLoad: function(options) {
        this.setData(options);
        wx.$activity = this;
        let self = this;
        this.loadRaids().then(() => {
            return self.loadItemSets();
        }).then(() => {
            return self.loadActivity();
        });
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
    getBossPassed: function (bossObj) {
        var passed = 0;
        for (var i = 0; i < this.data.bosses.length; ++i) {
            if (bossObj.filter(x => x.Name == this.data.bosses[i]).length) {
                ++passed;
            }
        }
        return passed;
    },
    getWcl: function (bossObj) {
        var wcl = 0.0;
        for (var i = 0; i < this.data.bosses.length; ++i) {
            if (bossObj.filter(x => x.Name == this.data.bosses[i]).length) {
                wcl += bossObj.filter(x => x.Name == this.data.bosses[i])[0].Parse;
            }
        }
        return wcl / this.data.bosses.length * 1.0;
    },
    handleRegistration: function(reg) {
        if (!reg.charactor) {
            return;
        }

        let bossObj = reg.role == 2 
            ? JSON.parse(reg.charactor.hpsBossRanks) 
            : JSON.parse(reg.charactor.dpsBossRanks);
        reg.boss = bossObj;
        reg.bossPassed = this.getBossPassed(bossObj);
        reg.wcl = this.getWcl(bossObj);
    },
    getBossNames: function (raids) {
        var splited = raids.split(',').map(x => x.trim());
        var ret = [];
        for (var i = 0; i < splited.length; ++i) {
            var raid = this.data.raids.filter(x => x.id == splited[i]);
            if (!raid.length) {
                continue;
            }
            raid = raid[0];
            var splited2 = raid.bossList.split(',').map(x => x.trim());
            for (var j = 0; j < splited2.length; ++j) {
                ret.push(splited2[j]);
            }
        }
        return ret;
    },
    loadItemSets: function() {
        let self = this;
        return qv.get(`${this.data.host}/api/item/set`).then(result => {
            self.setData({
                itemSets: result.data.data
            });
            return Promise.resolve(true);
        });
    },
    loadRaids: function() {
        let self = this;
        return qv.get(`${this.data.host}/api/raid`).then(result => {
            let raids = result.data.data;
            self.setData({
                raids: raids
            });
            return Promise.resolve(true);
        });
    },
    loadActivity: function() {
        wx.showLoading({
          title: '正在加载活动...',
        })
        let self = this;
        return qv.get(`${this.data.host}/api/activity/${this.data.id}`).then(result => {
            let activity = result.data.data;
            wx.setNavigationBarTitle({
              title: activity.name,
            })

            self.setData({
                bosses: self.getBossNames(activity.raids)
            });

            for (let i = 0; i < activity.registrations.length; ++i) {
                let reg = activity.registrations[i];
                self.handleRegistration(reg);
            }

            self.setData({ 
                activity: activity
            });
            wx.hideLoading({});
        });
    },
    onShareAppMessage: function () {
        return {
            title: this.data.activity.name
        };
    }
})