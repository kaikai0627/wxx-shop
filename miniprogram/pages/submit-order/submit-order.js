const app = getApp();
const db = wx.cloud.database();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        shippingAddress: {},
        isAddress: false,
        shopList: [],
        totalPrice: 0,
        sum: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        // 结算的商品
        this.setData({
            shopList: app.globalData.submitShop
        });
        // 选择的收货地址
        if (Object.keys(options).length >= 1) {
            this.setData({
                shippingAddress: options,
                isAddress: true
            })
        }
        this.totalPrice();
    },
    // 计算总价
    totalPrice: function () {
        var shopList = this.data.shopList;
        var totalPrice = 0;
        var sum = 0;
        for (var i = 0; i < shopList.length; i++) {
            totalPrice += parseFloat(shopList[i].shopPrice) * parseFloat(shopList[i].count);
            sum += parseFloat(shopList[i].count);
        }
        this.setData({
            totalPrice,
            sum
        })
    },
    // 选择地址
    chooseAddressTap: function(e) {
        var status = e.currentTarget.dataset.status;
        wx.navigateTo({
            url: '../personage-center/address-list/address-list?chooseIs=' + status,
        })
    },
    onBuyTap: function () {
        wx.showToast({
            title: '敬请期待',
            icon: 'none',
            duration: 2000
        });
    }
    
})