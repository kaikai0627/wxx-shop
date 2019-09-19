const app = getApp();
var db = wx.cloud.database();
Page({
    /**
     * 页面的初始数据
     */
    data: {
        id: null,
        list: [],
        shopId: 0,
        shopList: [],
        listState: true,
        loadModal: false,
        index: 0,
        selectedSort: 0,
        sort: ['默认排序', '价格最低', '价格最高'],
        salesIs: true,
        salesIcon: true,
        price: null,
        tabbar: {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        app.changeTabBar();
        db.collection('index')
            .get().then(res => {
                var list = [];
                for (var i = 0; i < Object.keys(res.data[1].shopType).length; i++) {
                    list.push(res.data[1].shopType[i].text);
                }
                this.setData({
                    list
                });
            }).catch(err => {
                console.log(err);
            });
        var id = options.id || 0;
        this.setData({
            id
        });
        this.getDataShopList();
    },
    // 获取商品列表数据
    getDataShopList: function() {
        this.setData({
            loadModal: true
        })
        db.collection('shopClassify').where({
            id: String(this.data.id)
        }).get().then(res => {
            // 这里把数据库获取的对象转一下数组 以便方便使用sort
            var shopList = [];
            var dataList = res.data[this.data.shopId].shopList;
            for (var i = 0; i < Object.keys(dataList).length; i++) {
                shopList.push(dataList[i]);
            }
            this.setData({
                shopList,
                listState: true
            })
        }).catch(err => {
            this.setData({
                listState: false
            });
            console.log(err);
        });
        // 数据太少 体现不出loading效果 加个定时器
        setTimeout(() => {
            this.setData({
                loadModal: false
            })
        }, 500);
    },
    // 左侧菜单栏切换
    tabSelect(e) {
        var id = e.currentTarget.dataset.id
        this.setData({
            shopList: {},
            listState: false,
            id,
            shopId: id
        });
        this.getDataShopList();
    },
    // 价格排序 默认排序
    bindSortChange: function(e) {
        var val = e.detail.value;
        var shopList = this.data.shopList;
        // val=1时价格从低到高 =2时价格从高到低 =0时默认排序 
        if (val == 1) {
            shopList.sort((a, b) => {
                return a.shopPrice - b.shopPrice
            });
        } else if (val == 2) {
            shopList.sort((a, b) => {
                return b.shopPrice - a.shopPrice
            });
        } else {
            this.getDataShopList();
        }
        this.setData({
            salesIs: true,
            salesIcon: true,
            index: val,
            selectedSort: 0,
            shopList
        });
    },
    // 按销量排序
    onSalesTap: function() {
        var salesIs = this.data.salesIs;
        var shopList = this.data.shopList;
        // salesIs=true时销量从高到低排序 =false时相反
        if (salesIs) {
            shopList.sort((a, b) => {
                return b.salesVolume - a.salesVolume
            });
            this.setData({
                salesIs: false,
                salesIcon: true
            })
        } else {
            shopList.sort((a, b) => {
                return a.salesVolume - b.salesVolume
            });
            this.setData({
                salesIs: true,
                salesIcon: false
            })
        }
        this.setData({
            shopList,
            selectedSort: 1
        })
    },
    // 打开筛选模态框
    showModal(e) {
        this.setData({
            modalName: e.currentTarget.dataset.target
        })
    },
    // 关闭筛选模态框
    hideModal(e) {
        this.setData({
            modalName: null
        })
    },
    // 重置筛选
    onResetTap(e) {
        this.setData({
            price: null
        });
    },
    // 筛选价格 最低价 最高价
    changeForm(param) {
        var param = param.detail.value;
        var shopList = this.data.shopList;
        var newShopList = [];
        if (param.bottomPrice != "" && param.peakPrice != "") {
            for (var i = 0; i < shopList.length; i++) {
                if (shopList[i].shopPrice >= parseFloat(param.bottomPrice) && shopList[i].shopPrice <= parseFloat(param.peakPrice)) {
                    newShopList.push(shopList[i]);
                }
            }
            this.setData({
                shopList: newShopList
            });
            this.hideModal();
        } else {
            wx.showModal({
                title: '提示',
                showCancel: false,
                content: '请输入正确价格',
                duration: 2000
            });
        }
    },
    // 跳转详情页
    onDetailTap: function(e) {
        var id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: './cosmetic-detail/cosmetic-detail?id=' + id
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