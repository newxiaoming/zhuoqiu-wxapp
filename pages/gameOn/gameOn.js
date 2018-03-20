// gameOn.js
const app = getApp();
var cost=0;
var t;
Page({
  data: {
    height: null,
    time: "00:00:00",
    width: "50",
    seconds: 0,
    cost: 0,
    hide: true    
  },
  onLoad: function (options) {  
    timing(this);
    charging(this);
    this.setData({
      height: app.globalData.windowHeight - 320,
    })    
  },
  radioChange: function(e){   
  },
  confirmWinner: function(e){
    var that = this;
    clearTimeout(t);
    var timeOver = that.data.time
    wx.redirectTo({
      url: '../gameOver/gameOver?timeOver=' + timeOver
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