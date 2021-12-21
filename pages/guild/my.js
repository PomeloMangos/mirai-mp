Component({
    properties: {
        guild: null
    },

    data: {
        guild: null,
        host: getApp().globalData.host,
        isFullScreen: getApp().globalData.isFullScreen,
        defaultGuild: null
    },

    methods: {
        onSetBtnClicked: function() {
            wx.setStorageSync('defaultGuild', this.data.guild.id);
            var self = this;
            wx.showModal({
                title: "完成",
                content: `已将${this.data.guild.name}设置为默认公会`,
                showCancel: false
            }).then(() => {
                self.setData({
                    defaultGuild: self.data.guild.id
                });
            });
        },
        onUnsetBtnClicked: function() {
            wx.removeStorageSync('defaultGuild');
            wx.showModal({
                title: "完成",
                content: `已取消${this.data.guild.name}默认公会`,
                showCancel: false
            }).then(() => {
                wx.$guildId = null;
                wx.navigateBack();
            });
        }
    },

    lifetimes: {
        attached: function() {
            this.setData({ 
                guild: this.properties.guild,
                defaultGuild: wx.getStorageSync('defaultGuild')
            });
        }
    }
})
