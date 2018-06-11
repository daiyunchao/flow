import { observable, computed, autorunAsync, action, extendObservable } from "mobx";
import ModelBase from '../../CommonStore/ModelBase';
class MainModel extends ModelBase {
    constructor() {
        super();
        this.data = {};
        this.status = {};
        this.pageStatusList = ["create", "edit", "detail"];
        this.initData();
        this.initStatus();
        // this.getNewHeight();


    }
    initData() {
        extendObservable(this.data, {})
    }

    initStatus() {
        extendObservable(this.status, {
            "pageStatus": "detail",//edit create detail
            "totalHeight": (document.body.clientHeight - 64 - 5)
        })
    }


    //修改当前页面状态为编辑
    changeStatusIsEdit() {
        this.changeStatus({
            "pageStatus": "edit"
        })
    }

    //修改当前页面状态
    changeStatus({ pageStatus }) {
        if (this.pageStatusList.indexOf(pageStatus) > -1) {
            this.status.pageStatus = pageStatus;
        }
    }

    getNewHeight() {
        let self = this;
        let height = window.innerHeight;
        let resizeTimer;
        let eqCount = 0;
        let oldHeight = 0;
        resizeTimer = setInterval(function () {
            let newHeight = window.innerHeight;
            // console.log("newHeight===>",newHeight);
            if (newHeight != height) {
                //找到了新的值
                if (newHeight > height) {
                    self.status.totalHeight = newHeight;
                } else {
                    self.status.totalHeight = document.body.clientHeight;
                }
                if (newHeight == oldHeight) {
                    eqCount += 1;
                }
                if (eqCount >= 10) {
                    clearInterval(resizeTimer);
                }

                if (window.isOnLoad) {
                    clearInterval(resizeTimer);
                }
            }
        }, 200)
    }
}
export default new MainModel();