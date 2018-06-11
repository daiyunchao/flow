/**
 * Created by dell on 2015/9/21.
 */
module.exports = function (options) {
    var tokenValidate = require("./AccessToken.js");
    var validateToken = function (token, uid) {
        var tokenObj = tokenValidate.decodeHexWbAccessToken(token, "dkLVkw2E4j8rD6YQ9S345duyDFJ223");
        console.log(tokenObj);
        var tokenTTL = tokenObj["ttl"];
        var tokenCreateTime = tokenObj["createTime"];

        //token 有效的两个条件:
        //uid相等 并且时间没有过期
        if (tokenObj.uid == uid && (tokenCreateTime + tokenTTL) > Date.now()) {
            //验证通过:
            return true;
        }
        else {
            //验证失败:
            return false;
        }
    }
    var getParams = {
        get: function (req, res, callback) {
            var header = req.headers;
            if (header) {
                return callback(null, req.headers);
            }
            return callback("not header or content-type is error");
        },
        post: function (req, res, callback) {
            var header = req.headers;
            if (header) {
                if (header["content-type"].indexOf("application/json") >= 0 || header["content-type"].indexOf("application/x-www-form-urlencoded") >= 0) {
                    return callback(null, req.headers);
                }
            }
            return callback("not header or content-type is error");
        },
        put: function (req, res, callback) {
            getParams.post(req, res, callback)
        }
    };

    var notValidateUrlKey = [
        "/explorer"
    ];
    return function goindex(req, res, next) {
        var url = req.originalUrl;
        //如果是post提交的:explorer
        //console.log("url==>", url);
        // app.use(prex + '/share_activity/index_:vs.js', loopback.static(path.join(__dirname, '../../client/activity/dist/index.js'), StaticOpt));
        // if(url.indexOf("/process")>-1){

        // }
        next();
        // if (req && req.method) {
        //     var method = req.method.toLowerCase()
        //     //如果是POST提交的或是PUT提交的:
        //     getParams[method](req, res, function (err, params) {
        //         //将参数进行token验证:
        //         //console.log("get params ==>",params);
        //         if (params && params.uid && params.token && params.uid != 0 && params.token != "token") {
        //             //如果有uid和token,进行合法验证
        //             var tokenIsTrue = validateToken(params.token, params.uid);
        //             if (tokenIsTrue) {
        //                 //token验证是成功的
        //                 console.log("validate token success")
        //                 next();
        //             }
        //             else {
        //                 console.log("validate token error");
        //                 res.send("token is Error");
        //                 res.end();
        //             }
        //         }
        //         else {
        //             //如果没有token 则判断是否该被验证,如果应该被验证,而未传递token和uid则错误
        //             //如果不需要验证,则直接next()
        //             var isNotValidateToken = false;
        //             for (var i = 0; i < notValidateUrlKey.length; i++) {
        //                 var item = notValidateUrlKey[i];
        //                 if (url.indexOf(item) >= 0) {
        //                     //如果是包含
        //                     isNotValidateToken = true;
        //                     break;
        //                 }
        //             }
        //             if (isNotValidateToken) {
        //                 //如果是不需要验证token,直接next;
        //                 next();
        //             }
        //             else {
        //                 //如果需要验证,但未传递,则错误:
        //                 res.send("token is Error");
        //                 res.end();
        //             }
        //         }
        //     });
        // }
    };
}
