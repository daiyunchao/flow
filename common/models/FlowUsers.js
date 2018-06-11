var G = require('bearcat-helper');
module.exports = function (User) {

    let errorHelper = G("commonUtils:errorHelper");
    //错误消息的枚举
    let errorMsgMenu = errorHelper.Keys;

    //抛出一个错误信息:
    let throwErrorMsg = function (errorMsg) {
        return errorHelper.throwErrorMsg(errorMsg);
    }


    //创建用户,API级
    User.APICreateUser = async function (userObj) {
        //验证邮箱是否重复
        let isTrue = User.validateUser(userObj);
        if (!isTrue) {
            return throwErrorMsg(errorMsgMenu.userInfoIsNotComplete);
        }
        if (userObj && !userObj.userId) {
            //创建用户ID:
            userObj.userId = G("commonUtils:random_id").newId();
        }
        let userCount = await User.getUserCountByEmail({
            "email": userObj.email
        });
        if (userCount) {
            //如果大于0则说明已存在
            return throwErrorMsg(errorMsgMenu.emailIsRepeat);
        }

        //插入:
        await User.createUserByUserObj(userObj);

        //查询该用户
        let newUser = await User.findUserById({
            "userId": userObj.userId
        });

        //返回刚创建的用户
        return newUser;


    }

    //用户登录
    User.APIUserLogin = async function ({ email, pwd }) {
        if (!email || !pwd) {
            return throwErrorMsg(errorMsgMenu.inputInfoIsNotComplete);
        }
        let userInfo = await User.findUserByEmail({email});
        if (!userInfo) {
            return throwErrorMsg(errorMsgMenu.notFoundUser);
        }
        if (userInfo.pwd == pwd) {
            return userInfo;
        }
        else {
            return throwErrorMsg(errorMsgMenu.userPwdError);
        }
    }

    //获取用户信息
    User.APIGetUserInfo = async function ({ userId }) {
        try {
            if (!userId) {
                return throwErrorMsg(errorMsgMenu.inputInfoIsNotComplete);
            }
            return await User.findUserById(userId);

        } catch (e) {
            throw e;
        }
    }

    //通过Email和Pwd获取用户信息
    User.APIGetUserInfoByEmailAndPwd = async function ({
        email,
        pwd
    }) {
        return User.APIUserLogin({
            email,
            pwd
        });
    }

    //验证用户是否正确的对象
    User.validateUser = function (FlowUserObj) {
        return G("commonUtils:common").validateObjectTypeRequireProps({
            "validateObj": FlowUserObj,
            "propsArr": ["email", "pwd"]
        });
    }

    //通过邮箱获取用户当前数量
    User.getUserCountByEmail = async function ({ email }) {
        return await User.count({
            "email": email
        })
    }

    //创建用户
    User.createUserByUserObj = async function (flowUserObj) {

        let canCreate = User.validateUser(flowUserObj);
        if (!canCreate) {
            return throwErrorMsg(errorMsgMenu.userInfoIsNotComplete);
        }
        if (flowUserObj && !flowUserObj.userId) {
            //创建用户ID:
            flowUserObj.userId = G("commonUtils:random_id").newId();
        }

        //初始化创建时间
        flowUserObj.createTime = Date.now();
        console.log("flowUserObj===>", flowUserObj);
        return new Promise((r, j) => {
            User.create(flowUserObj, function (err) {
                if (err) {
                    return j(err)
                }
                return r();
            })
        })
    }

    //通过Id查询用户信息:
    User.findUserById = async function ({ userId }) {
        return await User.findOne({
            "where": {
                "userId": userId
            }
        });
    }

    //通过邮箱查询用户
    User.findUserByEmail = async function ({ email }) {
        return await User.findOne({
            "where": {
                "email": email
            }
        });
    }
}