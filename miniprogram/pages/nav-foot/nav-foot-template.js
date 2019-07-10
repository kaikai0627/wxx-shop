// 此脚本仅供参考 页面引用此模板时 记得调用app里的数据与函数
const app = getApp();
Page({
    data: {
        tabbar: {},
    },
    onLoad: function (options) {
        //调用app中的函数
        app.changeTabBar();
    },
})