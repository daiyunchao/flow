import { observable, computed, autorunAsync, action, extendObservable } from "mobx";

/**
 * 通用Modal提示框的Model
 * 提供数据和状态
 * 单例
 */
class CommonModal {

    //初始化方法
    constructor() {

        //UI显示的状态:
        this.status = {};

        //初始化状态信息:
        extendObservable(this.status,
            {
                "title": "这是标题",//UI显示的标题
                "content": "这是内容",//UI显示的内容,目前只能是纯文本
                "isShow": false,//是否显示对话框
                "sureCB": function () {//点击确定的回调函数
                },
                "cancelCB": function () {//点击取消的回调函数
                },
            })
    }

    //显示对话框
    showModal() {
        this.status.isShow = true;
    }

    //隐藏对话框
    hiddenModal() {
        this.status.isShow = false;
    }

    //设置Modal的相关信息
    setModalInfo({ isShow = true, title, content, sureCB = function () { }, cancelCB = function () { } }) {
        this.status.title = title;
        this.status.content = content;
        this.status.sureCB = () => {
            sureCB();
            this.status.isShow = false;
        };
        this.status.cancelCB = () => {
            cancelCB();
            this.status.isShow = false;
        };
        this.status.isShow = isShow;
    }
}
export default new CommonModal();