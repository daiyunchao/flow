var loopback = require('loopback');
var boot = require('loopback-boot');
var path = require('path');
var multiparty = require('multiparty');
var fs=require("fs");
var http = require('http');
var cors = require('cors')

var multipartyFrom = function (req, res, next) {
  var form = new multiparty.Form();
  form.parse(req, function (err, fields, files) {
    if (err) {
      console.error(err);
      res.status(500).send("file upload err.");
      return
    }
    req.body = {};
    for (var key in fields) {
      req.body[key] = fields[key][0];
    }
    req.files = {};
    for (var key in files) {
      req.files[key] = files[key][0];
    }
    next();
  });
};


var app = module.exports = loopback();
app.start = function() {
  // start the web server
  var httpsService = process.env.HTTPS;
  var port = process.env.API_PORT;
  console.log("httpsService bef--->", port);
  var server = http.createServer(app);

  var baseUrl="";
  console.log("httpsService-->",httpsService);
  if(httpsService=="true") {
    baseUrl += "https://";
  }
  else {
    baseUrl += "http://";
  }
  baseUrl+=app.get('host') + ':' + port;
  console.log("port--->",port);
  app.use(cors())
  server.listen(port, function() {
    console.log("server-->",app.get("host"));
    app.emit('started', baseUrl);
    console.log('LoopBack server listening @ %s%s', baseUrl, '/');
    if (app.get('loopback-component-explorer')) {
      console.log('Browse your REST API at %s%s');
    }
  });
  return server;
};



// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  console.log('loopback Web server boot err = ', err);
  if (err) throw err;
  var G = require('bearcat-helper');
  var router = G("router:indexRouter");
  router.initRouter(app, loopback, function () {
    app.start();
  });
});
