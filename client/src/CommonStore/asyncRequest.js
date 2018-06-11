import RequestHelper from './requestHelper';
class AsyncRequest {
  responseHandle = function (response) {
    if (response && response["data"] && response["data"]["error"]) {
      if (response.data.error.code == 200) {
        //返回结果是正确的
        if (response.data && response.data.data) {
          return response.data.data;
        }
        throw new Error("未知错误");
      } else {
        if (response.data.code && response.data.message) {
          throw new Error(response.data.message);
        }
        throw new Error("未知错误");
      }
    }
    else {
      if (response.data.code && response.data.message) {
        throw new Error(response.data.message);
      }
      throw new Error("未知错误");
    }
  }


  async userLogin({ email, pwd }) {
    let response = await RequestHelper.post({
      apiName: "User_UserLogin",
      postData: {
        "email": email,
        "pwd": pwd
      }
    });
    return this.responseHandle(response);
  }


  async userRegister({ email, pwd, nickname }) {
    let response = await RequestHelper.post({
      apiName: "User_CreateUser",
      postData: {
        "email": email,
        "pwd": pwd,
        "nickName": nickname
      }
    });
    return this.responseHandle(response);
  }

  async getUserInfoByEmailAndPwd({ email, pwd }) {
    let response = await RequestHelper.post({
      apiName: "User_GetUserInfoByEmailAndPwd",
      postData: {
        "email": email,
        "pwd": pwd
      }
    });
    return this.responseHandle(response);
  }


  async getFolderListAndTagList({ userId }) {
    let response = await RequestHelper.post({
      apiName: "Menu_GetFolderListAndTagList",
      postData: {
        "userId": userId
      }
    });
    return this.responseHandle(response);
  }

  async getLastContentList({ userId }) {
    let response = await RequestHelper.post({
      apiName: "FlowContent_GetLastFlowContentList",
      postData: {
        "userId": userId
      }
    });
    return this.responseHandle(response);
  }

  async getContentListByFolderId({ folderId }) {
    let response = await RequestHelper.post({
      apiName: "FlowContent_GetFlowContentListByFloderId",
      postData: {
        "folderId": folderId
      }
    });
    return this.responseHandle(response);
  }

  async getContentListByTagId({ tagId }) {
    let response = await RequestHelper.post({
      apiName: "FlowContent_GetFlowContentListByTagId",
      postData: {
        "tagId": tagId
      }
    });
    return this.responseHandle(response);
  }

  async getSharedContentList({ userId }) {
    let response = await RequestHelper.post({
      apiName: "FlowContent_GetFlowContentListByShared",
      postData: {
        "userId": userId
      }
    });
    return this.responseHandle(response);
  }

  async getContentListBySearchKey({ userId, searchKey }) {
    let response = await RequestHelper.post({
      apiName: "FlowContent_GetFlowContentListBySearchKey",
      postData: {
        "userId": userId,
        "searchKey": searchKey,
      }
    });
    return this.responseHandle(response);
  }

  async CreateFolder({ userId, folderName }) {
    let response = await RequestHelper.post({
      apiName: "Folder_CreateFolder",
      postData: {
        "userId": userId,
        "folderName": folderName,
      }
    });
    return this.responseHandle(response);
  }

  async CreateTag({ userId, tagName }) {
    let response = await RequestHelper.post({
      apiName: "Tag_CreateTag",
      postData: {
        "userId": userId,
        "tagName": tagName,
      }
    });
    return this.responseHandle(response);
  }

  async getFolderListByUserId({ userId }) {
    let response = await RequestHelper.post({
      apiName: "Folder_GetFolderListByUserId",
      postData: {
        "userId": userId
      }
    });
    return this.responseHandle(response);
  }

  async getTagListByUserId({ userId }) {
    let response = await RequestHelper.post({
      apiName: "Tag_GetTagListByUserId",
      postData: {
        "userId": userId
      }
    });
    return this.responseHandle(response);
  }

  async createFlowContent({ userId, title, folderId, tagIds, content, isShared }) {
    let response = await RequestHelper.post({
      apiName: "FlowContent_CreateFlowContent",
      postData: {
        "createUid": userId,
        "contentObj": {
          "title": title,
          "content": content,
          "folderId": folderId,
          "tagIds": tagIds,
          "userId": userId,
          "isShared": isShared
        }
      }
    });
    return this.responseHandle(response);
  }

  async editFlowContent({ userId, flowProcessId, title, folderId, tagIds, content, isShared }) {
    let response = await RequestHelper.post({
      apiName: "FlowContent_EditFlowContent",
      postData: {
        "flowProcessId": flowProcessId,
        "contentObj": {
          "title": title,
          "content": content,
          "folderId": folderId,
          "tagIds": tagIds,
          "userId": userId,
          "isShared": isShared
        }
      }
    });
    return this.responseHandle(response);
  }

  async deleteFlowContent({ userId, flowProcessId }) {
    let response = await RequestHelper.post({
      apiName: "FlowContent_DeleteFlowContent",
      postData: {
        "flowProcessId": flowProcessId
      }
    });
    return this.responseHandle(response);
  }
  async asyncEditSingeFlowContentItem({ flowProcessId, content }) {
    let response = await RequestHelper.post({
      apiName: "FlowContent_EditSingeFlowContent",
      postData: {
        "flowProcessId": flowProcessId,
        "content": content
      }
    });
    return this.responseHandle(response);
  }


  async getFlowContentDetail({ flowProccessId }) {
    let response = await RequestHelper.post({
      apiName: "FlowContent_GetFlowContentDetail",
      postData: {
        "flowProcessId": flowProccessId
      }
    });
    return this.responseHandle(response);
  }

  async getShareFlowContentDetail({ flowProccessId }) {
    let response = await RequestHelper.post({
      apiName: "FlowContent_GetShareFlowContentDetail",
      postData: {
        "flowProcessId": flowProccessId
      }
    });
    return this.responseHandle(response);
  }
}
export default new AsyncRequest();