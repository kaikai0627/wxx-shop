const util = require("./utils/util.js");
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
        submitShop: []
    },
    onLaunch: function() {
        if (!wx.cloud) {
            console.error('请使用 2.2.3 或以上的基础库以使用云能力')
        } else {
            wx.cloud.init({
                traceUser: true,
            })
        }
    },
    // 获取用户信息
    onGotUserInfo: function (res) {
        const db = wx.cloud.database();
        wx.redirectTo({
            url: '/pages/index/index',
        });
        if (res.detail.userInfo) {
            // 可以将 res 发送给后台解码出 unionId
            const nickName = res.userInfo.nickName;
            const avatarUrl = res.userInfo.avatarUrl;
            // 登录获取openid 查询云数据库
            wx.cloud.callFunction({
                name: 'login'
            }).then(res => {
                db.collection('personalData').where({
                    _openId: res.result.openId
                }).get().then(res => {
                    // 如果不是第一次进入 则返回 否则将头像用户名 添加到云数据库
                    if (res.data.length >= 1) {
                        return;
                    } else {
                        db.collection('personalData').add({
                            data: {
                                nickName: nickName,
                                fileID: avatarUrl
                            }
                        });
                    }
                });
            });
        } else {
            wx.showToast({
                title: '授权失败',
                icon: 'none',
                duration: 2000
            })
        }
    },
    // 提交的商品
    onBuyShop: function(param) {
        this.globalData.submitShop = param;
    },
})