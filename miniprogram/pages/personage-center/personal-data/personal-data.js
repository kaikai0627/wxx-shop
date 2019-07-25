const db = wx.cloud.database();
var app = getApp();
Page({
    /**
     * 页面的初始数据
     */
    data: {
        sex: ['保密', '男', '女'],
        index: 0,
        personalData: [],
        nickName: '',
        avatarUrl: '',
        modalName: null,
        date: 'yyyy-mm-dd',
        region: ['省', '市', '区'],
        vPhone: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({
            nickName: app.globalData.nickName,
            avatarUrl: app.globalData.avatarUrl
        });
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
        this.commonEditText('nickName', nickName);
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
        this.commonEditText('sex', e.detail.value);
        // 修改data中的用户名 同步到视图
        var sex = "personalData[0].sex";
        this.setData({
            index: e.detail.value,
            [sex]: e.detail.value
        });
    },
    // 生日选择
    bindDateChange: function (e) {
        this.commonEditText('date', e.detail.value);
        // 修改data中的用户名 同步到视图
        var date = "personalData[0].date";
        this.setData({
            date: e.detail.value,
            [date]: e.detail.value
        });
    },
    // 地区选择
    bindRegionChange: function (e) {
        this.commonEditText('region', e.detail.value);
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
        this.commonEditText('phone', phone);
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
                console.log(res);
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
    // 通用方法 修改
    commonEditText: function (dataName, dataVal, ) {
        // 登录获取openid 查询云数据库
        wx.cloud.callFunction({
            name: 'login'
        }).then(res => {
            db.collection('personalData').where({
                _openId: res.result.openId
            }).get().then(res => {
                // 如果有数据 进第二次判断查询有没有用户名字段 否则添加用户名字段
                if (res.data.length >= 1) {
                    var id = res.data[0]._id;
                    // 如果已有用户名字段 则进行修改 否则添加
                    db.collection('personalData').doc(id).update({
                        data: {
                            [dataName]: dataVal
                        }
                    });
                    console.log('修改成功')
                    return;
                } else {
                    db.collection('personalData').add({
                        data: {
                            [dataName]: dataVal
                        }
                    })
                }
            });
        });
    },
})