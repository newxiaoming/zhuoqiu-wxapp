const zhushou = require('./utils/zhushou.js')

//app.js
App({
  globalData: {
    userInfo: null,
    windowHeight: null,
    domainTest: 'http://zhuoqiuzhushou.test',
    domainProduct : '',
    env: 'debug',
    gameplayers: [],
    count: [],//投注数量,
    game_id:0,//游戏ID
    isbanker:'',//是否为庄家
  }, 
  /**
   * 桌球助手API
   */
  zhushou: zhushou,

  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)
    var that = this;
    
    wx.login({
      success: function (res) {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          wx.getUserInfo({
            success: function (request) {
              //发起网络请求
              return zhushou.checkuser(res.code, request.rawData, request.signature, request.encryptedData, request.iv)
                .then(r => {
                  wx.setStorageSync('isbanker', r.isbanker)
                  wx.setStorageSync('openid', r.id)
                  if (r.game_id) {
                    if (r.isbanker == 1) {
                      wx.setStorageSync('game_id', r.game_id)
                      wx.hideLoading()
                      wx.redirectTo({
                        url: '/pages/gameOn/gameOn?_g=' + r.game_id
                      })
                    }
                  } else {
                    wx.hideLoading()
                  }
                })
                .catch(e => {
                  wx.hideLoading()
                })
            }
          })
          
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
    wx.getSystemInfo({
      success: function (res) {
        that.globalData.windowHeight = res.windowHeight
      }
    })    
  }
})