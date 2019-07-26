const util = require("../../../utils/util.js");
const db = wx.cloud.database();
const app = getApp();
Page({
    /**
     * 页面的初始数据
     */
    data: {
        sex: ['保密', '男', '女'],
        index: 0,
        personalData: [],
        modalName: null,
        date: 'yyyy-mm-dd',
        region: ['省', '市', '区'],
        vPhone: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.getpersonalData();
        this.getFile();
    },
    // 获取个人资料
    getpersonalData: function() {
        wx.cloud.callFunction({
            name: 'login'
        }).then(res => {
            db.collection('personalData').where({
                _openId: res.result.openId
            }).get().then(res => {
                this.setData({
                    personalData: res.data
                })
            }).catch(err => {
                console.log(err);
            })
        })
    },
    // 模态框
    showModal(e) {
        this.setData({
            modalName: e.currentTarget.dataset.target
        })
    },
    hideModal(e) {
        this.setData({
            modalName: null
        })
    },
    // 编辑用户名
    editUserName: function(param) {
        // 获取新编辑的用户名
        var nickName = param.detail.value.nickName;
        util.commonEditText('nickName', nickName);
        // 修改data中的用户名 同步到视图
        var nickNameData = "personalData[0].nickName";
        this.setData({
            nickName,
            [nickNameData]: nickName
        });
        // 最后隐藏模态框
        this.hideModal();
    },
    // 性别选择
    bindPickerChange: function(e) {
        util.commonEditText('sex', e.detail.value);
        // 修改data中的用户名 同步到视图
        var sex = "personalData[0].sex";
        this.setData({
            index: e.detail.value,
            [sex]: e.detail.value
        });
    },
    // 生日选择
    bindDateChange: function (e) {
        util.commonEditText('date', e.detail.value);
        // 修改data中的用户名 同步到视图
        var date = "personalData[0].date";
        this.setData({
            date: e.detail.value,
            [date]: e.detail.value
        });
    },
    // 地区选择
    bindRegionChange: function (e) {
        util.commonEditText('region', e.detail.value);
        // 修改data中的用户名 同步到视图
        var region = "personalData[0].region";
        this.setData({
            region: e.detail.value,
            [region]: e.detail.value
        })
    },
    // 修改手机号
    editPhone: function (param) {
        // 获取新编辑的手机号
        var phone = param.detail.value.phone;
        util.commonEditText('phone', phone);
        // 修改data中的手机号 同步到视图
        var phoneData = "personalData[0].phone";
        this.setData({
            vPhone: phone,
            [phoneData]: phone
        });
        // 最后隐藏模态框
        this.hideModal();
    },
    // 修改头像
    upLoad: function () {
        var that = this;
        // 第一步 上传图片
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success(res) {
                const tempFilePaths = res.tempFilePaths
                console.log(tempFilePaths);
                // 获取图片类型 xxx.jpg xxx.png
                var type = tempFilePaths[0].substring(tempFilePaths[0].length - 3);
                // 第二步 云储存上传文件
                wx.cloud.uploadFile({
                    cloudPath: 'portrait.' + type,
                    filePath: tempFilePaths[0], // 文件路径
                    success: res => {
                        console.log(res.fileID)
                        // 第三步 插入云数据库
                        that.commonEditText('fileID', res.fileID);
                        // var fileID = "personalData[0].fileID";
                        // that.setData({
                        //     [fileID]: '',
                        //     avatarUrl: ''
                        // });
                        that.getFile();
                        // get resource ID
                    },
                    fail: err => {
                        console.log(err)
                        // handle error
                    }
                })
            }
        });
    },
    getFile: function () {
        // 仅创建者可读 需要先获取openid 根据openid展示图片
        wx.cloud.callFunction({
            name: 'login'
        }).then(res => {
            db.collection('personalData').where({
                _openId: res.result.openId
            }).get().then(res => {
                // 修改data中的头像 同步到视图
                var fileID = "personalData[0].fileID";
                this.setData({
                    [fileID]: res.data[0].fileID,
                    avatarUrl: res.data[0].fileID
                });
            });
        }).catch(err => {
            console.log(err);
        })
    },
})