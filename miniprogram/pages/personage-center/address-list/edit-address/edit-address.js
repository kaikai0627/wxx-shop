const db = wx.cloud.database();
const util = require("../../../../utils/util.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        region: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const id = options.id;
        this.setData({
            id
        });
        this.getAddressData();
    },
    // 根据参数id获取内容
    getAddressData: function () {
        const id = this.data.id;
        // 获取openid 根据openid查询数据
        wx.cloud.callFunction({
            name: 'login'
        }).then(res => {
            db.collection('shippingAddress').where({
                _openId: res.result.openId
            }).get().then(res => {
                for (var i = 0; i < res.data.length; i++) {
                    if (res.data[i]._id == id) {
                        this.setData({
                            region: res.data[i].region,
                            detailRegion: res.data[i].detailRegion,
                            phone: res.data[i].phone,
                            consignee: res.data[i].consignee
                        });
                        return
                    }
                }
            }).catch(err => {
                console.log(err);
            })
        })
    },
    // 选择地址
    RegionChange: function (e) {
        this.setData({
            region: e.detail.value
        })
    },
    // 提交表单
    formSubmit: function (param) {
        var id = this.data.id;
        var param = param.detail.value;
        var flag = this.verifyRegion(param.detailRegion)
            && this.verifyConsignee(param.consignee)
            && this.verifyPhone(param.phone);
        if (flag) {
            db.collection('shippingAddress').doc(id).update({
                data: {
                    "consignee": param.consignee,
                    "detailRegion": param.detailRegion,
                    "phone": param.phone,
                    "region": param.region
                },
                success: res => {
                    wx.showToast({
                        title: '修改成功',
                        icon: 'success',
                        duration: 2000
                    });
                    setTimeout(() => {
                        wx.navigateBack({
                            delta: 1,
                        });
                    }, 2000);
                },
                fail: err => {
                    console.log(err);
                }
            })
        }
    },
    // 验证收货地址
    verifyRegion: function (param) {
        if (param == "") {
            wx.showModal({
                title: '提示',
                showCancel: false,
                content: '详细地址不能为空'
            })
            return false;
        } else {
            return true;
        }
    },
    // 验证收货人
    verifyConsignee: function (param) {
        if (param == "") {
            wx.showModal({
                title: '提示',
                showCancel: false,
                content: '收货人不能为空'
            })
            return false;
        } else {
            return true;
        }
    },
    // 验证手机号
    verifyPhone: function (param) {
        if (param == "") {
            wx.showModal({
                title: '提示',
                showCancel: false,
                content: '手机号不能为空'
            })
            return false;
        } else {
            var phone = util.regexConfig().phone;
            var inputUserName = param.trim();
            if (phone.test(inputUserName)) {
                return true;
            } else {
                wx.showModal({
                    title: '提示',
                    showCancel: false,
                    content: '请输入正确的手机号码'
                });
                return false;
            }
        }
    }
})