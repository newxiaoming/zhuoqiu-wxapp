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
    // 登录
    wx.login({
      success: function(res) {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          wx.getUserInfo({
            success: function (request) {
              //发起网络请求
              wx.request({
                url: 'http://192.168.0.127:8088/api/checkuser',
                method: "POST",
                data: {
                  code: res.code,
                  rawData: request.rawData,
                  signature: request.signature,
                  encryptData: request.encryptedData,
                  iv: request.iv
                },
                success: function (r) {
                  wx.setStorageSync('isbanker', r.data.isbanker)
                  wx.setStorageSync('openid', r.data.id)
                  if (r.data.isbanker == 1) {
                    wx.setStorageSync('game_id', r.data.game_id)
                    wx.redirectTo({
                      url: '/pages/gameOn/gameOn'
                    })
                  }
                }
              })
            }
          })
          // //发起网络请求
          // wx.request({
          //   url: 'http://192.168.0.127:8088/api/checkuser',
          //   data: {
          //     code: res.code,
          //     rawData: request.rawData,
          //     signature: request.signature,
          //     encryptData: request.encryptedData,
          //     iv: request.iv
          //   },
          //   success: function(result){
          //     wx.setStorageSync('isbanker', result.data.isbanker)
          //     wx.setStorageSync('openid', result.data.id)
          //     if (result.data.isbanker == 1) {
          //       wx.setStorageSync('game_id', result.data.game_id)
          //       wx.redirectTo({
          //         url: '/pages/gameOn/gameOn'
          //       })
          //     }
          //     // wx.setStorage({
          //     //   key: 'isbanker',
          //     //   data: result.data.isbanker,
          //     // })
          //   }
          // })
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