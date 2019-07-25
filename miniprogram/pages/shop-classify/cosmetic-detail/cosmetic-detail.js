const app = getApp();
const db = wx.cloud.database();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        id: null,
        shopInfo: {},
        TabCur: 0,
        arr: [],
        count: 1,
        shopId: null,
        shopTotal: 0
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
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        // 获取购物车的缓存数组（没有数据，则赋予一个空数组）
        this.setData({
            arr: wx.getStorageSync('cart') || []
        });
        // （这里的顺序不要动 arr先获取到数据才能获取到arr里的count）
        if (this.data.arr.length != 0) {
            this.shopTotalFun();
        }
    },
    // 获取购物车的总数量
    shopTotalFun: function() {
        var total = 0;
        for (var i = 0; i < this.data.arr.length; i++) {
            total += parseInt(this.data.arr[i].count);
        }
        this.setData({
            shopTotal: total
        })
    },
    // 连接云数据库 根据跳转id获取详情数据
    getDetailData: function() {
        db.collection('cosmeticDetail').where({
            id: this.data.id
        }).get().then(res => {
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
    },
    // 加入购物车
    pushShopTrolley: function(param) {
        // 获取购物车需要的参数
        var param = param.detail.value;
        // 存放购物车的数组
        var arr = this.data.arr;
        if (arr.length > 0) {
            // 遍历购物车数组  
            for (var j in arr) {
                // 判断购物车内的item的id，和事件传递过来的id，是否相等  
                if (arr[j].id == param.id) {
                    // 相等的话，给count+1（即再次添加入购物车，数量+1）  
                    arr[j].count = parseInt(arr[j].count) + 1;
                    // 把购物车数据，存放入缓存
                    try {
                        wx.setStorageSync('cart', arr)
                    } catch (e) {
                        console.log(e)
                    }
                    this.shopTotalFun();
                    wx.showToast({
                        title: '成功加入购物车',
                        icon: 'none',
                        duration: 2000
                    })
                    // +1之后跳出 防止执行push
                    return;
                }
            }
            arr.push(param);
        } else {
            arr.push(param);
        }
        this.setData({
            arr
        });
        // 把购物车数据，存放入缓存
        try {
            wx.setStorageSync('cart', arr)
        } catch (e) {
            console.log(e)
        }
        this.shopTotalFun();
        wx.showToast({
            title: '成功加入购物车',
            icon: 'none',
            duration: 2000
        })
    },
    // 进入购物车
    onGoShopTap: function () {
        wx.navigateTo({
            url: '../../shop-trolley/shop-trolley',
        })
    },
    // 立即购买
    onBuyTap: function () {
        var shopObj = this.data.shopInfo;
        var shopArr = [];
        shopArr.push(shopObj);
        app.onBuyShop(shopArr);
        wx.navigateTo({
            url: '../../submit-order/submit-order',
        })
    }
})