import { observable, computed, autorunAsync, action, extendObservable } from "mobx";
import TagsModel from './TagsModel';
import EventHandler from '../../CommonUtils/eventHandler';
class EditTagModel extends TagsModel {
    constructor() {
        super();
        this.data = {
            "newTagName": ""
        };
        this.status = {
            "title": "创建标签",
            "isShow": false,
            "isCreateStatus": true,//当前是否是创建状态
        };
        this.initDataAndStatus();
    }

    @action ClickSure() {
        this.status.isShow = false;
    }

    @action ClickCancel() {
        this.status.isShow = false;
    }

    //将当前状态修改成编辑状态
    @action changeCurrentStatusIsEditTag({
        selectedTags
    }) {
        this.status.title = "编辑标签";
        this.status.isShow = true;
        this.status.isCreateStatus = false;
        this.data.selectedTags = selectedTags;

        //获取当前的标签
        this.getTagList();
    }

    //设置成为创建状态
    @action changeCurrentStatusIsCreateTag() {
        this.status.title = "创建标签";
        this.status.isShow = true;
        this.status.isCreateStatus = true;
    }

    //点击编辑状态下的保存
    @action ClickEditSure() {
        this.status.isShow = false;
    }

    //点击编辑状态下的取消点击编辑状态下的取消
    @action ClickEditCancel() {
        this.status.isShow = false;
    }

    @action async ClickCreateSure() {
        if (!this.data.newTagName) {
            message.warning("标签名称不能为空");
            return;
        }
        this.status.isShow = false;
        let newTag = await this.asyncCreateTag({ tagName: this.data.newTagName });
        this.data.tagsList.push(newTag);
        this.data.newTagName = "";
        EventHandler.dispatchEvent({
            "key": "addTag",
            "args": [newTag]
        })
    }

    @action ClickCreateCancel() {
        this.status.isShow = false;
    }

    //修改标签:
    @action changeTags(newTag) {
        this.userChangeTags(newTag);
    }

    changeTagName(newTagName) {
        this.data.newTagName = newTagName;
    }

}
export default new EditTagModel();