// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    isFullScreen: app.globalData.isFullScreen,
    host: app.globalData.host,
    result: null,
    search: null,
    page: 1
  },
  onLoad() {
    app.setWatcher(this);
    this.loadGuilds(this.data.search, this.data.page);
  },
  onShow() {
    this.getTabBar().setData({
      active: 'home'
    });
  },
  loadGuilds: function(search, page) {
    var qv = require("../../utils/qv");
    var self = this;
    qv.get(`${app.globalData.host}/api/guild?name=${encodeURI(search || '')}&page=${page}`)
      .then(data => {
        self.setData({
          result: data.data
        });
      });
  },
  watch: {
    search: function(val) {
      this.loadGuilds(val, 1);
    }
  }
})
