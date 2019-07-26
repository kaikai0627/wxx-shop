const app = getApp();
const db = wx.cloud.database();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        tabbar: {},
        nickName: '',
        avatarUrl: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        app.changeTabBar();
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
        this.getData();
    },
    // 获取资料
    getData: function () {
        wx.cloud.callFunction({
            name: 'login'
        }).then(res => {
            db.collection('personalData').where({
                _openId: res.result.openId
            }).get().then(res => {
                this.setData({
                    nickName: res.data[0].nickName,
                    avatarUrl: res.data[0].fileID
                });
            });
        });
    },

    not: function () {
        wx.showToast({
            title: '敬请期待',
            icon: 'none',
            duration: 2000
        })
    }
})