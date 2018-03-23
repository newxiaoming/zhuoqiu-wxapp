// gameOn.js
const app = getApp() 
Page({
  data: {
    height: null,
    src: "../images/icon_crown_fourthpage.png",
    isHide: false,
    width: "50" ,
    gamers: [] ,
    beters: [],//投注数据  
  },
  onLoad: function (options) {
    this.setData({
      height: app.globalData.windowHeight - 340,
      timeOver: options.timeOver    
    })
    console.log(options._g)
    this.getGamers()
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // ����ҳ����ת����ť
      console.log(res.target)
    }
    return {
      title: '桌球比赛结果',
      path: '/page/gameOver/gameOver?_g=' + wx.getStorageSync('game_id'),
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
  getBeters: function(){
    return app.zhushou.getBet(wx.getStorageSync('game_id'))
      .then(d => {
        
        if (d.status == 200) {

          this.setData({
            beters: d.data
          })
          
        } else {
          wx.showToast({
            title: '投注数据异常',
            icon: 'none',
            mask: true
          })
        }
        wx.hideLoading()
      })
      .catch(e => {
        this.setData({ subtitle: '获取数据异常' })
        console.error(e)
        wx.hideLoading()
      })
  }
})