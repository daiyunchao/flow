
import { observable, computed, autorunAsync, action, extendObservable } from "mobx";
import FolderModel from '../../Folder/store/FolderModel';
/**
 * 内容中的文件夹对象
 */
class ContentFolderModel extends FolderModel {
    constructor() {
        super();
        this.data={};
        this.status={};
        this.initDataAndStatus();
    }
    setVal({
        folderId,
        folderName,
    }) {
        this.userSelectedFolder({ folderId, folderName });
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


}
export default new ContentFolderModel();