function getDataSource() {
    var argsparser = require('argsparser');
    var dataSourceHome = require('./datasources_local_home.json');
    var dataSourceComp = require('./datasources_local_comp.json');
    var dataSourcePro = require('./datasources_pro.json');
    var args = argsparser.parse();
    var eValue = "";
    for (var item in args) {
        if (item == "-e") {
            //如果是标识环境的对象:
            //将对象改变值:
            eValue = args[item];
        }
    }
    if (eValue == "develop_home") {
        //如果当前环境是开发,则使用开发的配置:
        return dataSourceHome;
    }
    else if (eValue == "develop_comp") {
        //如果当前是产品环境,则使用开发的配置:
        return dataSourceComp;
    }
    else if (eValue == "pro") {
        //如果当前是产品环境,则使用开发的配置:
        return dataSourcePro;
    }
}
module.exports=getDataSource();
