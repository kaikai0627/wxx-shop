// 手机格式验证
function regexConfig() {
    var reg = {
        phone: /^1(3|4|5|6|7|8)\d{9}$/
    }
    return reg;
}

function meaningString(params) {
    var param = params;
    param = JSON.stringify(param);
    param = param.replace("{", "");
    param = param.replace("}", "");
    param = param.replace(/,/g, "&");
    param = param.replace(/:/g, "=");
    param = param.replace(/"/g, "");
    return param;
}

// 通用方法 修改个人资料
function commonEditText (dataName, dataVal) {
    const db = wx.cloud.database();
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
}

module.exports = {
    regexConfig,
    meaningString,
    commonEditText
}
