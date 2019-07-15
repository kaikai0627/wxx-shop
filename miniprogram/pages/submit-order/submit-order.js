const db = wx.cloud.database();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        shippingAddress: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.getAddressData();
    },

    getAddressData: function() {
        wx.cloud.callFunction({
            name: 'login'
        }).then(res => {
            console.log(res)
            db.collection('shippingAddress').where({
                _openId: res.result.openId
            }).get().then(res => {
                console.log(res);
                this.setData({
                    shippingAddress: res.data
                })
            }).catch(err => {
                console.log(err);
            })
        })
    }
})