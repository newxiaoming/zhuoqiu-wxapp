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
    count: {a:0,b:0},
    winner: '',
    income:0,//胜方收入
  },
  onLoad: function (options) {
    this.setData({
      height: app.globalData.windowHeight - 340,
      timeOver: options.timeOver    
    })
    
    this.getGamers()
    this.getWinner()
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 分享
      console.log(res.target)
    }
    return {
      title: '桌球比赛结果',
      path: '/pages/gameOver/gameOver?_g=' + wx.getStorageSync('game_id'),
      success: function (res) {
        // 分享成功
      },
      fail: function (res) {
        // 分享失败
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
    return app.zhushou.getBet(wx.getStorageSync('game_id'), '', wx.getStorageSync('openid'))
      .then(d => {
        
        if (d.status == 200) {

          this.setData({
            beters: d.data,
            count:d.count
          })
          console.log(d.count)
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
  },
  getWinner: function () {
    return app.zhushou.getWinner(wx.getStorageSync('game_id'), '', wx.getStorageSync('openid'))
      .then(d => {

        if (d.status == 200) {

          this.setData({
            beters: d.data,
            count: d.count,
            winner: d.winner,
            income: d.income
          })
          console.log(d.beters)
        } else {
          wx.showToast({
            title: '比赛结果数据异常',
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