/**
 * Created by dell on 2016/11/22.
 */
var async = require("async");
var fs = require("fs");
var gm = require('gm');
var crypto = require('crypto');
var common = function () {
}

//创建单例:
common.prototype.createSingle = function (cb) {
  var instance;
  return function () {
    if (instance) return instance;
    instance = cb();
    return instance;
  }
}

common.prototype.newId = function () {
  return this.newIdByLength(16);
};

common.prototype.newIdByLength = function (size) {
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

//将时间戳转换为时间:
common.prototype.getDateTimeByTimeStamp = function (timeStamp) {
  if (timeStamp) {
    timeStamp = Number(timeStamp);
  }
  var date = new Date(timeStamp);
  var Y = date.getFullYear() + '-';
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  var D = date.getDate() + ' ';
  var h = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':';
  var m = date.getMinutes() < 10 ? '0' + date.getMinutes() + ':' : date.getMinutes() + ':';
  var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
  return Y + M + D + h + m + s;
}

var fileSizeIsOutLimit = function (imagePath, limit) {
  var states = fs.statSync(imagePath);
  var fileSize = states.size;
  if (fileSize >= limit * 1024) {
    console.log("get image file size >=", limit);
    return true;
  }
  return false
}

//判断文件是否超过了现在
var fileSizeIsOutLimitByBuffer = function (buffer, limit) {
  var fileSize = buffer.length;
  if (fileSize >= limit * 1024) {
    console.log("get image file size >=", limit);
    return true;
  }
  return false
}


common.prototype.compressImageByBase64 = function (imageBase64, cb) {
  //获取Image的Buffer:
  // console.log("in compressImageByBase64");
  var sourceWidth = 0;
  var sourceHeight = 0;
  var imageBuffer = new Buffer(imageBase64, 'base64');
  gm(imageBuffer)
    .resize(800)
    .toBuffer(function (err, newBuffer) {
      var base64Image = newBuffer.toString("base64");
      if (err) return cb("hasError");
      return cb(null, base64Image);
    })
}
var compressImage = function (imagePath, callback) {
  var sourceWidth = 0;
  var sourceHeight = 0;
  async.waterfall(
    [
      function getImageSize(cb) {
        var fileSizeIsOutLimitFlag = fileSizeIsOutLimit(imagePath, 100);
        if (!fileSizeIsOutLimitFlag) {
          return cb({"err": "image file size <100"});
        }
        gm(imagePath)
          .size(function (err, size) {
            if (err) return cb(err);
            sourceWidth = size.width;
            sourceHeight = size.height;
            cb(null);
          });
      },
      function convertImageToJpeg(cb) {
        console.log("in convert image to jpeg ");
        gm(imagePath).compress("JPEG")
          .write(imagePath + ".jpg", function (err) {

            if (err) return cb({"err": "convert to jpeg error -->" + err});
            imagePath += ".jpg";
            console.log("convert image to jpeg ,jpeg path-->", imagePath);
            cb(null);
          });
      },
      function compressImage75(cb) {
        var fileSizeIsOutLimitFlag = fileSizeIsOutLimit(imagePath, 200);
        if (!fileSizeIsOutLimitFlag) {
          return cb({"err": "image file size <200"});
        }
        console.log("in convert image to 0.75 ");
        gm(imagePath)
          .thumb(sourceWidth * 0.75, sourceHeight * 0.75, imagePath, 75, function () {
            cb(null);
          })
      },
      function getImageFileSize(cb) {
        var fileSizeIsOutLimitFlag = fileSizeIsOutLimit(imagePath, 200);
        if (!fileSizeIsOutLimitFlag) {
          return cb({"err": "image file size <200"});
        }
        console.log("in convert image to 0.5 ");
        gm(imagePath)
          .thumb(sourceWidth * 0.5, sourceHeight * 0.5, imagePath, 75, function () {
            cb(null);
          })
      }
    ], function (err) {
      return callback(null, imagePath);
    })
}

//验证是否不为null或是undefined
common.prototype.IsNotNullOrUndefined = function (obj) {
  if (obj != undefined && obj != null) {
    return true;
  }
  return false;
}

common.prototype.validateObjectTypeRequireProps = function ({validateObj, propsArr}) {
  let ret = true;
  if (!validateObj) {
    return false;
  }
  loop:
    for (let propName in validateObj) {
      if ((propsArr.indexOf(propName) > -1) && !validateObj[propName]) {
        console.log(`validateObjectTypeRequireProps propName value is Empty propName is ${propName}`);
        ret = false;
        break loop;
      }
    }
  return ret;
}
module.exports = common;