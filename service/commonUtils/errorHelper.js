var exp = function () {
};

exp.prototype.Keys = {
    "inputParamRangError": "inputParamRangError",
    "inputParamTypeError": "inputParamTypeError",
    "inputMsgComplete": "inputMsgComplete",
    "inputInfoIsNotComplete": "inputInfoIsNotComplete",
    "userInfoIsNotComplete": "userInfoIsNotComplete",
    "emailIsRepeat": "emailIsRepeat",
    "notFoundUser": "notFoundUser",
    "userPwdError": "userPwdError",
    "unknownError": "unknownError",
    "folderNameRepeat": "folderNameRepeat",
    "TagNameRepeat": "TagNameRepeat",
}

exp.prototype.errorMenu = {
    "inputMsgComplete": {
        "code": 404,
        "msg": "参数不完整"
    },
    "inputParamTypeError": {
        "code": 404,
        "msg": "输入参数类型错误"
    },
    "inputInfoIsNotComplete": {
        "code": 404,
        "msg": "输入参数不完整"
    },
    "userInfoIsNotComplete": {
        "code": 500,
        "msg": "用户信息不完整"
    },
    "emailIsRepeat": {
        "code": 500,
        "msg": "邮箱已被占用"
    },
    "notFoundUser": {
        "code": 500,
        "msg": "未找到该用户"
    },
    "userPwdError": {
        "code": 500,
        "msg": "用户密码错误"
    },
    "folderNameRepeat": {
        "code": 406,
        "msg": "文件夹名称重复"
    },
    "TagNameRepeat": {
        "code": 406,
        "msg": "标签名称重复"
    },
    "inputParamRangError": {
        "code": 406,
        "msg": "输出参数范围错误"
    },
    "unknownError": {
        "code": 500,
        "msg": "未知错误"
    },

}
exp.prototype.throwErrorMsg = function (errorMsg) {
    throw new Error(errorMsg);
}

module.exports = exp;