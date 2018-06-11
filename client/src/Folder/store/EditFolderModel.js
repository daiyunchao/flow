import { observable, computed, autorunAsync, action, extendObservable } from "mobx";
import { message } from 'antd';
import FolderModel from './FolderModel';
import EventHandler from '../../CommonUtils/eventHandler';
class EditFolderModel extends FolderModel {
    constructor() {
        super();
        this.data = {
            "newFolderName": ""
        };
        this.status = {
            title: "创建文件夹",
            isShow: false,
            isCreateStatus: true,//当前是否是创建状态
        };
        this.initDataAndStatus();
    }

    //修改当前状态为编辑文件夹
    @action changeCurrentStatusIsEditFolder(
        {
            selectFolder,
        }) {
        this.status.title = "编辑文件夹";
        this.status.isShow = true;
        this.status.isCreateStatus = false;
        this.data.selectedFolder = selectFolder;

        //获取最新的文件夹列表:
        this.getFolderList();
    }

    @action changeCurrentStatusIsCreateFolder() {

        this.status.title = "创建文件夹";
        this.status.isShow = true;
        this.status.isCreateStatus = true;
        console.log("is show", this.status.isShow);
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
        if (!this.data.newFolderName) {
            message.warning("文件夹名称不能为空");
            return;
        }
        this.status.isShow = false;
        let newFolder = await this.asyncCreateFolder({ folderName: this.data.newFolderName });
        this.data.folderList.push(newFolder);
        this.data.newFolderName = "";
        EventHandler.dispatchEvent({
            "key": "addFolder",
            "args": [newFolder]
        })

    }

    @action ClickCreateCancel() {
        this.status.isShow = false;
    }

    //修改文件夹
    changeFolder(e) {
        let itemProps = e.item.props;
        let folderName = itemProps.children;
        let key = itemProps.eventKey;
        this.userSelectedFolder({
            "folderId": key,
            "folderName": folderName
        });
    }

    showCurrentFolderFlowContentList(folderId) {
        EventHandler.dispatchEvent({
            "key": "changeMenu",
            'args': ["folder", folderId]
        })
    }
    changeFolderName(newFolderName) {
        this.data.newFolderName = newFolderName;
    }
}
export default new EditFolderModel();