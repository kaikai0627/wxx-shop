const db = wx.cloud.database();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        id: null,
        shopInfo: {},
        TabCur: 0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({
            id: options.id
        });
        this.getDetailData();
    },

    getDetailData: function() {
        db.collection('shopDetail').where({
            id: this.data.id
        }).get().then(res => {
            console.log(res);
            this.setData({
                shopInfo: res.data[0]
            })
        }).catch(err => {
            console.log(err);
        })
    },
    // 标签切换
    tabSelect(e) {
        this.setData({
            TabCur: e.currentTarget.dataset.id,
        })
    }
})