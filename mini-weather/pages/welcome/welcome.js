// pages/welcome/welcome.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    setTimeout(() => { 
      wx.redirectTo({
        url: '../index/index',
      })
    }, 2000);
  }
})