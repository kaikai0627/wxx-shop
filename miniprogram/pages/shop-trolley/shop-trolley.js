// miniprogram/pages/shop-trolley/shop-trolley.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        shopList: [],
        totalPrice: null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        this.getShopList();
        this.totalPrice();
    },
    // 获取storage存储的商品
    getShopList: function() {
        var shopList = wx.getStorageSync("cart");
        this.setData({
            shopList
        });
    },
    // 计算总价
    totalPrice: function () {
        var list = this.data.shopList;
        var totalPrice = null;
        for (var i = 0; i < list.length; i++) {
            totalPrice += parseFloat(list[i].count) * parseFloat(list[i].shopPrice);
        }
        this.setData({
            totalPrice
        });
    },
    // 商品数量加
    shopPlus: function(e) {
        var id = e.currentTarget.dataset.id;
        var shopList = this.data.shopList;
        shopList[id].count = parseInt(shopList[id].count) + 1;
        this.setStorageList(shopList);
    },
    // 商品数量减
    shopMinus: function(e) {
        var id = e.currentTarget.dataset.id;
        var shopList = this.data.shopList;
        if (parseInt(shopList[id].count) > 1) {
            shopList[id].count = parseInt(shopList[id].count) - 1;
            this.setStorageList(shopList);
        }
    },
    // 输入商品数量
    changeNumber: function(e) {
        var id = e.currentTarget.dataset.id;
        var shopList = this.data.shopList;
        shopList[id].count = parseInt(e.detail.value);
        this.setStorageList(shopList);
    },
    // 判断数量 不能小于1 如果等于0或空 默认改为1
    isNumber: function (e) {
        var id = e.currentTarget.dataset.id;
        if (e.detail.value < 1) {
            var shopList = this.data.shopList;
            shopList[id].count = 1;
            this.setStorageList(shopList);
        }
    },
    // 通用方法 重新设置商品数量之后调用 重新设置data 更新storage
    setStorageList: function (shopList) {
        this.setData({
            shopList
        });
        try {
            wx.setStorageSync('cart', shopList)
        } catch (e) {
            console.log(e)
        }
        // 重新计算总价
        this.totalPrice();
    },
    // 分类商品
    onShopListTap: function(e) {
        var id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '../shop-classify/shop-classify?id=' + id,
        })
    },
    // 底部导航栏跳转
    navChange: function(e) {
        var url = e.currentTarget.dataset.cur;
        wx.navigateTo({
            url: '../' + url + '/' + url
        });
    }
})