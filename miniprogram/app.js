//app.js
App({
    tabbar: {
        color: "#242424",
        selectedColor: "#fa8582",
        backgroundColor: "#ffffff",
        borderStyle: "#d7d7d7",
        list: [{
                pagePath: "../index/index",
                selectedColor: "#000000",
                iconPath: "/images/icon/nav_icon_01.png",
                selectedIconPath: "/images/icon/nav_icon_01.png",
                text: "购物商城",
                selected: true
            },
            {
                pagePath: "../shop-classify/shop-classify",
                selectedColor: "#000000",
                iconPath: "/images/icon/nav_icon_02.png",
                selectedIconPath: "/images/icon/nav_icon_02.png",
                text: "分类",
                selected: false
            },
            {
                pagePath: "../shop-trolley/shop-trolley",
                selectedColor: "#000000",
                iconPath: "/images/icon/nav_icon_03.png",
                selectedIconPath: "/images/icon/nav_icon_03.png",
                text: "购物车",
                selected: false
            },
            {
                pagePath: "../member-center/member-center",
                selectedColor: "#000000",
                iconPath: "/images/icon/nav_icon_04.png",
                selectedIconPath: "/images/icon/nav_icon_04.png",
                text: "会员中心",
                selected: false
            }
        ],
        position: "bottom"
    },
    changeTabBar: function() {
        var _curPageArr = getCurrentPages();
        var _curPage = _curPageArr[_curPageArr.length - 1];
        var _pagePath = _curPage.__route__;
        if (_pagePath.indexOf('/') != 0) {
            _pagePath = '/' + _pagePath;
        }
        var tabBar = this.tabbar;
        for (var i = 0; i < tabBar.list.length; i++) {
            tabBar.list[i].selected = false;
            if (tabBar.list[i].pagePath == _pagePath) {
                tabBar.list[i].selected = true; //根据页面地址设置当前页面状态  
            }
        }
        _curPage.setData({
            tabbar: tabBar
        });
    },
    // 全局数据
    globalData: {
        submitShop: [],
        nickName: '',
        avatarUrl: ''
    },
    onLaunch: function() {
        if (!wx.cloud) {
            console.error('请使用 2.2.3 或以上的基础库以使用云能力')
        } else {
            wx.cloud.init({
                traceUser: true,
            })
        }
        // 获取用户信息
        wx.getSetting({
            success: res => {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                        success: res => {
                            // 可以将 res 发送给后台解码出 unionId
                            this.globalData.nickName = res.userInfo.nickName;
                            this.globalData.avatarUrl = res.userInfo.avatarUrl;
                            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                            // 所以此处加入 callback 以防止这种情况
                            if (this.userInfoReadyCallback) {
                                this.userInfoReadyCallback(res)
                            }
                        }
                    })
                }
            }
        })
    },

    // 提交的商品
    onBuyShop: function (param) {
        this.globalData.submitShop = param;
        console.log(this.globalData)
    },
})