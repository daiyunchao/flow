/**
 * Created by dyc on 2017/3/22.
 * ·路由文件
 */
var path = require('path');
var multiparty = require('multiparty');
var indexRouter = function () {

}
indexRouter.prototype.initRouter = function (app, loopback, callback) {
    var StaticOpt = {
        // maxAge: '30d'//设定缓存时间
        maxAge: 0
    };
    let prex = '/proccess';
    console.log("in init router method");
    app.use(prex + '/index.html', loopback.static(path.join(__dirname, '../../client/build/index.html'), StaticOpt));
    app.use(prex + '/login.html', loopback.static(path.join(__dirname, '../../client/build/index.html'), StaticOpt));
    app.use(prex + '/register.html', loopback.static(path.join(__dirname, '../../client/build/index.html'), StaticOpt));
    app.use(prex + '/share.html', loopback.static(path.join(__dirname, '../../client/build/index.html'), StaticOpt));
    app.use(prex + '/static/css/', loopback.static(path.join(__dirname, '../../client/build/static/css'), StaticOpt));
    app.use(prex + '/static/js/', loopback.static(path.join(__dirname, '../../client/build/static/js'), StaticOpt));
    app.use(prex + '/axios.min.js', loopback.static(path.join(__dirname, '../../client/build/axios.min.js'), StaticOpt));
    app.use(prex + '/images/', loopback.static(path.join(__dirname, '../../client/build/images'), StaticOpt));
    // app.use(prex + '/index.html', function (req, res, next) { console.log("in router  =>", path.join(__dirname, '../../client/build/index.html')); next() }, loopback.static(path.join(__dirname, '../../client/build/index.html'), StaticOpt));
    // app.use(prex + '/static/', loopback.static(path.join(__dirname, '../../client/build/static/'), StaticOpt));
    callback();
}
module.exports = indexRouter;