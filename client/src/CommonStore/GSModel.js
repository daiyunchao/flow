/**
 * 全局model
 * 用于组件和组件之间 或是页面与页面之前的数据传递
 */

import commHelper from '../CommonUtils/commHelper';
import ContentModel from '../FlowContent/store/ContentModel';
import EventHandler from '../CommonUtils/eventHandler';
import UserModel from './UserModel'
class GSModle {
    baseInfoSetting = {
        userId: "",
        routerPathPrex: "/proccess",
    }
    init() {
        let currentUrl = window.location.href;
        console.log("in gs model init==>", currentUrl);
        if (currentUrl.indexOf("/share.html") > -1) {
            //正在显示分享页:
            this.initShareStatusData();
        } else if (currentUrl.indexOf("/login.html") > -1) {

        }
        else if (currentUrl.indexOf("/register.html") > -1) {

        }
        else {
            //如果是在非登录或是注册页,则去获取用户信息:
            console.log("get user detail bef");
            UserModel.getUserDetail();

        }
    }



    async initShareStatusData() {
        let newModel = new ContentModel();
        let flowContentId = commHelper.getUrlParams("key");
        if (!flowContentId) {
            return EventHandler.dispatchEvent(
                {
                    "key": "contentHasError",
                    "args": []
                }
            );
        }
        newModel.data.flowProcessId = flowContentId;
        console.log("flowContentId==>", flowContentId)
        await newModel.getShareFlowContentDetail();
        if (newModel && newModel.data.title) {
            //成功的查询到了数据:
            EventHandler.dispatchEvent(
                {
                    "key": "getProcessDetail",
                    "args": [newModel]
                }
            );
        }
        else {
            //查询失败了
            EventHandler.dispatchEvent(
                {
                    "key": "contentHasError",
                    "args": []
                }
            );
        }


    }
}
export default new GSModle();