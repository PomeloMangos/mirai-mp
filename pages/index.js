// pages/index.js

const app = getApp();

Page({
    data: {
        isFullScreen: app.globalData.isFullScreen,
        active: 'home',
        layoutVariables: {
            characterSearch: {
                name: '',
                realm: ''
            }
        }
    },
    onLoad: function() {
        wx.$root = this;
        let defaultGuild = wx.getStorageSync('defaultGuild');
        if (defaultGuild) {
            this.navigateToGuild(defaultGuild);
        }
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
    switchToCharacterDetail: function(name, realm) {
        this.setData({
            "layoutVariables.characterSearch.name": name,
            "layoutVariables.characterSearch.realm": realm,
            active: 'ch-res'
        });
    },
    navigateToGuild: function(guildId) {
        wx.navigateTo({
          url: `guild?id=${guildId}`,
        })
    },
    navigateToMy: function() {
        wx.navigateTo({
          url: 'my',
        })
    },
    onShareAppMessage: function () {

    }
})