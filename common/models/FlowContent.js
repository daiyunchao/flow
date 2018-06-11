var G = require('bearcat-helper');
module.exports = function (FlowContent) {
  let errorHelper = G("commonUtils:errorHelper");
  //错误消息的枚举
  let errorMsgMenu = errorHelper.Keys;

  //抛出一个错误信息:
  let throwErrorMsg = function (errorMsg) {
    return errorHelper.throwErrorMsg(errorMsg);
  }

  let getNewTitleWithSameTitle = function (sameTitle) {
    return `${sameTitle}（New）`
  }

  //创建流程
  FlowContent.APICreateFlowContent = async function ({
    createUid,//创建人
    contentObj,//内容对象
  }) {
    console.log("in APICreateFlowContent args==>", arguments);
    if (!contentObj) {
      return throwErrorMsg(errorMsgMenu.inputInfoIsNotComplete);
    }
    contentObj.flowProcessId = G("commonUtils:random_id").newId();
    contentObj.userId = createUid;

    //验证参数
    let isTrue = FlowContent.validateContent(contentObj);
    if (!isTrue) {
      return throwErrorMsg(errorMsgMenu.inputInfoIsNotComplete);
    }

    //判断是否重名
    let sameNameCount = await FlowContent.getCountByName({
      "userId": createUid,
      "contentName": contentObj.title
    });
    if (sameNameCount > 0) {
      //存在同名的情况,修改标题
      contentObj.title = getNewTitleWithSameTitle(contentObj.title);
    }

    await FlowContent.createFlowContent(contentObj);
    return await FlowContent.getFlowContentById({
      "flowProcessId": contentObj.flowProcessId
    })
  };

  FlowContent.APIChangeContent = async function ({
    flowProcessId,
    content
  }) {
    return await FlowContent.updatePropsByFlowProccessId({
      flowProcessId,
      propsObj: { "content": content,"createTime":Date.now() }
    });
  }

  //编辑流程
  FlowContent.APIEditFlowContent = async function ({
    flowProcessId,
    contentObj,//内容对象
  }) {
    if (!contentObj) {
      return throwErrorMsg(errorMsgMenu.inputInfoIsNotComplete);
    }

    //验证参数
    contentObj["flowProcessId"] = flowProcessId;
    console.log("contentObj===>", contentObj);
    let isTrue = FlowContent.validateContent(contentObj);
    if (!isTrue) {
      return throwErrorMsg(errorMsgMenu.inputInfoIsNotComplete);
    }

    //判断是否重名
    let sameNameCount = await FlowContent.getCountByNameWithEdit({
      "userId": contentObj.userId,
      "contentName": contentObj.title,
      "flowProcessId": flowProcessId
    });
    console.log("sameNameCount===>", sameNameCount);
    if (sameNameCount > 0) {
      //存在同名的情况,修改标题
      contentObj.title = getNewTitleWithSameTitle(contentObj.title);
    }

    contentObj["flowProcessId"] = flowProcessId;

    await FlowContent.editFlowContent(contentObj);
    return await FlowContent.getFlowContentById({
      "flowProcessId": contentObj.flowProcessId
    })
  }

  //删除流程
  FlowContent.APIDeleteFlowContent = async function ({ flowProcessId }) {
    if (!flowProcessId) {
      return throwErrorMsg(errorMsgMenu.inputInfoIsNotComplete);
    }
    return await FlowContent.updatePropsByFlowProccessId({
      flowProcessId,
      propsObj: { "isDelete": 1 }
    });
  }


  //修改分享状态
  FlowContent.APIChangeShareStatus = async function ({
    flowProcessId,
    isShared
  }) {
    let sharedStatus = [0, 1];
    if (!flowProcessId) {
      return throwErrorMsg(errorMsgMenu.inputInfoIsNotComplete);
    }
    if (isNaN(isShared)) {
      return throwErrorMsg(errorMsgMenu.inputParamTypeError);
    }
    if (sharedStatus.indexOf(Number(isShared)) == -1) {
      return throwErrorMsg(errorMsgMenu.inputParamRangError);
    }

    return await FlowContent.updatePropsByFlowProccessId({
      flowProcessId,
      propsObj: { "isShared": isShared }
    });
  }

  //修改所属文件夹
  FlowContent.APIChangeFolder = async function ({
    flowProcessId,
    newFolderId
  }) {
    if (!flowProcessId) {
      return throwErrorMsg(errorMsgMenu.inputInfoIsNotComplete);
    }
    if (!newFolderId) {
      return throwErrorMsg(errorMsgMenu.inputInfoIsNotComplete);
    }
    return await FlowContent.updatePropsByFlowProccessId({
      flowProcessId,
      propsObj: { "folderId": newFolderId }
    });
  }

  //修改包含的标签,可使用数组或逗号字符串
  FlowContent.APIChangeTags = async function (flowProcessId,
    tagIds) {
    let tagIdStrs = tagIds;
    if (!flowProcessId) {
      return throwErrorMsg(errorMsgMenu.inputInfoIsNotComplete);
    }
    if (Array.isArray(tagsId)) {
      tagIdStrs = tagsId.toString();
    }
    return await FlowContent.updatePropsByFlowProccessId({
      flowProcessId,
      propsObj: { "tagIds": tagIdStrs }
    });
  }

  //获取最新列表
  FlowContent.APIGetLastFlowContentList = async function ({
    userId
  }) {
    return await FlowContent.getListByWhereAndOrder(
      {
        "where": {
          "userId": userId,
          "isDelete":0,
        },
        "order": "createTime desc"
      }
    );
  }

  //通过FolderId获取列表
  FlowContent.APIGetFlowContentListByFloderId = async function ({
    folderId
  }) {
    return await FlowContent.getListByWhereAndOrder(
      {
        "where": {
          "folderId": folderId,
          "isDelete":0,
        },
        "order": "createTime desc"
      }
    );
  }

  //通过TagId获取列表
  FlowContent.APIGetFlowContentListByTagId = async function ({
    tagId
  }) {
    console.log("APIGetFlowContentListByTagId tagId==>", tagId);
    let pattern = new RegExp('.*' + tagId + '.*', "i");
    return await FlowContent.getListByWhereAndOrder(
      {
        "where": {
          "tagIds": { like: pattern },
          "isDelete":0,
        },
        "order": "createTime desc"
      }
    );
  }

  //获取已被分享的列表
  FlowContent.APIGetFlowContentListByShared = async function ({
    userId
  }) {
    return await FlowContent.getListByWhereAndOrder(
      {
        "where": {
          "userId": userId,
          "isShared": 1,
          "isDelete":0,
        },
        "order": "createTime desc"
      }
    );
  }


  //通过关键字查询列表
  FlowContent.APIGetFlowContentListBySearchKey = async function ({
    userId,
    searchKey,
  }) {
    let pattern = new RegExp('.*' + searchKey + '.*', "i");
    return await FlowContent.getListByWhereAndOrder(
      {
        "where": {
          "userId": userId,
          "isDelete":0,
          "or": [
            {
              "title": {
                "like": pattern
              }
            },
            {
              "content": {
                "like": pattern
              }
            },
          ]
        },
        "order": "createTime desc"
      }
    );
  }


  //通过标签列表获取该标签的包含的流程数量
  FlowContent.APIGetTagConFlowContentCount = async function ({ tagList }) {
    if (!tagList) {
      return throwErrorMsg(errorMsgMenu.inputInfoIsNotComplete);
    }
    if (!Array.isArray(tagList)) {
      return throwErrorMsg(errorMsgMenu.inputParamTypeError);
    }
    if (tagList.length == 0) {
      return tagList;
    }
    let findCase = [];

    for (let i = 0; i < tagList.length; i++) {
      let item = tagList[i];
      let pattern = new RegExp('.*' + item["tagId"] + '.*', "i");
      findCase.push({ "tagIds": { "like": pattern } })
    }
    let conFlowContents = await FlowContent.find({
      "where": {
        "or": findCase
      }
    });

    for (let i = 0; i < tagList.length; i++) {
      let item = tagList[i];
      for (let j = 0; j < conFlowContents.length; j++) {
        let conFlowContentItem = conFlowContents[j];
        let flowContentTagIds = conFlowContentItem["tagIds"];
        if (flowContentTagIds.indexOf(item) > -1) {
          tagList[i]["hasFlowContentCount"] += 1;
        }
      }
    }

    return tagList;
  }


  FlowContent.getListByWhereAndOrder = async function ({ where, order }) {
    console.log("where===>", where);
    return await FlowContent.find({
      "where": where,
      "order": order
    });
  }

  //通过id修改属性
  FlowContent.updatePropsByFlowProccessId = async function ({
    flowProcessId,
    propsObj
  }) {
    return new Promise((r, j) => {
      FlowContent.updateAll({
        "flowProcessId": flowProcessId
      }, propsObj, function (err) {
        if (err) {
          return j(err);
        }
        return r();
      })
    })
  }

  //通过名称获取当前的流程数量
  FlowContent.getCountByName = async function ({ userId, contentName }) {
    return await FlowContent.count({
      "title": contentName,
      "isDelete": 0,
      "userId": userId
    })
  }

  //通过名称获取当前的流程数量
  FlowContent.getCountByNameWithEdit = async function ({ userId, contentName, flowProcessId }) {
    return await FlowContent.count({
      "title": contentName,
      "isDelete": 0,
      "userId": userId,
      "flowProcessId": { neq: flowProcessId }
    })
  }

  //验证flowContent的合法性
  FlowContent.validateContent = function (contentObj) {
    return G("commonUtils:common").validateObjectTypeRequireProps({
      "validateObj": contentObj,
      "propsArr": ["flowProcessId", "title", "content", "userId", "folderId"]
    });
  }


  //创建流程
  FlowContent.createFlowContent = async function (contentObj) {
    if (!contentObj) {
      return throwErrorMsg(errorMsgMenu.inputInfoIsNotComplete);
    }
    let canCreate = FlowContent.validateContent(contentObj);
    if (!canCreate) {
      return throwErrorMsg(errorMsgMenu.inputInfoIsNotComplete);
    }
    contentObj.createTime = Date.now();
    return await FlowContent.create(contentObj)
  };

  //编辑流程
  FlowContent.editFlowContent = async function (contentObj) {
    if (!contentObj || !contentObj.flowProcessId) {
      return throwErrorMsg(errorMsgMenu.inputInfoIsNotComplete);
    }
    let canCreate = FlowContent.validateContent(contentObj);
    if (!canCreate) {
      return throwErrorMsg(errorMsgMenu.inputInfoIsNotComplete);
    }
    // console.log("in editFlowContent===>", contentObj.flowProcessId)
    contentObj["createTime"] = Date.now();
    return await FlowContent.updateAll(
      { "flowProcessId": contentObj.flowProcessId },
      contentObj
    );
  }

  //创建或是编辑流程
  FlowContent.createOrEditFlowContent = async function (contentObj) {
    if (!contentObj) {
      return throwErrorMsg(errorMsgMenu.inputInfoIsNotComplete);
    }
    let canCreate = FlowContent.validateContent(contentObj);
    if (!canCreate) {
      return throwErrorMsg(errorMsgMenu.inputInfoIsNotComplete);
    }
    return await FlowContent.upsertWithWhere({ "flowProcessId": contentObj.flowProcessId });

  }

  //构建内容和文件夹
  FlowContent.buildFlowContentByFolder = function ({ flowContentList, folderList }) {
    let folderListObj = {};
    if (!flowContentList) {
      return throwErrorMsg(errorMsgMenu.inputInfoIsNotComplete);
    }
    if (!Array.isArray(flowContentList)) {
      return throwErrorMsg(errorMsgMenu.inputParamTypeError);
    }
    if (!folderList) {
      return throwErrorMsg(errorMsgMenu.inputInfoIsNotComplete);
    }
    if (!Array.isArray(folderList)) {
      return throwErrorMsg(errorMsgMenu.inputParamTypeError);
    }
    for (let i = 0; i < folderList.length; i++) {
      let item = folderList[i];
      folderListObj[item["folderId"]] = item["folderName"];
    }

    for (let i = 0; i < flowContentList.length; i++) {
      let item = flowContentList[i];
      let folderId = item["folderId"];
      flowContentList[i]["folderName"] = folderListObj[folderId];
    }
    return flowContentList;
  }

  //构建内容和标签
  FlowContent.buildFlowContentByTag = function ({ flowContentList, tagList }) {
    let tagListObj = {};
    if (!flowContentList) {
      return throwErrorMsg(errorMsgMenu.inputInfoIsNotComplete);
    }
    if (!Array.isArray(flowContentList)) {
      return throwErrorMsg(errorMsgMenu.inputParamTypeError);
    }
    if (!tagList) {
      return throwErrorMsg(errorMsgMenu.inputInfoIsNotComplete);
    }
    if (!Array.isArray(tagList)) {
      return throwErrorMsg(errorMsgMenu.inputParamTypeError);
    }
    for (let i = 0; i < tagList.length; i++) {
      let item = tagList[i];
      tagListObj[item["tagId"]] = item["tagName"];
    }

    for (let i = 0; i < flowContentList.length; i++) {
      let item = flowContentList[i];
      let tagIds = item["tagIds"].split(',');
      flowContentList[i]["tagNames"] = [];
      for (let j = 0; j < tagIds.length; j++) {
        let tagId = tagIds[j];
        flowContentList[i]["tagNames"].push(tagListObj[tagId]);
      }
    }
    return flowContentList;
  }
  //通过id获取内容:
  FlowContent.getFlowContentById = async function ({
    flowProcessId
  }) {
    if (!flowProcessId) {
      return throwErrorMsg(errorMsgMenu.inputInfoIsNotComplete);
    }
    return await FlowContent.findOne({
      "where": {
        "flowProcessId": flowProcessId
      }
    })
  }
}