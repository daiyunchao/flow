import { observable, computed, autorunAsync, action, extendObservable } from "mobx";
import { message } from 'antd'
import ModelBase from './ModelBase';
import CommonHelper from '../CommonUtils/commHelper'
import EventHandler from '../CommonUtils/eventHandler'
import AsyncRequest from '../CommonStore/asyncRequest'
import GSModel from '../CommonStore/GSModel';
import CommonModal from '../CommonModal/store/CommonModal';
class UserModel extends ModelBase {
    constructor() {
        super();
        this.initData();
        this.initStatus();
    }
    //初始化监控对象
    initData() {
        extendObservable(this.data, {
            "userId": "",
            "email": "",
            "nickName": "",
            "pwd": "",
            "repeatPwd": "",
            "isActivate": 0,
            "createTime": 0,
        })
    }

    //初始化状态
    initStatus() {
        extendObservable(this.status, {
            "isRemember": true,
            "isLoginIng": false
        });
    }


    @action userNameChange = value => {
        this.dataPropChange(value, `email`);
    }


    @action pwdChange = value => {
        this.dataPropChange(value, `pwd`);
    }

    @action repeatPwdChange = value => {
        this.dataPropChange(value, `repeatPwd`);
    }

    @action rememberCheckStatusChange = value => {
        console.log("rememberCheckStatusChange", value);
        this.statusPropChange(value, `isRemember`);
    }


    @action getUserDetail = async () => {
        console.log("in getUserDetail method");
        let email = localStorage.getItem("flow_helper_name");
        let pwd = localStorage.getItem("flow_helper_pwd");
        if (!email || !pwd) {
            return this.gotoLogin();
        }
        let responseData = await AsyncRequest.getUserInfoByEmailAndPwd({
            "email": email,
            "pwd": pwd
        });
        let userDetail = responseData.userInfo;
        CommonHelper.copyProps({
            "source": this.data,
            "copyObj": userDetail
        });
        GSModel.baseInfoSetting.userId = this.data.userId;
        EventHandler.dispatchEvent({
            "key": "getUserInfo",
            "args": []
        })
    }

    //用户登录
    @action userLogin = async () => {
        try {
            this.status.isLoginIng = true;
            let responseData = await AsyncRequest.userLogin({
                "email": this.data.email,
                "pwd": this.data.pwd
            });
            let userDetail = responseData.userInfo;
            this.getUserDetailAfter(userDetail);
        }
        catch (e) {
            message.error(e.message);
            this.status.isLoginIng = false;
        }
    }

    //用户注册:
    @action userRegister = async ({ email, pwd, nickname }) => {
        //检查两个密码是否输入的相同
        try {
            this.status.isLoginIng = true;
            let responseData = await AsyncRequest.userRegister({
                "email": email,
                "pwd": pwd,
                "nickname": nickname
            });
            let userDetail = responseData.userInfo;

            this.getUserDetailAfter(userDetail);

        } catch (e) {
            message.error(e.message);
            this.status.isLoginIng = false;
        }
    }

    gotoRegister() {
        CommonHelper.locationPush({
            "path": GSModel.baseInfoSetting.routerPathPrex + "/register.html"
        });
    }

    gotoLogin() {
        CommonHelper.locationPush({
            "path": GSModel.baseInfoSetting.routerPathPrex + "/login.html"
        });
    }

    getUserDetailAfter(userDetail) {
        CommonHelper.copyProps({
            "source": this.data,
            "copyObj": userDetail
        });
        GSModel.baseInfoSetting.userId = this.data.userId;

        //添加用户信息到location中
        localStorage.setItem("flow_helper_name", this.data.email);
        localStorage.setItem("flow_helper_pwd", this.data.pwd);
        EventHandler.dispatchEvent({
            "key": "getUserInfo",
            "args": []
        })
        setTimeout(() => {
            this.status.isLoginIng = false;
            CommonHelper.locationPush({
                "path": GSModel.baseInfoSetting.routerPathPrex + "/index.html"
            });
        }, 500)
    }

}
export default new UserModel();