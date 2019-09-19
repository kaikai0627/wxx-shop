const db = wx.cloud.database();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        shippingAddress: [],
        loadModal: false,
        chooseIs: false,
        notText: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (options.chooseIs) {
            this.setData({
                chooseIs: options.chooseIs
            }) 
        }
    },
    onShow: function () {
        // 显示loading
        this.setData({
            loadModal: true
        });
        this.getAddressData();
    },
    // 获取收货地址
    getAddressData: function() {
        wx.cloud.callFunction({
            name: 'login'
        }).then(res => {
            db.collection('shippingAddress').where({
                _openId: res.result.openId
            }).get().then(res => {
                this.setData({
                    shippingAddress: res.data
                });
            }).catch(err => {
                console.log(err);
                this.setData({
                    notText: '还没有收获地址'
                });
            });
            setTimeout(() => {
                // 数据加载完 关闭loading
                this.setData({
                    loadModal: false
                });
            }, 300);
        })
    },
    // 跳至编辑页面
    goEditAddress: function(e) {
        var id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: './edit-address/edit-address?id=' + id
        })
    },
    // 跳至添加页面
    goAddAddress: function(e) {
        wx.navigateTo({
            url: './add-address/add-address',
        })
    },
    // 选择收货地址
    chooseAddress: function(e) {
        if (this.data.chooseIs) {
            var param = e.currentTarget.dataset.param;
            wx.navigateTo({
                url: '../../submit-order/submit-order?consignee=' + param.consignee 
                    + '&phone=' + param.phone
                    + '&region=' + param.region[0]
                    + ' ' + param.region[1]
                    + ' ' + param.region[2]
                    + '&detailRegion=' 
                    + param.detailRegion,
            })
        }
    }
})