//member.js
const app = getApp() 
Page({
  data: {
    height:null,
    players: [],//所有选手列表
    ids: [],
    list: [],
    scrollTop: 0
  },
  onLoad: function (options) {
    this.setData({
      height: app.globalData.windowHeight - 200
    })

    this.getPlayers()
    // wx.request({
    //   url: 'http://zhuoqiuzhushou.test/api/players',
    //   data: {

    //   },
    //   success: function (res) {
    //     wx.setStorageSync('players', res.data.data)
    //     wx.hideLoading()
        this.setData({
          height: app.globalData.windowHeight - 200
        })
    //   }
    // })
    
  },
  onShow: function () {
    var that = this;
    GetList(that);
  },
  checkboxChange: function (e) {
    var list = []; 
    if (e.detail.value.length>2){   
      wx.showToast({
        title: '只能选择2位对局选手哦',
        icon: 'none'
      })          
    }
    
    if (e.detail.value.length < 3){
      
      this.setData({
        ids: e.detail.value,
      })
      for (var i = 0; i < e.detail.value.length; i++) {
        console.log(this.data.ids[i])
        list[i] = this.data.players[this.data.ids[i]]
        this.setData({
          list: list
        })
        console.log(this.data.players[this.data.ids[i]])
      }
      wx.setStorageSync('ids', e.detail.value)
    }
  },
  begin: function () {
    this.submitGame()
    

    // wx.request({
    //   url: 'http://zhuoqiuzhushou.test/api/player/submitgame',
    //   data: {
    //     'ids': this.data.ids,
    //     'bk': wx.getStorageSync('openid')
    //   },
    //   method: 'GET',
    //   success: function(res) {
    //     console.log(res)
        // wx.redirectTo({
        //   url: '../gameOn/gameOn'
        // })
    //   }
    // })
    
  },
  getPlayers:function() {
    if(!this.data.players) {
      wx.showToast({
        title: '数据异常 或 没啥选手',
        icon: 'none'
      })
    }

    wx.showLoading({ title: '拼命加载中...' })

    return app.zhushou.find()
      .then(d => {
        console.log(d.count)
        if (d.count) {
          // this.setData({ subtitle: d.title, movies: this.data.movies.concat(d.subjects) })
          wx.setStorageSync('players', d.data)
          this.setData({
            players: d.data
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
  submitGame:function() {
    wx.setStorageSync('gamers', this.data.list)

    if (!this.data.players) {
      wx.showToast({
        title: '数据异常 或 没啥选手',
        icon: 'none'
      })
    }

    wx.showLoading({ title: '拼命提交中...',mask:true })

    return app.zhushou.submitgame(this.data.ids, wx.getStorageSync('openid'))
      .then(d => {
        console.log(d.status)
        if (d.status) {
          // this.setData({ subtitle: d.title, movies: this.data.movies.concat(d.subjects) })
          wx.setStorageSync('players', d.data)
          wx.setStorageSync('game_id', d.game_id)//game_id: 游戏ID
          this.setData({
            players: d.data
          })
          wx.redirectTo({
            url: '../gameOn/gameOn'
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
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading();
    var that = this;
    wx.request({
      url: 'http://192.168.0.127:8088/api/players',
      data: {},
      method: 'GET',
      success: function (res) {
        that.setData({
          players: res.data.data,
          scrollTop: that.data.scrollTop
        })
        setTimeout(function () {
          wx.hideNavigationBarLoading()
          wx.stopPullDownRefresh()
        }, 1000);
      }
    })
  }
})
var GetList = function (that) {
  wx.request({
    url: 'http://192.168.0.127:8088/api/players',
    data: {},
    method: 'GET',
    success: function (res) {
      that.setData({
        players: res.data.data
      })
    }
  })
}