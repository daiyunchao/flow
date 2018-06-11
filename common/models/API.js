var G = require('bearcat-helper');
module.exports = function (API) {
  let retDataModel = [{ arg: 'returnData', type: 'object', root: true }];
  let errorHelper = G("commonUtils:errorHelper");
  //错误信息:
  let errorMsg = (errorKey) => {
    let errorInfo = errorHelper.errorMenu[errorKey];
    if (!errorInfo) {
      errorInfo = errorHelper.errorMenu.unknownError;
    }
    return {
      "code": errorInfo.code,
      "message": errorInfo.msg,
      "display_message": errorInfo.msg,
      "notify_type": "silence"
    }
  };

  //正确信息:
  let rightMsg = (retData) => {
    return {
      "error": {
        "code": 200,
        "message": "",
        "display_message": "",
        "notify_type": "silence"
      },
      "data": retData
    }
  };

  //返回错误信息:
  let callbackErrorMsg = function (errorKey) {
    let fnError = errorMsg(errorKey);
    return fnError;
  }

  //返回抛出的异常
  let callbackThrowErrorMsg = function (e) {
    console.error(e)
    if (e) {
      let eMsg = e.message;
      let errorKeys = Object.keys(errorHelper.Keys);
      if (errorKeys.indexOf(eMsg)) {
        return callbackErrorMsg(errorHelper.Keys[eMsg]);
      }
    }
    return callbackErrorMsg(errorHelper.Keys.unknownError)
  }

  //返回正确信息:
  let callbackRihtMsg = function (retData) {
    let fnRetData = rightMsg(retData);
    return fnRetData;
  }

  //用户登录:
  API.remoteMethod("User_UserLogin",
    {
      description: "用户登录",
      http: {
        verb: 'post'
      },
      accepts: [
        {
          arg: 'email',
          description: "邮箱",
          type: 'string'
        },
        {
          arg: 'pwd',
          description: "密码",
          type: 'string'
        }
      ],
      returns: retDataModel
    })


  API.User_UserLogin = async function (email, pwd) {
    try {
      if (!email || !pwd) {
        return callbackErrorMsg(errorHelper.Keys.inputMsgComplete);
      }
      const UserG = G('commonUtils:lbapp').getLbModel("FlowUsers");
      let UserInfo = await UserG.APIUserLogin({ email, pwd });
      return callbackRihtMsg({
        "userInfo": UserInfo
      });

    } catch (e) {
      return callbackThrowErrorMsg(e);
    }

  }

  //创建文件夹:
  API.remoteMethod("Folder_CreateFolder",
    {
      description: "创建文件夹",
      http: {
        verb: 'post'
      },
      accepts: [
        {
          arg: 'userId',
          description: "创建人ID",
          type: 'string'
        },
        {
          arg: 'folderName',
          description: "文件夹的名称",
          type: 'string'
        }
      ],
      returns: retDataModel
    })


  API.Folder_CreateFolder = async function (userId, folderName) {
    try {
      if (!userId || !folderName) {
        return callbackErrorMsg(errorHelper.Keys.inputMsgComplete);
      }
      const FolderG = G('commonUtils:lbapp').getLbModel("Folder");
      let folderInfo = await FolderG.APICreateFolder({ userId, folderName });

      return callbackRihtMsg({
        "folderInfo": folderInfo
      });

    } catch (e) {
      return callbackThrowErrorMsg(e);
    }

  }

  //创建标签:
  API.remoteMethod("Tag_CreateTag",
    {
      description: "创建标签",
      http: {
        verb: 'post'
      },
      accepts: [
        {
          arg: 'userId',
          description: "创建人ID",
          type: 'string'
        },
        {
          arg: 'tagName',
          description: "标签名称",
          type: 'string'
        }
      ],
      returns: retDataModel
    })


  API.Tag_CreateTag = async function (userId, tagName) {
    try {
      if (!userId || !tagName) {
        return callbackErrorMsg(errorHelper.Keys.inputMsgComplete);
      }
      const TagG = G('commonUtils:lbapp').getLbModel("Tag");
      let tagInfo = await TagG.APICreateTag({ userId, tagName });

      return callbackRihtMsg({
        "tagInfo": tagInfo
      });

    } catch (e) {
      return callbackThrowErrorMsg(e);
    }

  }

  //创建标签:
  API.remoteMethod("Tag_GetTagListByUserId",
    {
      description: "通过用户ID获取标签列表",
      http: {
        verb: 'post'
      },
      accepts: [
        {
          arg: 'userId',
          description: "用户ID",
          type: 'string'
        }
      ],
      returns: retDataModel
    })


  API.Tag_GetTagListByUserId = async function (userId) {
    try {
      if (!userId) {
        return callbackErrorMsg(errorHelper.Keys.inputMsgComplete);
      }
      const TagG = G('commonUtils:lbapp').getLbModel("Tag");
      let tagList = await TagG.APIGetTagListByUserId({ userId });

      return callbackRihtMsg({
        "tagList": tagList
      });

    } catch (e) {
      return callbackThrowErrorMsg(e);
    }

  }

  //修改文件夹:
  API.remoteMethod("Folder_EditFolder",
    {
      description: "修改文件夹",
      http: {
        verb: 'post'
      },
      accepts: [
        {
          arg: 'folderId',
          description: "文件夹ID",
          type: 'string'
        },
        {
          arg: 'newFolderName',
          description: "新的文件夹的名称",
          type: 'string'
        }
      ],
      returns: retDataModel
    })


  API.Folder_EditFolder = async function (folderId, newFolderName) {
    try {
      if (!folderId || !newFolderName) {
        return callbackErrorMsg(errorHelper.Keys.inputMsgComplete);
      }
      const FolderG = G('commonUtils:lbapp').getLbModel("Folder");
      await FolderG.APIChangeFolderName({ folderId, newFolderName });
      return callbackRihtMsg({});

    } catch (e) {
      return callbackThrowErrorMsg(e);
    }
  }

  API.remoteMethod("Folder_GetFolderListByUserId",
    {
      description: "通过用户ID获取文件夹列表",
      http: {
        verb: 'post'
      },
      accepts: [
        {
          arg: 'userId',
          description: "用户ID",
          type: 'string'
        }

      ],
      returns: retDataModel
    })


  API.Folder_GetFolderListByUserId = async function (userId) {
    try {
      if (!userId) {
        return callbackErrorMsg(errorHelper.Keys.inputMsgComplete);
      }
      const FolderG = G('commonUtils:lbapp').getLbModel("Folder");
      let folderList = await FolderG.APIGetFoldersByUserId({ userId });
      return callbackRihtMsg({ "folderList": folderList });

    } catch (e) {
      return callbackThrowErrorMsg(e);
    }
  }

  //创建用户
  API.remoteMethod("User_CreateUser",
    {
      description: "创建用户",
      http: {
        verb: 'post'
      },
      accepts: [
        {
          arg: 'nickName',
          description: "用户昵称",
          type: 'string'
        },
        {
          arg: 'email',
          description: "邮箱",
          type: 'string'
        },
        {
          arg: 'pwd',
          description: "密码",
          type: 'string'
        }
      ],
      returns: retDataModel
    })

  //创建用户:
  API.User_CreateUser = async function (nickName, email, pwd) {
    try {
      let userObj = {
        "userId": "",
        "nickName": nickName,
        "email": email,
        "pwd": pwd
      };
      if (!nickName || !email || !pwd) {
        return callbackErrorMsg(errorHelper.Keys.inputMsgComplete);
      }
      const UserG = G('commonUtils:lbapp').getLbModel("FlowUsers");
      const FolderG = G('commonUtils:lbapp').getLbModel("Folder");
      let userInfo = await UserG.APICreateUser(userObj);
      FolderG.APICreateFolder({
        "userId": userInfo.userId,
        "folderName": "默认文件夹"
      });
      return callbackRihtMsg({ "userInfo": userInfo })
    }
    catch (e) {
      return callbackThrowErrorMsg(e);
    }

  }

  //通过Email和Pwd获取用户信息:
  API.remoteMethod("User_GetUserInfoByEmailAndPwd",
    {
      description: "通过Email和Pwd获取用户信息",
      http: {
        verb: 'post'
      },
      accepts: [
        {
          arg: 'email',
          description: "邮箱",
          type: 'string'
        },
        {
          arg: 'pwd',
          description: "密码",
          type: 'string'
        }
      ],
      returns: retDataModel
    })


  API.User_GetUserInfoByEmailAndPwd = async function (email, pwd) {
    try {
      const UserG = G('commonUtils:lbapp').getLbModel("FlowUsers");
      let userInfo = await UserG.APIGetUserInfoByEmailAndPwd({
        email,
        pwd
      });
      return callbackRihtMsg({ "userInfo": userInfo });
    } catch (e) {
      return callbackThrowErrorMsg(e);
    }
  }

  //获取用户的文件夹列表和标签列表:
  API.remoteMethod("Menu_GetFolderListAndTagList",
    {
      description: "获取用户的文件夹列表和标签列表",
      http: {
        verb: 'post'
      },
      accepts: [
        {
          arg: 'userId',
          description: "用户ID",
          type: 'string'
        }
      ],
      returns: retDataModel
    })

  //获取用户的文件夹列表和标签列表
  API.Menu_GetFolderListAndTagList = async function (userId) {
    try {
      const FolderG = G('commonUtils:lbapp').getLbModel("Folder");
      const TagG = G('commonUtils:lbapp').getLbModel("Tag");
      const FlowContentG = G('commonUtils:lbapp').getLbModel("FlowContent");
      let folderList = await FolderG.APIGetFoldersByUserId({ userId });
      let tagList = await TagG.APIGetTagsByUserId({ userId });
      //tagList = await FlowContentG.APIGetTagConFlowContentCount({ tagList });
      return callbackRihtMsg({ "folderList": folderList, "tagList": tagList });
    }
    catch (e) {
      return callbackThrowErrorMsg(e);
    }
  }

  //创建新流程:
  API.remoteMethod("FlowContent_CreateFlowContent",
    {
      description: "创建新流程",
      http: {
        verb: 'post'
      },
      accepts: [
        {
          arg: 'createUid',
          description: "创建人ID",
          type: 'string'
        },
        {
          arg: 'contentObj',
          description: "流程对象",
          type: 'object'
        },
      ],
      returns: retDataModel
    });

  API.FlowContent_CreateFlowContent = async function (createUid, contentObj) {
    try {
      console.log("in FlowContent_CreateFlowContent args==>", arguments);
      const FlowContentG = G('commonUtils:lbapp').getLbModel("FlowContent");
      let newFlowContent = await FlowContentG.APICreateFlowContent({ createUid, contentObj });
      console.log("newFlowContent===>", newFlowContent);
      newFlowContent = await getCompFlowContent({ "flowContent": newFlowContent });
      return callbackRihtMsg({ "flowContent": newFlowContent });
    } catch (e) {
      return callbackThrowErrorMsg(e);
    }
  }

  //编辑流程:
  API.remoteMethod("FlowContent_EditFlowContent",
    {
      description: "编辑流程",
      http: {
        verb: 'post'
      },
      accepts: [
        {
          arg: 'flowProcessId',
          description: "流程ID",
          type: 'string'
        },
        {
          arg: 'contentObj',
          description: "流程对象",
          type: 'object'
        },
      ],
      returns: retDataModel
    });

  API.FlowContent_EditFlowContent = async function (flowProcessId, contentObj) {
    try {
      const FlowContentG = G('commonUtils:lbapp').getLbModel("FlowContent");
      let newFlowContent = await FlowContentG.APIEditFlowContent({ flowProcessId, contentObj });
      return callbackRihtMsg({ "flowContent": newFlowContent });
    } catch (e) {
      return callbackThrowErrorMsg(e);
    }
  }

  //编辑流程:
  API.remoteMethod("FlowContent_EditSingeFlowContent",
    {
      description: "编辑单个流程项",
      http: {
        verb: 'post'
      },
      accepts: [
        {
          arg: 'flowProcessId',
          description: "流程ID",
          type: 'string'
        },
        {
          arg: 'content',
          description: "流程内容",
          type: 'string'
        },
      ],
      returns: retDataModel
    });

  API.FlowContent_EditSingeFlowContent = async function (flowProcessId, content) {
    try {
      const FlowContentG = G('commonUtils:lbapp').getLbModel("FlowContent");
      let newFlowContent = await FlowContentG.APIChangeContent({ flowProcessId, content });
      return callbackRihtMsg({});
    } catch (e) {
      return callbackThrowErrorMsg(e);
    }
  }


  //删除流程:
  API.remoteMethod("FlowContent_DeleteFlowContent",
    {
      description: "删除流程",
      http: {
        verb: 'post'
      },
      accepts: [
        {
          arg: 'flowProcessId',
          description: "流程ID",
          type: 'string'
        }
      ],
      returns: retDataModel
    });

  API.FlowContent_DeleteFlowContent = async function (flowProcessId) {
    try {
      const FlowContentG = G('commonUtils:lbapp').getLbModel("FlowContent");
      await FlowContentG.APIDeleteFlowContent({ flowProcessId });
      return callbackRihtMsg({});
    } catch (e) {
      return callbackThrowErrorMsg(e);
    }
  }

  //修改流程分享状态:
  API.remoteMethod("FlowContent_ChangeShareStatus",
    {
      description: "修改流程分享状态",
      http: {
        verb: 'post'
      },
      accepts: [
        {
          arg: 'flowProcessId',
          description: "流程ID",
          type: 'string'
        },
        {
          arg: 'isShared',
          description: "当前是否被分享1:是 0:否",
          type: 'number'
        },
      ],
      returns: retDataModel
    });

  API.FlowContent_ChangeShareStatus = async function (flowProcessId, isShared) {
    try {
      const FlowContentG = G('commonUtils:lbapp').getLbModel("FlowContent");
      await FlowContentG.APIChangeShareStatus({ flowProcessId, isShared });
      return callbackRihtMsg({});
    } catch (e) {
      return callbackThrowErrorMsg(e);
    }
  }

  //修改流程所属文件夹:
  API.remoteMethod("FlowContent_ChangeFolder",
    {
      description: "修改流程所属文件夹",
      http: {
        verb: 'post'
      },
      accepts: [
        {
          arg: 'flowProcessId',
          description: "流程ID",
          type: 'string'
        },
        {
          arg: 'newFolderId',
          description: "新的文件夹ID",
          type: 'string'
        },
      ],
      returns: retDataModel
    });

  API.FlowContent_ChangeFolder = async function (flowProcessId, newFolderId) {
    try {
      const FlowContentG = G('commonUtils:lbapp').getLbModel("FlowContent");
      await FlowContentG.APIChangeFolder({ flowProcessId, newFolderId });
      return callbackRihtMsg({});
    } catch (e) {
      return callbackThrowErrorMsg(e);
    }
  }

  //修改流程所属标签:
  API.remoteMethod("FlowContent_ChangeTags",
    {
      description: "修改流程所属标签",
      http: {
        verb: 'post'
      },
      accepts: [
        {
          arg: 'flowProcessId',
          description: "流程ID",
          type: 'string'
        },
        {
          arg: 'tagIds',
          description: "用逗号分隔开的标签ID列表",
          type: 'string'
        },
      ],
      returns: retDataModel
    });

  API.FlowContent_ChangeTags = async function (flowProcessId, tagIds) {
    try {
      const FlowContentG = G('commonUtils:lbapp').getLbModel("FlowContent");
      await FlowContentG.APIChangeTags({ flowProcessId, tagIds });
      return callbackRihtMsg({});
    } catch (e) {
      return callbackThrowErrorMsg(e);
    }
  }


  //获取用户的文件夹列表和标签列表:
  API.remoteMethod("FlowContent_GetLastFlowContentList",
    {
      description: "获取最新的流程列表",
      http: {
        verb: 'post'
      },
      accepts: [
        {
          arg: 'userId',
          description: "用户ID",
          type: 'string'
        }
      ],
      returns: retDataModel
    });


  //获取用户的文件夹列表和标签列表
  API.FlowContent_GetLastFlowContentList = async function (userId) {
    try {
      const FlowContentG = G('commonUtils:lbapp').getLbModel("FlowContent");
      let flowContentList = await FlowContentG.APIGetLastFlowContentList({ userId });
      flowContentList = await getCompFlowContentByflowContentList({ flowContentList });
      return callbackRihtMsg({ "flowContentList": flowContentList });
    }
    catch (e) {
      return callbackThrowErrorMsg(e);
    }
  }

  //通过文件夹ID获取流程列表:
  API.remoteMethod("FlowContent_GetFlowContentListByFloderId",
    {
      description: "通过文件夹ID获取流程列表",
      http: {
        verb: 'post'
      },
      accepts: [
        {
          arg: 'folderId',
          description: "文件夹ID",
          type: 'string'
        }
      ],
      returns: retDataModel
    });


  //获取用户的文件夹列表和标签列表
  API.FlowContent_GetFlowContentListByFloderId = async function (folderId) {
    try {
      const FlowContentG = G('commonUtils:lbapp').getLbModel("FlowContent");
      let flowContentList = await FlowContentG.APIGetFlowContentListByFloderId({ folderId });
      flowContentList = await getCompFlowContentByflowContentList({ flowContentList });
      return callbackRihtMsg({ "flowContentList": flowContentList });
    }
    catch (e) {
      return callbackThrowErrorMsg(e);
    }
  }

  //获取流程详情:
  API.remoteMethod("FlowContent_GetFlowContentDetail",
    {
      description: "获取流程详情",
      http: {
        verb: 'post'
      },
      accepts: [
        {
          arg: 'flowProcessId',
          description: "流程Id",
          type: 'string'
        }
      ],
      returns: retDataModel
    });


  //获取流程详情
  API.FlowContent_GetFlowContentDetail = async function (flowProcessId) {
    try {
      console.log("flowProcessId===>", flowProcessId);
      const FlowContentG = G('commonUtils:lbapp').getLbModel("FlowContent");
      let flowContent = await FlowContentG.getFlowContentById({ flowProcessId });
      if (!flowContent) {
        return callbackRihtMsg({ "flowContent": {} });
      }
      flowContentList = await getCompFlowContentByflowContentList({ flowContentList: [flowContent] });
      return callbackRihtMsg({ "flowContent": flowContent });
    }
    catch (e) {
      return callbackThrowErrorMsg(e);
    }
  }

  //获取被分享的流程详情:
  API.remoteMethod("FlowContent_GetShareFlowContentDetail",
    {
      description: "获取被分享的流程详情",
      http: {
        verb: 'post'
      },
      accepts: [
        {
          arg: 'flowProcessId',
          description: "流程Id",
          type: 'string'
        }
      ],
      returns: retDataModel
    });


  //获取流程详情
  API.FlowContent_GetShareFlowContentDetail = async function (flowProcessId) {
    try {
      console.log("flowProcessId===>", flowProcessId);
      const FlowContentG = G('commonUtils:lbapp').getLbModel("FlowContent");
      let flowContent = await FlowContentG.getFlowContentById({ flowProcessId });
      if (!flowContent || flowContent["isShared"] == 0) {
        return callbackRihtMsg({ "flowContent": {} });
      }
      flowContentList = await getCompFlowContentByflowContentList({ flowContentList: [flowContent] });
      return callbackRihtMsg({ "flowContent": flowContent });
    }
    catch (e) {
      return callbackThrowErrorMsg(e);
    }
  }

  //通过标签ID获取流程列表:
  API.remoteMethod("FlowContent_GetFlowContentListByTagId",
    {
      description: "通过标签ID获取流程列表",
      http: {
        verb: 'post'
      },
      accepts: [
        {
          arg: 'tagId',
          description: "标签ID",
          type: 'string'
        }
      ],
      returns: retDataModel
    });


  //获取用户的文件夹列表和标签列表
  API.FlowContent_GetFlowContentListByTagId = async function (tagId) {
    try {
      const FlowContentG = G('commonUtils:lbapp').getLbModel("FlowContent");
      let flowContentList = await FlowContentG.APIGetFlowContentListByTagId({ tagId });
      console.log("flowContentList===>", flowContentList);
      flowContentList = await getCompFlowContentByflowContentList({ flowContentList });
      return callbackRihtMsg({ "flowContentList": flowContentList });
    }
    catch (e) {
      return callbackThrowErrorMsg(e);
    }
  }

  //获取用户已分享的流程列表:
  API.remoteMethod("FlowContent_GetFlowContentListByShared",
    {
      description: "获取用户已分享的流程列表",
      http: {
        verb: 'post'
      },
      accepts: [
        {
          arg: 'userId',
          description: "用户ID",
          type: 'string'
        }
      ],
      returns: retDataModel
    });


  //获取用户的文件夹列表和标签列表
  API.FlowContent_GetFlowContentListByShared = async function (userId) {
    try {
      const FlowContentG = G('commonUtils:lbapp').getLbModel("FlowContent");
      let flowContentList = await FlowContentG.APIGetFlowContentListByShared({ userId });
      flowContentList = await getCompFlowContentByflowContentList({ flowContentList });
      return callbackRihtMsg({ "flowContentList": flowContentList });
    }
    catch (e) {
      return callbackThrowErrorMsg(e);
    }
  }

  //通过查询关键字获取流程列表:
  API.remoteMethod("FlowContent_GetFlowContentListBySearchKey",
    {
      description: "通过查询关键字获取流程列表",
      http: {
        verb: 'post'
      },
      accepts: [
        {
          arg: 'userId',
          description: "用户ID",
          type: 'string'
        },
        {
          arg: 'searchKey',
          description: "用户查询的关键字",
          type: 'string'
        }
      ],
      returns: retDataModel
    });


  //获取用户的文件夹列表和标签列表
  API.FlowContent_GetFlowContentListBySearchKey = async function (userId, searchKey) {
    try {
      const FlowContentG = G('commonUtils:lbapp').getLbModel("FlowContent");
      let flowContentList = await FlowContentG.APIGetFlowContentListBySearchKey({ userId, searchKey });
      flowContentList = await getCompFlowContentByflowContentList({ flowContentList });
      return callbackRihtMsg({ "flowContentList": flowContentList });
    }
    catch (e) {
      return callbackThrowErrorMsg(e);
    }
  }


  let getCompFlowContent = async function ({ flowContent }) {
    let responseData = await getCompFlowContentByflowContentList({
      "flowContentList": [flowContent]
    });
    return responseData[0];
  }
  //构建完整的流程列表
  //添加文件夹名称和标签名称
  let getCompFlowContentByflowContentList = async function ({ flowContentList }) {
    const FlowContentG = G('commonUtils:lbapp').getLbModel("FlowContent");
    const FolderG = G('commonUtils:lbapp').getLbModel("Folder");
    const TagG = G('commonUtils:lbapp').getLbModel("Tag");
    let folderIds = [];
    let tagIds = [];
    for (let i = 0; i < flowContentList.length; i++) {
      let folderId = flowContentList[i]["folderId"];
      let itemTagIds = flowContentList[i]["tagIds"].split(',');
      folderIds.push(folderId);
      tagIds = [...tagIds, ...itemTagIds];
    }
    tagIds = Array.from(new Set(tagIds));

    let folderList = await FolderG.getFoldersByFolderIds({ folderIds });
    flowContentList = FlowContentG.buildFlowContentByFolder({ flowContentList, folderList });
    let tagList = await TagG.getFoldersByTagIds({ tagIds });
    flowContentList = FlowContentG.buildFlowContentByTag({ flowContentList, tagList });
    return flowContentList;
  }
};