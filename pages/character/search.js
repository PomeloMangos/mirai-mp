const app = getApp();

Component({
    data: {
        isFullScreen: app.globalData.isFullScreen,
        realm: '',
        characterName: ''
    },
    methods: {
        onSearchBtnClicked: function() {
            if (!this.data.characterName) {
                wx.showModal({
                    title: "错误",
                    content: "请填写角色名",
                    showCancel: false
                })
                return;
            }

            if (!this.data.realm) {
                wx.showModal({
                    title: "错误",
                    content: "请填写服务器名称",
                    showCancel: false
                });
                return;
            }

            wx.$root.switchToCharacterDetail(this.data.characterName, this.data.realm);
        }
    }
})
