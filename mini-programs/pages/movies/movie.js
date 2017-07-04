// movie.js
var util = require('../../utils/util.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inTheaters: {},
    comingSoon: {},
    top250: {},
    searchResult:{},
    containerShow: true,
    searchPanelShow: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var inTheatersUrl = `${app.globalData.doubanBase}/v2/movie/in_theaters?start=0&count=3`;
    var comingSoonUrl = `${app.globalData.doubanBase}/v2/movie/coming_soon?start=0&count=3`;
    var top250Url = `${app.globalData.doubanBase}/v2/movie/top250?start=0&count=3`;
    this.getMovieListData(inTheatersUrl, "inTheaters", "正在热映");
    this.getMovieListData(comingSoonUrl, "comingSoon", "即将上映");
    this.getMovieListData(top250Url, "top250", "豆瓣Top250");
  },
  onCancelImgTap: function (event) {
    this.setData({
      containerShow: true,
      searchPanelShow: false,
      searchResult:{}
    })
  },
  onBindBlur: function (event) {
    var text = event.detail.value;
    var searchUrl = `${app.globalData.doubanBase}/v2/movie/search?q=${text}`
    this.getMovieListData(searchUrl, "searchResult", "");

  },
  getMovieListData: function (url, settedKey, categoryTitle) {
    var that = this;
    wx.request({
      url: url,
      header: {
        'content-type': 'application/xml'
      },
      success: function (res) {
        that.processDoubanData(res.data, settedKey, categoryTitle);
      }
    })
  },
  /* 处理从豆瓣来的数据 */
  processDoubanData: function (moviesData, settedKey, categoryTitle) {
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
    var readyData = {};
    readyData[settedKey] = {
      categoryTitle: categoryTitle,
      movies: movies
    }
    this.setData(readyData);
  },

  onBindFocus: function (event) {
    this.setData({
      containerShow: false,
      searchPanelShow: true
    })
  },
  // 电影详情事件
  onMovieTap:function(event){
    var movieId = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: 'movie-detail/movie-detail?id=' + movieId,
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /**
   * 更多
   */
  onMoreTap: function (event) {
    var category = event.currentTarget.dataset.category;
    wx.navigateTo({
      url: 'more-movie/more-movie?category=' + category,
    })
  }
})