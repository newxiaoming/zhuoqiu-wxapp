//member.js
const app = getApp() 
Page({
  data: {
    height:null
  },
  onLoad: function (options) {
    this.setData({
      height: app.globalData.windowHeight-200
    })
  },
  checkboxChange: function (e) {
    if (e.detail.value.length>2){   
      wx.showToast({
        title: '只能选择2位对局选手哦',
        icon: 'none'
      })          
    }
  },
  begin: function () {
    wx.redirectTo({
      url: '../gameOn/gameOn'
    })
  }
})