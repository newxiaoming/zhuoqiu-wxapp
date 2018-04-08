// gameOn.js
const app = getApp();
var cost=0;
var t;
Page({
  data: {
    height: null,
    time: "00:00:00",
    width: "50",
    seconds: 120,
    cost: 0,
    hide: false,// 投注者 开关,false 不隐藏，true 隐藏
    hidechooseWiner: true,// 庄家开关，false 不隐藏，true 隐藏
    ids: wx.getStorageSync('ids'),
    gamers:[],//参赛选手
    winner:0, //庄家提交的胜利者
    set_winner : 0, //投注的选手
    money:0, //投注金额
    hasbet: false,//是否已投注
    beters: [],//投注数据
    count:{a:0,b:0},//投注数量
  },
  onLoad: function (options) {  
    timing(this);
    charging(this);
    this.setData({
      height: app.globalData.windowHeight - 320,
    })
    
    app.globalData.game_id = options._g
    console.log(app.globalData.isbanker)
    if (app.globalData.isbanker == ''){
      wx.login({
        success: function (res) {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          if (res.code) {
            wx.getUserInfo({
              success: function (request) {
                //发起网络请求
                return app.zhushou.checkuser(res.code, request.rawData, request.signature, request.encryptedData, request.iv)
                  .then(r => {
                    
                    wx.setStorageSync('isbanker', r.isbanker)
                    wx.setStorageSync('openid', r.id)
                    if (r.game_id) {
                      if (r.isbanker == 1) {
                        console.log('r.game_id' + r.isbanker)
                        wx.setStorageSync('game_id', r.game_id)
                        this.setData({
                          hide: true,
                          hidechooseWiner: false
                        })
                        wx.hideLoading()
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
    } else if (app.globalData.isbanker == 1){
      this.setData({
        hide: true,
        hidechooseWiner: false
      })
    }
    
    // if(wx.getStorageSync('isbanker') == 1){
    //   this.setData({
    //     hide: true,
    //     hidechooseWiner: false,
    //   });
    // }
    this.getGamers(options._g)
    this.getBeters(options._g)
        
  },
  radioChange: function(e){
    this.setData({
      winner: e.detail.value
    })   
  },
  confirmWinner: function(e){
    this.gameOver()
    // var that = this;
    // clearTimeout(t);
    // var timeOver = that.data.time
    // wx.redirectTo({
    //   url: '../gameOver/gameOver?timeOver=' + timeOver
    // })   
  },
  getGamers:function(game_id = ''){
    
    wx.showLoading({ title: '拼命拉取数据...', mask: true })
    if(!game_id){
      game_id = wx.getStorageSync('game_id')
    }
      return app.zhushou.getGamers( game_id )
        .then(d => {
          if (wx.getStorageSync('isbanker') === 1) {
            
            this.setData({
              hidechooseWiner: false,
              hide: true
            })
          }

          if (d.status) {
            
            wx.setStorageSync('gamers', d.data)
            this.setData({
              gamers: d.data
            })

            
          } else {
            wx.showToast({
              title: '数据异常',
              icon: 'none'
            })
          }
          wx.hideLoading()
        })
        .catch(e => {
          this.setData({ subtitle: '获取数据异常' })
          console.error(e)
          wx.hideLoading()
        })
    
    
    this.setData({
      gamers : wx.getStorageSync('gamers')
    })

  },

  gameOver:function() {

    if (!this.data.winner) {
      wx.showToast({
        title: '比赛数据异常',
        icon: 'none'
      })
    }

    wx.showLoading({ title: '拼命提交中...', mask: true })

    return app.zhushou.submitgame(this.data.ids, wx.getStorageSync('openid'), 1, this.data.winner, app.globalData.game_id)
      .then(d => {
        console.log(d.status)
        if (d.status) {
          // this.setData({ subtitle: d.title, movies: this.data.movies.concat(d.subjects) })
          wx.setStorageSync('players', d.data)
          this.setData({
            players: d.data
          })
          var that = this;
          clearTimeout(t);
          var timeOver = that.data.time
          wx.redirectTo({
            url: '../gameOver/gameOver?timeOver=' + timeOver
          })
        } else {
          wx.showToast({
            title: '数据异常 或 没啥选手',
            icon: 'none'
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
  //投注选手
  radioChangeNum: function(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    this.setData({
      set_winner : e.detail.value,
    })
  },
  //投注金额
  radioChangeMoney: function (e) {
    this.setData({
      money: e.detail.value,
    })
    console.log(e.detail.value)
  },
  //投注
  submitBet: function() {
    if (app.globalData.game_id ==0 || !this.data.money || !this.data.set_winner)
    {
      wx.showToast({
        title: '要选投注的选手呀！',
        icon: 'none',
        mask: true
      })
      return
    }
    console.log('submitBet game_id =' + app.globalData.game_id)
    return app.zhushou.submitBet(wx.getStorageSync('openid'), this.data.set_winner, app.globalData.game_id, this.data.money, app.globalData.userInfo.avatarUrl)
      .then(d => {
        console.log(d.count)
        if (d.status) {
          this.setData({
            hasbet: true,
            hide: true
          })

          wx.showToast({
            title: '投注成功',
            icon: 'none'
          })

          wx.redirectTo({
            url: '/pages/gameOn/gameOn?_g=' + app.globalData.game_id
          })

        } else {
          wx.showToast({
            title: '没有投注成功',
            icon: 'none'
          })
          return
        }
        wx.hideLoading()
      })
      .catch(e => {
        this.setData({ subtitle: '获取数据异常' })
        console.error(e)
        wx.hideLoading()
      })
  },
  //获取投注数据
  getBeters: function (game_id = '') {
    if(!game_id){
      game_id = wx.getStorageSync('game_id')
    }
    return app.zhushou.getBet(game_id, this.data.ids, wx.getStorageSync('openid'))
      .then(d => {
      
        if (d.status == 200) {

          this.setData({
            beters: d.data,
            count: d.count
          })
          
          if(d.isbet==1)
          {
            // this.setData({
            //   hide: true,
            //   hidechooseWiner: false
            // })
            // wx.redirectTo({
            //   url: '../gameOver/gameOver?_g=' + wx.getStorageSync('game_id')
            // })
          }

          console.log(d.isfinish)
          if (d.isfinish == 1) {
            wx.redirectTo({
              url: '/pages/gameOver/gameOver?_g=' + app.globalData.game_id
            })
          }
          
          
          
        } else {
          wx.showToast({
            title: '暂无人投注',
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
  //获取投注数据
  onPullDownRefresh: function () {

    wx.showNavigationBarLoading();
    return app.zhushou.getBet(app.globalData.game_id, this.data.ids, wx.getStorageSync('openid'))
      .then(d => {
        setTimeout(function () {
          wx.hideNavigationBarLoading()
          wx.stopPullDownRefresh()
        }, 1000);
        if (d.status == 200) {

          this.setData({
            beters: d.data,
            count: d.count
          })

          if (d.isbet == 1) {
            // wx.redirectTo({
            //   url: '../gameOver/gameOver?_g=' + wx.getStorageSync('game_id')
            // })
          }

          console.log(d.isfinish)
          if (d.isfinish == 1) {
            wx.redirectTo({
              url: '/pages/gameOver/gameOver?_g=' + app.globalData.game_id
            })
          } 

        } else {
          wx.showToast({
            title: '暂无人投注',
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
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 分享
      console.log(res.target)
    }
    return {
      title: '桌球比赛中',
      path: '/pages/gameOn/gameOn?_g=' + app.globalData.game_id,
      success: function (res) {
        // 分享成功
      },
      fail: function (res) {
        // 分享失败
      }
    }
  },
})
function timing(that) {
  var seconds = that.data.seconds;
  t=setTimeout(function () {
    that.setData({
      seconds: seconds + 1
    });
    timing(that);
  }, 1000)
  formatSeconds(that);
}
function formatSeconds(that) {
  var mins = 0, hours = 0, seconds = that.data.seconds, time = ''
  if (seconds < 60) {
  } else if (seconds < 3600) {
    mins = parseInt(seconds / 60)
    seconds = seconds % 60
  } else {
    mins = parseInt(seconds / 60)
    seconds = seconds % 60
    hours = parseInt(mins / 60)
    mins = mins % 60
  }
  that.setData({
    time: formatTime(hours) + ':' + formatTime(mins) + ':' + formatTime(seconds)
  });
}
function formatTime(num) {
  if (num < 10)
    return '0' + num
  else
    return num + ''
}
function charging(that) {
  if (that.data.seconds < 600) {
    cost = 1
  }
}
