
var fs, path, mout, allconfig;
fs = require('fs');
path = require('path');
mout = require('mout');
log=console.log.bind(this);

allconfig = function() {
  log("in all config ");
};

allconfig.prototype.readAllConfig = function(env){
  var self, CONFIG_PATH, files, e, i$, len$, file, Absfile;
  self = this;
  CONFIG_PATH = __dirname + "/" + env;
  log("read all config try to read config path =",CONFIG_PATH);
  try {

    //读取配置中的全部文件
    files = fs.readdirSync(CONFIG_PATH);
  } catch (e$) {
    e = e$;
    console.error("[bean][config][allconfig]:[readAllConfig] CONFIG_PATH = ", CONFIG_PATH);
    console.error("[bean][config][allconfig]:[readAllConfig]: read config folder error, please check your start param, eg: -e prod");
    console.error("[bean][config][allconfig]:[readAllConfig]: " + e.message);
    console.error('[bean][config][allconfig]:[readAllConfig]: exit process');

    //如果读取文件出现错误,退出程序:
    process.exit(1);
    return;
  }
  for (i$ = 0, len$ = files.length; i$ < len$; ++i$) {
    file = files[i$];

    //如果是js文件 处理文件:
    if (mout.string.endsWith(file, 'js')) {
      Absfile = CONFIG_PATH + '/' + file;

      //请求全部文件:
      self[path.basename(file, '.js')] = require(Absfile);
    }
  }
};
module.exports = allconfig;