class commHelper {

  //拷贝属性
  copyProps = ({
    source,
    copyObj
  }) => {
    for (let item in source) {
      if (copyObj) {
        if (copyObj.hasOwnProperty(item)) {
          source[item] = copyObj[item];
        }
      }
    }
    return source;
  }

  //将时间戳转换为时间:
  getDateTimeByTimeStamp = (timeStamp) => {
    var date = new Date(Number(timeStamp));
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
    var h = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':';
    var m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    return Y + M + D + h + m;
  }

  //修改location地址
  locationPush({ path }) {
    window.myHistory.push(
      {
        pathname: path
      });
  }

  //获取分享链接
  getShareLink(pref, flowProcessId) {
    let origin = window.location.origin;
    return `${origin}${pref}/share.html?key=${flowProcessId}`;
  }

  getUrlParams(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
      results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1]);
  }


}
export default new commHelper();