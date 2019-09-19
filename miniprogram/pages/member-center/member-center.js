const app = getApp();
const db = wx.cloud.database();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        tabbar: {},
        nickName: '',
        avatarUrl: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        app.changeTabBar();
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        this.getData();
    },
    // 获取资料
    getData: function() {
        wx.cloud.callFunction({
            name: 'login'
        }).then(res => {
            db.collection('personalData').where({
                _openId: res.result.openId
            }).get().then(res => {
                this.setData({
                    nickName: res.data[0].nickName,
                    avatarUrl: res.data[0].fileID
                });
            });
        });
    },

    // 修改头像 
    updataFile: function() {
        const that = this;
        // 第一步 上传图片
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success(res) {
                const tempFilePaths = res.tempFilePaths
                wx.cloud.callFunction({
                    name: 'login'
                }).then(res => {
                    var openId = res.result.openId;
                    db.collection('personalData').where({
                        _openId: openId
                    }).get().then(res => {
                        // 如果有数据 进第二次判断查询有没有用户名字段 否则添加用户名字段
                        if (res.data.length >= 1) {
                            var id = res.data[0]._id;
                            // 第二步 云储存上传文件
                            wx.cloud.uploadFile({
                                cloudPath: 'head-portrait.png',
                                filePath: tempFilePaths[0], // 文件路径
                                success: res => {
                                    console.log(res.fileID, id);
                                    // 第三步 插入云数据库
                                    db.collection('personalData').doc(id).updata({
                                        data: {
                                            fileID: res.fileID
                                        }
                                    }).then(res => {
                                        console.log(res);
                                        db.collection('personalData').where({
                                            _openId: openId
                                        }).get().then(res => {
                                            console.log(res);
                                            that.setData({
                                                avatarUrl: res.data[0].fileID
                                            })
                                        });
                                    }).catch(err => {
                                        console.log(err);
                                    });
                                    // get resource ID
                                },
                                fail: err => {
                                    // handle error
                                }
                            })
                        }
                    })
                })
            }
        })
    },

    not: function() {
        wx.showToast({
            title: '敬请期待',
            icon: 'none',
            duration: 2000
        })
    }
})