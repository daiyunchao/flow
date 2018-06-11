var G = require('bearcat-helper');
var loopback = require('loopback');
module.exports = function (server) {
  // Install a `/` routes that returns server status
  var router = server.loopback.Router();
  G("router:indexRouter").initRouter(server, loopback, function () { });
  router.get('/', server.loopback.status());
  server.use(router);
};
