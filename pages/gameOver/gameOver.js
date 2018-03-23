// gameOn.js
const app = getApp() 
Page({
  data: {
    height: null,
    src: "../images/icon_crown_fourthpage.png",
    isHide: false,
    width: "50"    
  },
  onLoad: function (options) {
    this.setData({
      height: app.globalData.windowHeight - 340,
      timeOver: options.timeOver    
    })
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '自定义转发标题',
      path: '/page/gameOver/gameOver',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }  
})