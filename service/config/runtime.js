/**
 * 根据启动参数,选择不同的config文件进行加载
 */
var G, mout, runtime;
G = require('bearcat-helper');
mout = require('mout');
runtime = function(){
  console.log("runtime init ");
};
runtime.prototype.create = function(args){
  this.args = args;

  //默认启动为dev模式
  this.env = 'dev';
  try {
    if (mout.object.has(args, '-e')) {
      this.env = args['-e'];
    } else {
      //如果没有输入 则提示 输入
      console.log('[bean][config][runtime]:[create]: start without -e param, so run as "dev" mode');
    }
  } catch (e$) {}
  G('config:allconfig').readAllConfig(this.env);
};
module.exports = runtime;