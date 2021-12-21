// pages/index.js

const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        isFullScreen: app.globalData.isFullScreen,
        activeLayout: "0",
        layouts: [
            { active: 'home' }
        ],
        layoutVariables: {
            characterSearch: {
                name: '',
                realm: ''
            }
        }
    },
    onLoad: function() {
        wx.$root = this;
    },
    switchTab: function(event) {
        let layout = event.currentTarget.dataset.layout;
        let active = event.currentTarget.dataset.active;
        this.switchTab2(layout, active);
    },
    switchTab2: function(layout, active) {
        let data = {
            activeLayout: layout
        };
        data[`layouts[${layout}].active`] = active;
        this.setData(data);
    },
    switchToCharacterDetail: function(name, realm) {
        this.setData({
            "layoutVariables.characterSearch.name": name,
            "layoutVariables.characterSearch.realm": realm,
            activeLayout: 0,
            "layouts[0].active": 'ch-res'
        });
    },
    onShareAppMessage: function () {

    }
})