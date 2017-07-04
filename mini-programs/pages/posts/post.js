var postsData = require('../../data/posts-data');
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
    this.setData({ posts_content: postsData.postList, swiper_imgs: postsData.swiper_imgs });
  },
   onPostTap:function(event){
     var id = event.currentTarget.dataset.id;
     wx.navigateTo({
       url: 'post-detail/post-detail?id=' + id
     })
   }
})