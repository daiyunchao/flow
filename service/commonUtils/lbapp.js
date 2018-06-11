/**
 * User: Administrator
 * Date: 2015/5/15
 * Time: 20:20
 */
var exp;
exp = function(){
  console.log("[bean][lbapp][Constructor]");
};
exp.prototype.init = function(lbApp){
  console.log("in lbapp init",lbApp);
  this.lbApp = lbApp;
};
exp.prototype.getLbApp = function(){
  return this.lbApp;
};
exp.prototype.getLbModel = function(modelName){
  return this.lbApp.models[modelName];
};
module.exports = exp;