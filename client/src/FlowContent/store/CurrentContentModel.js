import { observable, computed, autorunAsync, autorun, action, extendObservable } from "mobx";
import ContentModel from './ContentModel';
import CommHelper from '../../CommonUtils/commHelper';
import EventHandler from '../../CommonUtils/eventHandler';
import MainModel from '../../Main/store/MainModel';
import ContentFolderModel from '../../Folder/store/EditFolderModel';
import ContentTagModel from '../../Tag/store/EditTagModel';
import AsyncRequest from '../../CommonStore/asyncRequest';
import GS from '../../CommonStore/GSModel';
import { message } from 'antd';
/**
 * 当前使用到的ContentModel
 * 继承自ContentModel,但该对象是唯一的
 */
class CurrentContentModel extends ContentModel {
    constructor() {
        super();
        this.registerEvent();
    }

    //添加监听
    registerEvent() {
        //添加监听,当需要获取需要显示的流程详情时,初始化当前Model的数据
        EventHandler.registerEvent({
            "key": "getProcessDetail",
            "fn": (processItem) => {
                this.status.hasContent = true;
                this.status.contentHasError = false;
                this.setVal(processItem.data);
                this.changeContentStatusIsDetail();
            }
        });

        //添加监听,当单项内容改变时,改变Model的Content
        EventHandler.registerEvent(
            {
                "key": "changeCurrentContent",
                "fn": (rowIndex, newContent) => {
                    this.changeItemContent(rowIndex, newContent);
                    this.editSigeItem();
                }
            })

        //当点击一个文件夹是为空时,会触发该事件
        EventHandler.registerEvent(
            {
                "key": "getProcessNoContent",
                "fn": () => {
                    this.status.contentHasError = false;
                    this.status.hasContent = false;
                }
            }
        )

        //当加载一个流程出现错误时被触发
        EventHandler.registerEvent(
            {
                "key": "contentHasError",
                "fn": () => {
                    this.status.contentHasError = true;
                }
            }
        )
    }

    @action changeContentStatusIsEdit() {
        MainModel.changeStatusIsEdit();
    }

    //当用户点击保存按钮时发生:
    @action clickEditSaveBtn() {
        //0.将按钮修改为不可点击状态
        this.changeSaveBtnStatus({
            "isLoadding": true
        });

        //1.基本验证
        let validateSucc = this.validateInputs();
        if (!validateSucc) {
            this.changeSaveBtnStatus({
                "isLoadding": false
            });
            return;
        }
        this.showCreateModel(this.startEditProcess.bind(this));
        //2.提交服务器
        //3.等待服务器响应
        //4.触发事件,通知其他组件或是模型,数据更新了/调用其他模型更新数据

    }

    async deleteFlowContent() {
        let flowProcessId = this.data.flowProcessId;
        try {
           let responseData= await AsyncRequest.deleteFlowContent({
                "userId": GS.baseInfoSetting.userId,
                "flowProcessId": flowProcessId
            });
            if (responseData)
                EventHandler.dispatchEvent({
                    "key": "editProcess",
                    "args": []
                });
            message.success("删除成功");
        } catch (e) {
            console.error("deleteFlowContent throw error ", e)
            message.error("删除失败");
        }

    }

    async startEditProcess() {
        try {
            let newProceess = await this.asyncEditProccess();
            //触发事件
            EventHandler.dispatchEvent({
                "key": "editProcess",
                "args": [newProceess.folderId, newProceess.tagIds.split(','), newProceess]
            })
        } catch (e) {
            message.error("编辑失败");
        }

    }

    async editSigeItem() {
        try {
            let newProceess = await this.asyncEditSingeFlowContentItem();
            EventHandler.dispatchEvent({
                "key": "editProcess",
                "args": []
            })
        } catch (e) {
            message.error("编辑失败");
        }

    }


    //调用服务器端的创建流程
    async asyncEditProccess() {
        try {
            let selectedTags = ContentTagModel.data.selectedTags;
            let tagIds = [];
            let tagNameArr = [];
            for (let i = 0; i < selectedTags.length; i++) {
                tagIds.push(selectedTags[i]["tagId"]);
                tagNameArr.push(selectedTags[i]["tagName"]);
            }
            console.log("ContentFolderModel===>", ContentFolderModel);
            let responseData = await AsyncRequest.editFlowContent({
                "flowProcessId": this.data.flowProcessId,
                "userId": GS.baseInfoSetting.userId,
                "title": this.data.title,
                "folderId": ContentFolderModel.data.selectedFolder.folderId,
                "tagIds": tagIds.join(','),
                "content": this.data.content,
                "isShared": this.data.isShared
            });
            message.success("编辑成功");
            console.log("responseData===>", responseData);
            return responseData["flowContent"];
        } catch (e) {
            console.error("create process catch error ==>", e);
            message.error("编辑失败");
        }
    }

    async asyncEditSingeFlowContentItem() {
        try {
            let responseData = await AsyncRequest.asyncEditSingeFlowContentItem({
                "flowProcessId": this.data.flowProcessId,
                "content": this.data.content,
            });
            message.success("编辑成功");
        } catch (e) {
            message.error("编辑失败");
        }


    }

    changeContentStatusIsDetail() {
        console.log("in changeContentStatusIsDetail");
        MainModel.changeStatus({
            "pageStatus": "detail"
        });
    }



}
export default new CurrentContentModel();