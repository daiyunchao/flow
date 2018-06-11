var G = require('bearcat-helper');
module.exports = function (Tag) {

    let errorHelper = G("commonUtils:errorHelper");
    //错误消息的枚举
    let errorMsgMenu = errorHelper.Keys;

    //抛出一个错误信息:
    let throwErrorMsg = function (errorMsg) {
        return errorHelper.throwErrorMsg(errorMsg);
    }


    //创建标签
    Tag.APICreateTag = async function ({ userId, tagName }) {
        let newTagId = G("commonUtils:random_id").newId();
        let sameTagNameCount = await Tag.getCountByTagName({ userId, tagName });
        if (sameTagNameCount > 0) {
            return throwErrorMsg(errorMsgMenu.TagNameRepeat);
        }
        await Tag.createTag({
            "tagId": newTagId,
            "tagName": tagName,
            "createUserId": userId
        });
        return await Tag.getTagByTagId({ TagId: newTagId });
    }

    //修改标签的名称
    Tag.APIChangeTagName = async function ({ TagId, newTagName }) {
        return await Tag.updateTagPropByTagId(
            {
                TagId,
                newTagProps: {
                    "tagName": newTagName
                }
            });
    }

    //删除文件夹
    Tag.APIDeleteTag = async function ({ TagId }) {
        return await Tag.updateTagPropByTagId({
            TagId,
            newTagProps: {
                "isDelete": 1
            }
        })
    }

    //通过用户ID获取标签列表
    Tag.APIGetTagsByUserId = async function ({ userId }) {
        return await Tag.find({
            "where": {
                "createUserId": userId,
                "isDelete": 0,
            }
        });
    }

    //通过用户ID获取标签列表
    Tag.APIGetTagListByUserId = async function ({ userId }) {
        if (!userId) {
            return throwErrorMsg(errorMsgMenu.inputMsgComplete);
        }
        return await Tag.find({
            "where": {
                "createUserId": userId
            }
        })
    }

    //通过标签id列表获取标签列表
    //参数 tagIds: 可传数组或是逗号分隔的字符串
    Tag.APIGetTagListByTagIds = async function ({ tagIds }) {
        let paramsIsArr = Array.isArray(tagIds);
        if (!paramsIsArr) {
            tagIds = tagIds.split(',');
        }
        return await Tag.find({
            "where": {
                "tagId": { "inq": tagIds }
            }
        })
    }


    //通过文件夹id列表获取文件夹列表
    Tag.getFoldersByTagIds = async function ({ tagIds }) {
        if (!tagIds) {
            return throwErrorMsg(errorMsgMenu.inputInfoIsNotComplete);
        }
        if (!Array.isArray(tagIds)) {
            return throwErrorMsg(errorMsgMenu.inputParamTypeError);
        }
        return Tag.find({
            "where": {
                "tagId": { "inq": tagIds }
            }
        })
    }


    //创建标签
    Tag.createTag = async function ({ tagId, tagName, createUserId }) {
        console.log("createTag args===>", arguments);
        return new Promise((r, j) => {
            Tag.create({
                "tagId": tagId,
                "tagName": tagName,
                "createUserId": createUserId,
                "createTime": Date.now()
            }, function (err) {
                if (err) {
                    return j(err);
                }
                return r();
            })
        })
    }



    Tag.getCountByTagName = async function ({ userId, tagName }) {
        return await Tag.count({
            "createUserId": userId,
            "tagName": tagName,
            "isDelete": 0,
        });
    }

    Tag.getTagByTagId = async function ({ TagId }) {
        return await Tag.findOne({
            "where": {
                "tagId": TagId
            }
        });
    }


    //通过文件夹Id修改文件夹属性
    Tag.updateTagPropByTagId = async function ({ TagId, newTagProps }) {
        return new Promise((r, j) => {
            Tag.updateAll(
                {
                    "TagId": TagId
                },
                newTagProps
                , function (err) {
                    if (err) {
                        return j(err);
                    }
                    return r();
                }
            )
        })
    }

}
