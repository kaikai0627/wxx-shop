// miniprogram/pages/shop-trolley/shop-trolley.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        shopList: [],
        totalPrice: 0,
        manageIs: true,
        changeManage: '管理',
        checkboxStatus: [],
        allCheckbox: false,
        deleteList: []
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
        this.checkboxStatus();
    },
    // 获取storage存储的商品
    getShopList: function() {
        var shopList = wx.getStorageSync("cart");
        this.setData({
            shopList
        });
    },
    // 商品默认未选中
    checkboxStatus: function() {
        var list = this.data.shopList;
        var checkboxStatus = [];
        if (list.length != 0) {
            for (var i = 0; i < list.length; i++) {
                checkboxStatus.push(false);
            }
        }
        this.setData({
            checkboxStatus
        })
    },
    // 计算总价
    totalPrice: function() {
        var list = this.data.shopList;
        var totalPrice = 0;
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
    isNumber: function(e) {
        var id = e.currentTarget.dataset.id;
        if (e.detail.value < 1) {
            var shopList = this.data.shopList;
            shopList[id].count = 1;
            this.setStorageList(shopList);
        }
    },
    // 通用方法 重新设置商品数量之后调用 重新设置data 更新storage
    setStorageList: function(shopList) {
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
    // 管理商品
    manageShop: function() {
        var manageIs = this.data.manageIs;
        var changeManage;
        if (this.data.changeManage == '管理') {
            changeManage = '完成'
        } else {
            changeManage = '管理'
        }
        this.setData({
            manageIs: !manageIs,
            changeManage
        });
    },
    // 删除商品
    deleteShop: function() {
        var list = this.data.shopList;
        var deleteList = this.data.deleteList;
        var that = this;
        wx.showModal({
            content: '确认将这' + deleteList.length + '个宝贝删除',
            cancelText: '我再想想',
            confirmText: '删除',
            success(res) {
                if (res.confirm) {
                    // 确定删除
                    for (var i = 0; i < deleteList.length; i++) {
                        for (var j = 0; j < list.length; j++) {
                            if (list[j].id == deleteList[i]) {
                                list.splice(j, 1);
                            }
                        }
                    }
                    // 更新storage
                    try {
                        wx.setStorageSync('cart', list)
                    } catch (e) {
                        console.log(e)
                    }
                    // 更新数据
                    that.setData({
                        shopList: list
                    });
                    that.checkboxStatus();
                    // 删除成功 调用提示文本
                    wx.showToast({
                        title: '删除成功',
                        icon: 'none',
                        duration: 2000
                    });
                }
            }
        });
    },
    // 全选 反选
    checkedAll: function () {
        var checkboxStatus = this.data.checkboxStatus;
        var allCheckbox = !this.data.allCheckbox;
        for (var i = 0; i < checkboxStatus.length; i++) {
            checkboxStatus[i] = allCheckbox;
        }
        // 全选时 把所有商品id放入deleteList中 未选中时清空
        var deleteList = [];
        if (checkboxStatus[0]) {
            var shopList = this.data.shopList;
            for (var i = 0; i < shopList.length; i++) {
                deleteList.push(shopList[i].id);
            }
        } else {
            deleteList = [];
        }
        this.setData({
            checkboxStatus,
            allCheckbox,
            deleteList
        });
    },
    // 单选
    handleCheckbox: function (e) {
        var id = e.currentTarget.dataset.id;
        console.log(id);
        var checked = e.currentTarget.dataset.checked;
        var checkboxStatus = this.data.checkboxStatus;
        checkboxStatus[id] = !checked;
        this.setData({
            checkboxStatus
        });
        // 如果商品全部被选中 勾选全选复选框 否则全选复选框的勾选 
        for (var i = 0; i < checkboxStatus.length; i++) {
            if (checkboxStatus[i] == false) {
                this.setData({
                    allCheckbox: false
                })
                return
            } else {
                this.setData({
                    allCheckbox: true
                })
            }
        }
    },
    // 选择商品
    checkboxChange: function (e) {
        this.setData({
            deleteList: e.detail.value
        })
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