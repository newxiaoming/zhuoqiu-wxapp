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
    hide: false,// 投注者 开关
    hidechooseWiner: true,// 庄家开关
    ids: wx.getStorageSync('ids'),
    gamers:[],//参赛选手
    winner:0, //庄家提交的胜利者
    set_winner : 0, //投注的选手
    money:0, //投注金额
    hasbet: false,//是否已投注
    beters: [],//投注数据
    // count:[],//投注数量
  },
  onLoad: function (options) {  
    timing(this);
    charging(this);
    this.setData({
      height: app.globalData.windowHeight - 320,
    })
    this.getGamers()
    this.getBeters()
        
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
  getGamers:function(){
    if (!wx.getStorageSync('gamers')) {
      wx.showToast({
        title: '比赛数据异常',
        icon: 'none'
      })
      return
    }
    
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

    return app.zhushou.submitgame(this.data.ids, wx.getStorageSync('openid'), 1, this.data.winner, wx.getStorageSync('game_id'))
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
    if (!wx.getStorageSync('game_id') || !this.data.money || !this.data.set_winner)
    {
      wx.showToast({
        title: '要选投注的选手呀！',
        icon: 'none',
        mask: true
      })
      return
    }
    return app.zhushou.submitBet(wx.getStorageSync('openid'), this.data.set_winner, wx.getStorageSync('game_id'), this.data.money, app.globalData.userInfo.avatarUrl)
      .then(d => {
        console.log(d.count)
        if (d.status) {
          // this.setData({ subtitle: d.title, movies: this.data.movies.concat(d.subjects) })
          
          this.setData({
            hasbet: true,
            hide: true
          })

          wx.showToast({
            title: '投注成功',
            icon: 'none'
          })
          
          // wx.redirectTo({
          //   url: '../gameOver/gameOver?_g=' + wx.getStorageSync('game_id')
          // })

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
  getBeters: function () {
    return app.zhushou.getBet(wx.getStorageSync('game_id'), this.data.ids, wx.getStorageSync('openid'))
      .then(d => {
      
        if (d.status == 200) {

          this.setData({
            beters: d.data,
            count: d.count
          })
          
          if(d.isbet==1)
          {
            this.setData({
              // hide: true
            })
            // wx.redirectTo({
            //   url: '../gameOver/gameOver?_g=' + wx.getStorageSync('game_id')
            // })
          }
          if(d.isbet)
          {
            this.setData({
              hide: true
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
    return app.zhushou.getBet(wx.getStorageSync('game_id'), this.data.ids, wx.getStorageSync('openid'))
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
              url: '../gameOver/gameOver?_g=' + wx.getStorageSync('game_id')
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
  }
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
