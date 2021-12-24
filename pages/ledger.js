// pages/index.js

const app = getApp();
const qv = require("../utils/qv");

Page({
    data: {
        id: null,
        isFullScreen: app.globalData.isFullScreen,
        host: app.globalData.host,
        active: null,
        layoutVariables: {
        },
        activity: null,
        loaded: false
    },
    onLoad: function(options) {
        this.setData({
            id: options.id || options.scene
        });
        wx.$ledger = this;
        this.loadActivity();
        this.switchTab2('summary');
    },
    onUnload: function() {
        wx.$ledger = null;
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
    handleActivity: function(activity) {
        try {
            activity.ledger = JSON.parse(activity.extension3);
        } catch(e) {
            activity.ledger = { };
        }

        if (!activity.ledger.statistics) {
            activity.ledger.statistics = {};
        }

        for (let i = 0; i < activity.ledger.income.length; ++i) {
            let reg = activity.registrations.filter(x => x.name == activity.ledger.income[i].player);
            if (reg.length) {
                reg = reg[0];
                activity.ledger.income[i]._player = reg;
            }
        }

        for (let i = 0; i < activity.ledger.other.length; ++i) {
            let reg = activity.registrations.filter(x => x.name == activity.ledger.other[i].player);
            if (reg.length) {
                reg = reg[0];
                activity.ledger.other[i]._player = reg;
            }
        }

        for (let i = 0; i < activity.ledger.expense.length; ++i) {
            let reg = activity.registrations.filter(x => x.name == activity.ledger.expense[i].player);
            if (reg.length) {
                reg = reg[0];
                activity.ledger.expense[i]._player = reg;
            }
        }

        activity.ledger.statistics.topConsumers = this.generateTopConsumers(activity.ledger, activity);
        activity.ledger.statistics.summary = this.generateLedgerSumamry(activity.ledger);
    },
    generateTopConsumers: function (ledger, activity) {
        var ret = [];
        var tmp = {};
        for (var i = 0; i < ledger.income.length; ++i) {
            if (!ledger.income[i].player || ledger.income[i].player == '-') {
                continue;
            }

            var player = ledger.income[i].player;
            if (!tmp[player]) {
                tmp[player] = 0;
            }

            tmp[player] += ledger.income[i].price;
        }

        var keys = Object.getOwnPropertyNames(tmp);
        for (var i = 0; i < keys.length; ++i) {
            let reg = activity.registrations.filter(x => x.name == keys[i]);
            let _player = null;
            if (reg.length) {
                _player = reg[0];
            }
            ret.push({ player: keys[i], price: tmp[keys[i]], _player: _player });
        }

        ret.sort((a, b) => b.price - a.price);
        return ret;
    },
    generateLedgerSumamry: function (ledger) {
        var ret = {
            total: 0,
            expense: 0,
            profit: 0,
            split: 0,
            per: 0
        };

        for (var i = 0; i < ledger.income.length; ++i) {
            ret.total += ledger.income[i].price;
        }

        for (var i = 0; i < ledger.other.length; ++i) {
            ret.total += ledger.other[i].price;
        }

        for (var i = 0; i < ledger.expense.length; ++i) {
            ret.expense += ledger.expense[i].price;
        }

        ret.profit = ret.total - ret.expense;

        if (ledger.statistics && ledger.statistics.split) {
            ret.split = ledger.statistics.split;
            ret.per = parseInt(ret.profit / ret.split);
        }

        return ret;
    },
    loadActivity: function() {
        if (wx.$activity && wx.$activity.data.activity.id == this.data.id) {
            this.handleActivity(wx.$activity.data.activity);
            this.setData({
                activity: wx.$activity.data.activity,
                loaded: true,
                canBack: !!wx.$guild
            });
            return Promise.resolve(null);
        }

        this.setData({ loaded: false });
        wx.showLoading({
          title: '正在加载活动...',
        })
        let self = this;
        return qv.get(`${this.data.host}/api/activity/${this.data.id}`).then(result => {
            let activity = result.data.data;
            wx.setNavigationBarTitle({
              title: activity.name,
            })

            this.handleActivity(activity);
            self.setData({ 
                activity: activity,
                loaded: true,
                canBack: !!wx.$guild
            });
            wx.hideLoading({});
        });
    },
    onShareAppMessage: function () {
        return {
            title: '【账本】' + this.data.activity.name
        };
    },
    onShareTimeline: function() {
        return {
            title: this.data.activity.name
        }
    }
})