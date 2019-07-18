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

module.exports = {
    regexConfig,
    meaningString
}
