Component({
    properties: {
        activity: null
    },

    data: {
        activity: null,
        host: getApp().globalData.host,
        isFullScreen: getApp().globalData.isFullScreen,
        canBack: false
    },

    methods: {
        onBackBtnClicked: function() {
            wx.navigateBack();
        }
    },

    lifetimes: {
        attached: function() {
            this.setData({ 
                activity: this.properties.activity,
                canBack: !!wx.$guild
            });
        }
    }
})
