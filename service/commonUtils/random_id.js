/**
 * User: Coen
 * Date: 2017/3/30
 * Time: 15:31
 */
var _, exp;
var crypto = require('crypto');
exp = function(){
    console.log("[Object][utils][Object]:[Constructor]");
};
exp.prototype.newId = function(){
    return this.newIdByLength(16);
};
exp.prototype.newIdByLength = function(size) {
    if (size === 0) {
        throw new Error('Zero-length randomString is useless.');
    }
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' + 'abcdefghijklmnopqrstuvwxyz' + '0123456789';
    var objectId = '';
    // var bytes = (0, crypto.randomBytes)(size);
    var bytes = crypto.randomBytes(size);
    // console.log(bytes)
    for (var i = 0; i < bytes.length; ++i) {
        // num = bytes.readUInt8(i)
        // console.log("" + "num " + i + " = " + num)
        objectId += chars[bytes.readUInt8(i) % chars.length];
    }
    return objectId;
};
module.exports = exp;