var postsData = require('../../../data/posts-data');
var app = getApp();
Page({
  data: {
    isPlayMusic: false
  },
  onLoad: function (option) {
    var id = option.id;
    this.data.currentPostId = id;
    var postData = postsData.postList.filter(x => {
      return x.id == id
    });
    this.setData({ postData: postData[0] })
    // 处理收藏
    var postsCollected = wx.getStorageSync('psts_collected');
    if (postsCollected) {
      var postCollected = postsCollected[id];
      this.setData({ collected: postCollected });
    } else {
      var postsCollected = {};
      postsCollected[id] = false;
      wx.setStorageSync('psts_collected', postsCollected)
    }
    if (app.globalData.g_isPlayMusic && app.globalData.g_currentMusicId == id) {
      this.setData({ isPlayMusic: true })
    }
    this.setMusicMonitor();

  },
  setMusicMonitor: function () {
    var that = this;
    wx.onBackgroundAudioPlay(function () {
      that.setData({ isPlayMusic: true });
      app.globalData.g_isPlayMusic = true;
      app.globalData.g_currentMusicId = that.data.currentPostId;
    });
    wx.onBackgroundAudioPause(function () {
      that.setData({ isPlayMusic: false });
      app.globalData.g_isPlayMusic = true;
      app.globalData.g_currentMusicId = null;
    });
    wx.onBackgroundAudioStop(function () {
      that.setData({ isPlayMusic: false });
      app.globalData.g_isPlayMusic = true;
      app.globalData.g_currentMusicId = null;
    });
  },
  onCollectionTap: function (event) {
    var postsCollected = wx.getStorageSync('psts_collected');
    var postCollected = postsCollected[this.data.currentPostId];
    // 收藏变成未收藏， 未收藏变成收藏
    postCollected = !postCollected;
    postsCollected[this.data.currentPostId] = postCollected;
    // 更新文章是否
    wx.setStorageSync('psts_collected', postsCollected);
    this.setData({
      collected: postCollected
    })

    wx.showToast({
      title: postCollected ? '收藏成功' : '取消成功',
      icon: 'success',
      duration: 1000
    })
  },
  onShareTap: function (event) {
    var itemList = [
      "分享给微信好友",
      "分享到朋友圈",
      "分享到QQ",
      "分享到微博"
    ];
    wx.showActionSheet({
      itemList: itemList,
      itemColor: "#405f80",
      success: function (res) {
        // res.cancel 用户是不是点击了取消按钮
        // res.tapIndex 数组元素的序号，从0开始
        wx.showModal({
          title: "用户 " + itemList[res.tapIndex],
          content: "用户是否取消？" + res.cancel + "现在无法实现分享功能，什么时候能支持呢"
        })
      }
    })
  },
  onMusicTap: function (event) {
    var id = this.data.currentPostId;
    var postData = postsData.postList.filter(x => {
      return x.id == id
    });

    var isPlayMusic = this.data.isPlayMusic;
    if (isPlayMusic) {
      wx.pauseBackgroundAudio();
      this.setData({ isPlayMusic: false });
    } else {
      // 启动 postData[0].music
      wx.playBackgroundAudio({
        dataUrl: postData[0].music.dataUrl,
        title: postData[0].music.title,
        coverImgUrl: postData[0].music.coverImgUrl
      })
      this.setData({ isPlayMusic: true });
    }

  }
})