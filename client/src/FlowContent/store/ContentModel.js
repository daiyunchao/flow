import { observable, computed, autorunAsync, autorun, action, extendObservable } from "mobx";
import ModelBase from '../../CommonStore/ModelBase';
import CommHelper from '../../CommonUtils/commHelper';
import EventHandler from '../../CommonUtils/eventHandler';
import asyncRequest from '../../CommonStore/asyncRequest';
import ContentFolderModel from '../../Folder/store/EditFolderModel';
import ContentTagModel from '../../Tag/store/EditTagModel';
import GS from '../../CommonStore/GSModel';
import CommonModal from '../../CommonModal/store/CommonModal'
import { message } from 'antd';

class ContentModel extends ModelBase {
    constructor() {
        super();
        this.data = {};
        this.status = {};
        this.initData();
        this.initStatus();
    }
    initData() {
        extendObservable(this.data, {

            //id
            "flowProcessId": "",

            //标题
            "title": "",

            //文件夹id
            "folderId": "",

            //文件夹名称
            "folderName": "",


            //标签id逗号分隔字符串列表
            "tagIds": "",

            //标签名称列表
            "tagNames": [],

            //标签列表,对象{"tagId":"111","tagName":"name"}
            "tags": [],

            //创建人ID
            "userId": "",

            //流程的名称
            "content": "",

            //是否被分享
            "isShared": 1,

            //创建时间
            "createTime": 0,

            //用于显示的创建时间
            "ceateTimeByShow": "",

            //将流程内容转换成列表形式
            "contentItemList": [],

            //用于copy的流程内容
            "contentItemListWithCopy": [],
        });
    }

    initStatus() {
        extendObservable(this.status, {
            "hasContent": false,
            "contentHasError": false,
            "btnIsLoadding": false,
        })
    }

    //修改保存按钮的状态
    changeSaveBtnStatus({ isLoadding }) {
        this.status.btnIsLoadding = isLoadding;
    }

    //获取用于显示的创建时间
    getCreateTimeByShow() {
        this.data.ceateTimeByShow = CommHelper.getDateTimeByTimeStamp(this.data.createTime);
    }


    //会内容转换成内容列表
    getContentItemList() {
        this.data.contentItemList = this.data.content.split("|><|");
    }

    //将内容转换成"用于复制"的内容列表
    getContentItemListWithCopy() {
        this.data.contentItemListWithCopy = this.data.content.split("|><|").map(function (item, index) {
            if (item) {
                return `${index + 1}:  ${item}`;
            }
        });
    }

    //验证用户的输入项:
    validateInputs() {
        let itemLen = this.data.contentItemList.length;
        let hasEmptyContentItem = false;
        if (!this.data.title) {
            message.warning("请输入流程标题");
            return false;
        }
        console.log("ContentFolderModel===>", ContentFolderModel.data);
        if (!ContentFolderModel.data.selectedFolder || !ContentFolderModel.data.selectedFolder.folderId) {
            //没有选中任何的文件夹
            message.warning("未选择任何的文件夹");
            return false;
        }
        if (itemLen == 0) {
            message.warning("当前没有流程");
            return false;
        }

        for (let i = 0; i < itemLen; i++) {
            let item = this.data.contentItemList[i];
            if (!item) {
                hasEmptyContentItem = true;
                break;
            }
        }
        if (hasEmptyContentItem) {
            message.warning("有流程未输入任何内容,请检查");
            return false;
        }
        return true;
    }

    //显示创建提示框
    showCreateModel(doProcessMethod) {
        let selectedTags = ContentTagModel.data.selectedTags;
        let tagNameArr = [];
        for (let i = 0; i < selectedTags.length; i++) {
            tagNameArr.push(selectedTags[i]["tagName"]);
        }
        CommonModal.setModalInfo({
            "title": "温馨提示",
            "content": `确定要创建/编辑该流程吗?
            流程名称:<${this.data.title}>,
            所属文件夹:<${ContentFolderModel.data.selectedFolder.folderName}>,
            包含标签:<${(tagNameArr.join(",")) || "未选择标签"}>`,
            "sureCB": () => {
                console.log("点击了确定");
                doProcessMethod();
            },
            "cancelCB": () => {
                console.log("点击了取消");
                this.changeSaveBtnStatus({
                    "isLoadding": false
                });
            }
        });
    }

    //构建标签列表
    getTags() {
        let tagIdArr = this.data.tagIds.split(',');
        if (tagIdArr.length === this.data.tagNames.length) {
            let newTag = [];
            for (let i = 0, length = tagIdArr.length; i < length; i++) {
                let tagId = tagIdArr[i];
                let tagName = this.data.tagNames[i];
                let tagObj = {
                    "tagId": tagId,
                    "tagName": tagName
                };
                newTag.push(tagObj);
            }
            this.data.tags = newTag;
        }
        else {
            this.data.tags = [];
        }
    }

    //为流程内容对象赋值
    setVal(data) {
        CommHelper.copyProps({
            "source": this.data,
            "copyObj": data
        });
        this.contentChangeAfter();
        this.getTags();

    }

    //将文本内容转换成列表内容
    changeContentWithItemList() {
        this.data.content = this.data.contentItemList.join("|><|");
    }
    //当内容改变后执行的:
    contentChangeAfter() {
        this.getCreateTimeByShow();
        this.getContentItemList();
        this.getContentItemListWithCopy();
    }

    //修改流程title
    @action changeTitle(newTitle) {
        this.data.title = newTitle;
    }

    //插入一条数据
    @action InsertItemInBefore(rowIndex) {
        let index = rowIndex - 1;
        this.data.contentItemList.splice(index, 0, "");
        this.changeContentWithItemList();
        this.contentChangeAfter();
    }

    //添加一项
    @action AddItemAfter(rowIndex) {
        let index = rowIndex;
        this.data.contentItemList.splice(rowIndex, 0, "");
        this.changeContentWithItemList();
        this.contentChangeAfter();
    }

    //删除当前项
    @action DeleteItem(rowIndex) {
        //判断当前是否只有一项,如果只有一项,不能删除
        if (this.data.contentItemList.length == 1) {
            //只有一项
            return message.error("当前只有一项,不能被删除");

        }
        let index = rowIndex - 1;
        this.data.contentItemList.splice(index, 1);
        this.changeContentWithItemList();
        this.contentChangeAfter();
    }
    //修改单条记录:
    @action changeItemContent(rowIndex, newContent) {
        let index = rowIndex - 1;
        if (this.data.contentItemList && (this.data.contentItemList[index] != undefined)) {
            this.data.contentItemList[index] = newContent;
        }
        this.changeContentWithItemList();
        this.contentChangeAfter();
        
    }

    //将该内容设定为详情显示(Menu中选中一个流程):
    setCurrentContentToFlowContentDetail() {
        let self = this;
        EventHandler.dispatchEvent(
            {
                "key": "getProcessDetail",
                "args": [self]
            }
        );
        let nodes = document.getElementsByClassName("contentListItem");
        for (let i = 0; i < nodes.length; i++) {
            let node = nodes[i];
            node.style.backgroundColor = "";
        }
        let currentNode = document.getElementsByClassName("listItem_" + this.data.flowProcessId);
        if (currentNode.length > 0) {
            currentNode[0].style.backgroundColor = "rgba(243, 236, 236,0.6)";
        }
    }

    //设置当前内容为"暂无内容"
    setNoContentStatus() {
        let self = this;
        EventHandler.dispatchEvent(
            {
                "key": "getProcessNoContent",
                "args": []
            }
        );
    }

    //修改流程的分享状态
    async changeContentShareStatus(isShared) {
        let changeStatus = await this.asyncChangeContentShareStatus(isShared);
        if (changeStatus) {
            this.data.isShared = isShared ? 1 : 0;
            message.success("更新分享状态成功")
            return true;
        } else {
            message.error("更新分享状态失败")
            return false;
        }

    }

    //调用修改分享状态的API:
    //todo
    async asyncChangeContentShareStatus(isShared) {
        return true;
    }

    //获取详情:
    async getFlowContentDetail() {
        let detail = await this.asyncGetFlowContentDetail();
        if (detail) {
            this.setVal(detail);
        }
    }

    async getShareFlowContentDetail() {
        let detail = await this.asyncGetShareFlowContentDetail();
        if (detail) {
            this.setVal(detail);
        }
    }

    //调用查询流程详情的API:
    //todo
    async asyncGetFlowContentDetail() {
        let id = this.data.flowProcessId;
        let responseData = await asyncRequest.getFlowContentDetail({
            "flowProccessId": id
        });
        console.log("asyncGetFlowContentDetail responseData===>", responseData);
        return responseData["flowContent"];
    }

    //调用查询分享流程详情的API:
    async asyncGetShareFlowContentDetail() {
        let id = this.data.flowProcessId;
        let responseData = await asyncRequest.getShareFlowContentDetail({
            "flowProccessId": id
        });
        console.log("asyncGetShareFlowContentDetail responseData===>", responseData);
        return responseData["flowContent"];
    }
}
export default ContentModel;