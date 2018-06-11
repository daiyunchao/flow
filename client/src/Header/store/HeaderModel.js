import { observable, computed, autorunAsync, action, extendObservable } from "mobx";
import ModelBase from '../../CommonStore/ModelBase';
import MainModel from '../../Main/store/MainModel';
import MenuModel from '../../Menu/store/MenuModel';
import CommHelper from '../../CommonUtils/commHelper';
import GSModel from '../../CommonStore/GSModel';
import { message } from 'antd'
class HeaderModel extends ModelBase {
    constructor() {
        super();
        this.data = {};
        this.status = {};
        this.initData();
        this.initStatus();
    }
    initData() {
        extendObservable(this.data, {})
    }
    initStatus() {
        extendObservable(this.status, {})
    }

    //点击发布新流程 
    @action clickNewContentBtn() {
        MainModel.changeStatus({
            "pageStatus": "create"
        });
    }

    //搜索流程
    @action searchContent(searchKey) {
        if (!searchKey) {
            message.warning("请输入 流程名称/流程内容的关键字进行搜索");
            return;
        }
        console.log("searchKey===>", searchKey);
        MenuModel.getContentListBySearchKey({ searchKey });
    }

    @action loginOut() {
        //todo:清除本地存储
        //跳转到登录页
        console.log("in login out");
        localStorage.setItem("flow_helper_name", "");
        localStorage.setItem("flow_helper_pwd", "");
        CommHelper.locationPush({
            "path": GSModel.baseInfoSetting.routerPathPrex + "/login.html"
        });
    }
}
export default new HeaderModel();