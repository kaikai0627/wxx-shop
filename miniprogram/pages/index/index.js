const db = wx.cloud.database();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        bannerImg: [],
        shopType: {},
        hotSale: {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.getData();
    },
    getData: function() {
        db.collection('index')
            .get().then(res => {
                console.log(res);
                this.setData({
                    bannerImg: res.data[0].banner,
                    shopType: res.data[1].shopType,
                    hotSale: res.data[2].hotSale
                })
            }).catch(err => {
                console.log(err);
            })
    },
    // 分类商品
    onShopListTap: function (e) {
        var id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '../shop-classify/shop-classify?id=' + id,
        })
    },
    // 热卖商品详情
    onShopDetailTap: function(e) {
        var id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '../shop-detail/shop-detail?id=' + id,
        })
    },
    // 底部导航栏跳转
    navChange: function (e) {
        var url = e.currentTarget.dataset.cur;
        wx.navigateTo({
            url: '../' + url + '/' + url
        });
    }
})