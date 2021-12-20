// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    let self = this;
    wx.getSystemInfo({
      success: (result) => {
        console.log(result.statusBarHeight)
        if (result.statusBarHeight > 20) {
          self.globalData.isFullScreen = true;
        }
      },
    })
  },
  globalData: {
    isFullScreen: false
  }
})
