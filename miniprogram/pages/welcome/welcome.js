const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        status: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        const that = this;
        // 如果用户已授权 直接进入首页
        wx.getSetting({
            success(res) {
                if (res.authSetting['scope.userInfo']) {
                    that.setData({
                        status: true
                    });
                    setTimeout(() => {
                        wx.redirectTo({
                            url: '/pages/index/index',
                        });
                    }, 1000);
                }
            }
        })
    },
    onGotUserInfo: function(res) {
        console.log(res);
        if (res.detail.userInfo) {
            wx.redirectTo({
                url: '/pages/index/index',
            })
        } else {
            wx.showToast({
                title: '授权失败',
                icon: 'none',
                duration: 2000
            })
        }
    }
})