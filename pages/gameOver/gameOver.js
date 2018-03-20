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
  }
})