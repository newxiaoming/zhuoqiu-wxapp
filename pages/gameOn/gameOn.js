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
    hide: true,
    ids: wx.getStorageSync('ids'),
    gamers:[],
    winner:0
  },
  onLoad: function (options) {  
    timing(this);
    charging(this);
    this.setData({
      height: app.globalData.windowHeight - 320,
    })
    this.getGamers()
    console.log(app.globalData.gameplayers)    
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

    return app.zhushou.submitgame(this.data.ids, wx.getStorageSync('openid'), 1, this.data.winner)
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
