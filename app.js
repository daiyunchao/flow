/**
 * Created by Administrator on 2017/3/22.
 */
/**
 */

var argsparser, bearcat, G, args, contextPath, bearcatOpts;
argsparser = require('argsparser');
bearcat = require('bearcat');
G = require('bearcat-helper');
var log=console.log.bind(this);

args = argsparser.parse();

contextPath = require.resolve('./context.json');

bearcatOpts = {
    BEARCAT_LOGGER: 'off',
    BEARCAT_HOT: 'off',
    BEARCAT_ANNOTATION: 'off'
};

bearcat.createApp([contextPath], bearcatOpts);

bearcat.start(function() {

    var loopbackServer;
    log('app start args = ', args);
    G('config:runtime').create(args);
    loopbackServer = require('./service/server.js');
    console.log("G('commonUtils:lbapp')===>",loopbackServer);
    G('commonUtils:lbapp').init(loopbackServer);
});