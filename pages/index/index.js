//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
  },
  gameBegin: function() {
    
    wx.redirectTo({
      url: '../member/member'
    })
  },
  onLoad: function () {
    wx.showLoading({ title: '拼命检查中...', mask: true })
    // 登录
    // wx.login({
    //   success: function (res) {
    //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //     if (res.code) {
    //       wx.getUserInfo({
    //         success: function (request) {
    //           //发起网络请求
              
    //           return app.zhushou.checkuser(res.code, request.rawData, request.signature, request.encryptedData, request.iv)
    //             .then(r => {
                  
    //               wx.setStorageSync('isbanker', r.isbanker)
    //               wx.setStorageSync('openid', r.id)
    //               if(r.game_id){
    //                 if (r.isbanker == 1) {
    //                   wx.setStorageSync('game_id', r.game_id)
    //                   wx.hideLoading()
    //                   wx.redirectTo({
    //                     url: '/pages/gameOn/gameOn'
    //                   })
    //                 }
    //               }else{
    //                 wx.hideLoading()
    //               }
                  
    //             })
    //             .catch(e => {

                  
    //               wx.hideLoading()
    //             })
              

    //           // wx.request({
    //           //   url: 'https://x.tfcaijing.com/index.php/api/checkuser',
    //           //   method: "POST",
    //           //   data: {
    //           //     code: res.code,
    //           //     rawData: request.rawData,
    //           //     signature: request.signature,
    //           //     encryptData: request.encryptedData,
    //           //     iv: request.iv
    //           //   },
    //           //   success: function (r) {
    //           //     wx.setStorageSync('isbanker', r.data.isbanker)
    //           //     wx.setStorageSync('openid', r.data.id)
    //           //     if (r.data.isbanker == 1) {
    //           //       wx.setStorageSync('game_id', r.data.game_id)

    //           //       wx.redirectTo({
    //           //         url: '/pages/gameOn/gameOn'
    //           //       })
    //           //     }
    //           //   }
    //           // })
    //           // wx.hideLoading()


    //         }
    //       })
    //       // //发起网络请求
    //       // wx.request({
    //       //   url: 'http://192.168.0.127:8088/api/checkuser',
    //       //   data: {
    //       //     code: res.code,
    //       //     rawData: request.rawData,
    //       //     signature: request.signature,
    //       //     encryptData: request.encryptedData,
    //       //     iv: request.iv
    //       //   },
    //       //   success: function(result){
    //       //     wx.setStorageSync('isbanker', result.data.isbanker)
    //       //     wx.setStorageSync('openid', result.data.id)
    //       //     if (result.data.isbanker == 1) {
    //       //       wx.setStorageSync('game_id', result.data.game_id)
    //       //       wx.redirectTo({
    //       //         url: '/pages/gameOn/gameOn'
    //       //       })
    //       //     }
    //       //     // wx.setStorage({
    //       //     //   key: 'isbanker',
    //       //     //   data: result.data.isbanker,
    //       //     // })
    //       //   }
    //       // })
    //     } else {
    //       console.log('登录失败！' + res.errMsg)
    //     }
    //   }
    // })
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
