/**
 */
var exp;
var async=require("async");
var nodemailer = require('nodemailer');
exp = function(){
};
//发送注册验证码:===>
exp.prototype.sendRegEmail=function(toUserEmail,userId) {
    var transporter = nodemailer.createTransport({
        service: 'qq',
        port: 465, // SMTP 端口
        secureConnection: true, // 使用 SSL
        auth: {
            user: '312931671@qq.com',
            //这里密码不是qq密码，是你设置的smtp密码
            pass: 'edjelamjripibjfj'
        }
    });

    var mailOptions = {
        from: '312931671@qq.com', // 发件地址
        to: toUserEmail, // 收件列表
        subject: '欢迎使用LOGO', // 标题
        html: '<b>恭喜您,成功注册LOGO!您激活的链接为:<a href="http://192.168.1.68:8989/activate/reguser?u=' + userId + '&tp='+Date.now()+'">http://192.168.1.68:8989/activate/reguser?u=' + userId + '&tp='+Date.now()+'</a>,激活后可管理您自己的代码段了!</b>'
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);

    });
}
module.exports = exp;