// Generated by LiveScript 1.3.1
/**
 * User: Administrator
 * Date: 2015/3/19
 * Time: 11:48
 */
var protobufjs, crypto, WbPbMsgJsonDefine, builder, WbPbMsg, AccessToken, createByBinary, decodeByBinary, convertPbLongToJsonNumber, convertPbObjToJsonObj, createHexToken, decodeHexToken;
protobufjs = require('protobufjs');
crypto = require('crypto');
WbPbMsgJsonDefine = {
    "package": "WbPbMsg",
    "messages": [{
        "name": "AccessToken",
        "fields": [
            {
                "name": "uid",
                "type": "string",
                "rule": "required",
                "id": 1
            }, {
                "name": "createTime",
                "type": "int64",
                "rule": "required",
                "id": 2
            }, {
                "name": "ttl",
                "type": "int64",
                "rule": "required",
                "id": 3
            }, {
                "name": "deviceType",
                "type": "int32",
                "rule": "optional",
                "id": 4
            }, {
                "name": "userName",
                "type": "string",
                "rule": "optional",
                "id": 5
            }, {
                "name": "connectorServerId",
                "type": "string",
                "rule": "optional",
                "id": 6
            }
        ],
        "enums": [],
        "imports": [],
        "options": {},
        "services": []
    }],
    "enums": [],
    "imports": [],
    "options": {},
    "services": []
};
// console.log(protobufjs);
builder = protobufjs.loadJson(WbPbMsgJsonDefine);
WbPbMsg = builder.build("WbPbMsg");
AccessToken = WbPbMsg.AccessToken;
createByBinary = function (params, pwd) {
    var cipher, enc;
    cipher = crypto.createCipher('aes256', pwd);
    enc = cipher.update(params, 'binary', 'hex');
    enc += cipher.final('hex');
    return enc;
};
decodeByBinary = function (params, pwd) {
    var decipher, dec;
    decipher = crypto.createDecipher('aes256', pwd);
    dec = decipher.update(params, 'hex', 'binary');
    dec += decipher.final('binary');
    return new Buffer(dec, 'binary');
};
convertPbLongToJsonNumber = function (pbobj) {
    var i;
    for (i in pbobj) {
        if (pbobj.hasOwnProperty(i)) {
            if (pbobj[i] instanceof protobufjs.Long) {
                pbobj[i] = pbobj[i].toNumber();
            }
            if (typeof pbobj[i] === 'object') {
                convertPbLongToJsonNumber(pbobj[i]);
            }
        }
    }
    return pbobj;
};
convertPbObjToJsonObj = function (pbobj) {
    convertPbLongToJsonNumber(pbobj);
    return pbobj.toRaw();
};
createHexToken = function (jsonValue, cryptoKey) {
    var accessTokenObj, encodeHexString;
    accessTokenObj = new AccessToken(jsonValue);
    encodeHexString = createByBinary(accessTokenObj.encodeNB(), cryptoKey);
    return encodeHexString;
};
decodeHexToken = function (hexValue, cryptoKey) {
    var decodeBuf, pbAccessTokenObj, accessTokenObj;
    decodeBuf = decodeByBinary(hexValue, cryptoKey);
    pbAccessTokenObj = AccessToken.decode(decodeBuf);
    accessTokenObj = convertPbObjToJsonObj(pbAccessTokenObj);
    return accessTokenObj;
};
module.exports.createHexWbAccessToken = createHexToken;
module.exports.decodeHexWbAccessToken = decodeHexToken;