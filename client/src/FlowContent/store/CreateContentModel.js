import { observable, computed, autorunAsync, autorun, action, extendObservable } from "mobx";
import ContentModel from './ContentModel';
import CommHelper from '../../CommonUtils/commHelper';
import EventHandler from '../../CommonUtils/eventHandler';
import MainModel from '../../Main/store/MainModel';
import CommonModal from '../../CommonModal/store/CommonModal'
import ContentFolderModel from '../../Folder/store/EditFolderModel';
import ContentTagModel from '../../Tag/store/EditTagModel';
import AsyncRequest from '../../CommonStore/asyncRequest';
import GS from '../../CommonStore/GSModel';
import { message } from 'antd';

//创建或编辑状态的流程Model
class CreateContentModel extends ContentModel {
  constructor() {
    super();

    //初始化状态下,出现几个空内容输入框
    this.initStatusEmptyContentLen = 3;

    //初始化创建状态下的数据
    this.initCreateStatus();
  }

  //初始化创建状态下的内容
  initCreateStatus() {
    //构建内容字符串
    this.data.content = "|><|".repeat(this.initStatusEmptyContentLen - 1);
    //构建内容列表
    this.getContentItemList();
  }

  //当用户点击保存按钮时发生:
  @action clickSaveBtn() {
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
    this.showCreateModel(this.startCreateProcess.bind(this));
    //2.提交服务器
    //3.等待服务器响应
    //4.触发事件,通知其他组件或是模型,数据更新了/调用其他模型更新数据

  }






  async startCreateProcess() {
    let newProceess = await this.asyncCreateProccess();
    //触发事件
    EventHandler.dispatchEvent({
      "key": "createProcess",
      "args": [newProceess.folderId, newProceess.tagIds.split(','), newProceess]
    })
  }

  //调用服务器端的创建流程
  async asyncCreateProccess() {
    try {
      console.log("ContentTagModel.data.selectedTags===>",ContentTagModel.data.selectedTags);
      let selectedTags = ContentTagModel.data.selectedTags;
      let tagIds = [];
      let tagNameArr = [];
      for (let i = 0; i < selectedTags.length; i++) {
        tagIds.push(selectedTags[i]["tagId"]);
        tagNameArr.push(selectedTags[i]["tagName"]);
      }
      let responseData = await AsyncRequest.createFlowContent({
        "userId": GS.baseInfoSetting.userId,
        "title": this.data.title,
        "folderId": ContentFolderModel.data.selectedFolder.folderId,
        "tagIds": tagIds.join(','),
        "content": this.data.content,
        "isShared": this.data.isShared
      });
      message.success("创建成功");
      console.log("responseData===>", responseData);
      return responseData["flowContent"];
    } catch (e) {
      console.error("create process catch error ==>", e);
      message.error("创建失败");
    }
  }
}
export default CreateContentModel;