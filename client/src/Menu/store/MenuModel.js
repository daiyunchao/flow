import { observable, computed, autorunAsync, action, extendObservable } from "mobx";
import ModelBase from '../../CommonStore/ModelBase';
import ContentModel from '../../FlowContent/store/ContentModel';
import EventHandler from '../../CommonUtils/eventHandler';
import AsyncRequest from '../../CommonStore/asyncRequest';
import GS from '../../CommonStore/GSModel';
class MenuModel extends ModelBase {
  constructor() {
    super();
    this.data = {};
    this.status = {};
    this.initData();
    this.initStatus();
    this.registerEvent();
  }

  //初始化数据
  initData() {
    extendObservable(this.data, {
      folderList: [],
      tagList: [],
      currentProcessList: []
    })
  }

  initStatus() {
    extendObservable(this.status, {
      "selectedFolderId": "last",
      "selectedType": "last",
      "contentListIsLoadding": false,
      "default_selected_menu": "last_file",
      "default_open_key": "sub1",
      "collapsMenu": false
    })
  }



  addProccessItemToList(proccess) {
    if (this.data.currentProcessList && this.data.currentProcessList.length >= 0) {
      let contentModel = new ContentModel();
      contentModel.setVal(proccess);
      this.data.currentProcessList.unshift(contentModel);
      this.data.currentProcessList = [...this.data.currentProcessList];
    }
  }

  addCountToTag(tagIds) {
    for (let i = 0, len = this.data.tagList.length; i < len; i++) {
      let item = this.data.tagList[i];
      if (tagIds.indexOf(item["tagId"]) > -1) {
        this.data.tagList[i]["fileCount"] += 1;
      }
    }
  }

  registerEvent() {
    EventHandler.registerEvent({
      "key": "addFolder",
      "fn": (folder) => {
        let { folderId, folderName } = folder;
        this.data.folderList.push({
          folderId,
          folderName
        });
      }
    });

    EventHandler.registerEvent({
      "key": "addTag",
      "fn": (tag) => {
        let { tagId, tagName } = tag;
        this.data.tagList.push({
          tagId,
          tagName,
          "fileCount": 0
        });
      }
    })

    EventHandler.registerEvent({
      "key": "changeMenu",
      "fn": (type, typeKey) => {
        this.status.selectedType = type;
        this.status.selectedFolderId = typeKey;
        if(type=="folder"){
          this.status.default_selected_menu = "folder_" + typeKey;
          this.status.default_open_key = "sub1";
        }else if(type=="tag"){
          this.status.default_selected_menu = "tag_" + typeKey;
          this.status.default_open_key = "sub2";
        }

        this.reflushProcessList();
      }
    })
    EventHandler.registerEvent({
      "key": "editProcess",
      "fn": () => {
        this.reflushProcessList();
      }
    });
    EventHandler.registerEvent({
      "key": "createProcess",
      "fn": (folderId, tagIds, proccess) => {
        //selectedFolderId
        //判断当前显示的是否和创建的文件夹/标签相关
        //如果相关,则添加到列表中去

        //添加内容到列表中去:
        let selectedFolderId = this.status.selectedFolderId;
        console.log("selectedFolderId===>", selectedFolderId);
        if (selectedFolderId == "last" || folderId == selectedFolderId || tagIds.indexOf(selectedFolderId) > -1) {
          //如果是last,则显示的是最后的列表
          //需要添加到该列表中去
          this.addProccessItemToList(proccess);
        }

        //为标签添加数量:
        this.addCountToTag(tagIds);

        //选中刚才创建的那个
        this.clickFirstProcessItem();
      }
    })
  }


  @action
  async getMenuList() {
    let responseData = await AsyncRequest.getFolderListAndTagList({
      "userId": GS.baseInfoSetting.userId
    })
    this.data.folderList = responseData.folderList;
    this.data.tagList = responseData.tagList;
  }

  @action
  async addUserLoginEvent() {
    EventHandler.registerEvent({
      "key": "getUserInfo",
      "fn": () => {
        this.getMenuList();
        this.pageInitGetLastProcessList();
      }
    })
  }


  //获取当前文件夹下的文件列表
  @action
  async getContentListByThisFolder({ folderId }) {
    if (!this.validateCurrentIsClicked("folder", folderId)) {
      return;
    }

    let processList = await this.asyncGetProcessList(
      {
        "type": "folder",
        "folderId": folderId
      });
    this.buildProccessListAndSelectFirstItem({ processList });
  }

  @action
  async getContentListByThisTag({ tagId }) {
    if (!this.validateCurrentIsClicked("tag", tagId)) {
      return;
    }
    let processList = await this.asyncGetProcessList(
      {
        "type": "tag",
        "tagId": tagId
      });
    this.buildProccessListAndSelectFirstItem({ processList });
  }

  @action
  async getContentListByShare() {
    if (!this.validateCurrentIsClicked("share", "share_link")) {
      return;
    }
    let processList = await this.asyncGetProcessList(
      {
        "type": "share",
      });
    this.buildProccessListAndSelectFirstItem({ processList });
  }

  @action
  async getContentListBySearchKey({ searchKey }) {
    if (!this.validateCurrentIsClicked("search", "search_" + searchKey)) {
      return;
    }
    let processList = await this.asyncGetProcessList(
      {
        "type": "search",
        "searchKey": searchKey
      });
    this.buildProccessListAndSelectFirstItem({ processList });
  }

  @action
  async getLastProcessList() {
    if (!this.validateCurrentIsClicked("last", "last")) {
      return;
    }
    let processList = await this.asyncGetProcessList({ type: "last" });
    this.buildProccessListAndSelectFirstItem({ processList });
  }

  @action
  async pageInitGetLastProcessList() {
    let processList = await this.asyncGetProcessList({ type: "last" });
    this.buildProccessListAndSelectFirstItem({ processList });
  }

  @action
  async reflushProcessList() {
    let processList = await this.asyncGetProcessList(
      {
        type: this.status.selectedType,
        folderId: this.status.selectedFolderId,
        tagId: this.status.selectedFolderId,
        searchKey: this.status.selectedFolderId,
      }
    );
    this.buildProccessListAndSelectFirstItem({ processList });
  }

  //验证当前显示的是否为点击的文件夹相同
  validateCurrentIsClicked(type, folderId) {
    if (folderId == this.status.selectedFolderId) {
      return false;
    }
    this.status.selectedType = type
    this.status.selectedFolderId = folderId;
    return true;
  }

  buildProcessList({
    processList = []
  }) {
    let newList = [];
    for (let i = 0; i < processList.length; i++) {
      let contentModel = new ContentModel();
      let itemData = processList[i];
      contentModel.setVal(itemData);
      newList.push(contentModel);
    }
    this.data.currentProcessList = newList;
  }

  //选择的文件夹改变时,获取第一条数据
  clickFirstProcessItem() {
    let firstProcessItem = this.data.currentProcessList[0];
    if (firstProcessItem) {
      //点击第一个用于加载
      firstProcessItem.setCurrentContentToFlowContentDetail();
    } else {
      //整个文件夹中没有内容
      firstProcessItem.setNoContentStatus();
    }
  }

  buildProccessListAndSelectFirstItem({ processList }) {
    console.log("buildProccessListAndSelectFirstItem processList==>", processList);
    this.buildProcessList({ processList });
    console.log("currentProcessList===>", this.data.currentProcessList);
    if (processList && processList.length > 0) {
      this.clickFirstProcessItem();
    } else {
      EventHandler.dispatchEvent(
        {
          "key": "getProcessNoContent",
          "args": []
        }
      );
    }
  }

  //异步获取流程列表
  async asyncGetProcessList({
    type = "last",//last or folder or tag or search or share
    folderId = "",
    tagId = "",
    searchKey = "",
  }) {
    let typeMenu = {
      "L": "last",
      "F": "folder",
      "T": "tag",
      "S": "search",
      "SHARE": "share"
    }
    this.status.contentListIsLoadding = true;
    let randomNum = Math.floor(Math.random() * 10);
    let responseData = {};
    if (type == typeMenu.L) {
      responseData = await AsyncRequest.getLastContentList({ "userId": GS.baseInfoSetting.userId })
    }
    else if (type == typeMenu.F) {
      responseData = await AsyncRequest.getContentListByFolderId({ "folderId": folderId })
    }
    else if (type == typeMenu.T) {
      responseData = await AsyncRequest.getContentListByTagId({ "tagId": tagId })
    }
    else if (type == typeMenu.S) {
      responseData = await AsyncRequest.getContentListBySearchKey({
        "userId": GS.baseInfoSetting.userId,
        "searchKey": searchKey
      })
    }
    else if (type == typeMenu.SHARE) {
      responseData = await AsyncRequest.getSharedContentList({ "userId": GS.baseInfoSetting.userId })
    }

    this.status.contentListIsLoadding = false;
    return responseData["flowContentList"];

  }


  @action changeMenuStatus = () => {
    this.status.collapsMenu = !this.status.collapsMenu
  }

}
export default new MenuModel;