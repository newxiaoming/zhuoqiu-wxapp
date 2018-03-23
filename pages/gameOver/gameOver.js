// gameOn.js
const app = getApp() 
Page({
  data: {
    height: null,
    src: "../images/icon_crown_fourthpage.png",
    isHide: false,
    width: "50" ,
    gamers: []   
  },
  onLoad: function (options) {
    this.setData({
      height: app.globalData.windowHeight - 340,
      timeOver: options.timeOver    
    })
    this.getGamers()
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // ����ҳ����ת����ť
      console.log(res.target)
    }
    return {
      title: '�Զ���ת������',
      path: '/page/gameOver/gameOver',
      success: function (res) {
        // ת���ɹ�
      },
      fail: function (res) {
        // ת��ʧ��
      }
    }
  },
  getGamers: function () {
    console.log('getgamers')
    if (!wx.getStorageSync('gamers')) {
      wx.showToast({
        title: '比赛数据异常',
        icon: 'none'
      })
      return
    }

    this.setData({
      gamers: wx.getStorageSync('gamers')
    })

  },  
})