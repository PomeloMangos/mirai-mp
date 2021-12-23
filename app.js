const qv = require("utils/qv");
const host = 'https://gbgbg.cn';

App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    let self = this;
    wx.getSystemInfo({
      success: (result) => {
        if (result.statusBarHeight > 20) {
          self.globalData.isFullScreen = true;
        }
      },
    });
    wx.login({
      success: function(res) {
        self.loginToMirai(res.code, '');
      }
    });
  },
  loginToMirai: function(code, displayName) {
    let self = this;
    return qv.post(host + '/api/openid/session', { jsCode: code, displayName: displayName }).then(result => {
      self.globalData.session = result.data.data;
      wx.$token = self.globalData.session.token;
    });
  },
  globalData: {
    host: host,
    isFullScreen: false
  }
})