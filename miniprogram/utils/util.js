// 手机格式验证
function regexConfig() {
    var reg = {
        phone: /^1(3|4|5|6|7|8)\d{9}$/
    }
    return reg;
}

module.exports = {
    regexConfig
}
