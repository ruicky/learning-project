// pages/movies/more-movie/more-movie.js
var app = getApp();
var util = require('../../../utils/util.js');
Page({

  data: {
    movies: {},
    requestUrl: "",
    totalCount: 0,
    isEmpty: true

  },

  onLoad: function (options) {
    var category = options.category;
    var dataUrl = "";
    switch (category) {
      case "正在热映":
        dataUrl = `${app.globalData.doubanBase}/v2/movie/in_theaters`;
        break;
      case "即将上映":
        dataUrl = `${app.globalData.doubanBase}/v2/movie/coming_soon`;
        break;
      case "豆瓣Top250":
        dataUrl = `${app.globalData.doubanBase}/v2/movie/top250`;
        break;
    }
    this.setData({ requestUrl: dataUrl });
    util.http(dataUrl, this.processDoubanData);

    wx.setNavigationBarTitle({
      title: category
    });

  },
  processDoubanData: function (moviesData) {
    var that = this;
    var movies = [];
    moviesData.subjects.map(x => {
      var temp = {};
      temp.title = (x.title.length >= 6 ? x.title.substring(0, 6) + "..." : x.title);
      temp.average = x.rating.average;
      temp.coverageUrl = x.images.large;
      temp.movieId = x.id;
      temp.stars = util.convertToStarsArray(x.rating.stars);
      return movies.push(temp);
    })
    console.log('movies', movies)
    var totalCount = totalCount += 20;
    var totalMovies = {};
    // 如果绑定新加载的数据，那么需要将旧有的数据合并。
    if (!this.data.isEmpty) {
      totalMovies = this.data.movies.concat(movies);
    } else {
      totalMovies = movies
      this.data.isEmpty = false;
    }
    that.setData({ movies: totalMovies });
    this.data.totalCount += 20;
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();

  },
  onMovieTap: function (event) {
    var movieId = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../movie-detail/movie-detail?id=' + movieId,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var nextUrl = `${this.data.requestUrl}?start=0&count=20`;
    this.data.isEmpty = true;
    this.data.totalCount=0;
    util.http(nextUrl, this.processDoubanData);
    wx.showNavigationBarLoading()
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var nextUrl = `${this.data.requestUrl}?start=${this.data.totalCount}&count=20`;
    console.log('nextUrl', nextUrl)
    util.http(nextUrl, this.processDoubanData);
    wx.showNavigationBarLoading()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})