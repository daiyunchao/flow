var G = require('bearcat-helper');
module.exports = function (Folder) {

    let errorHelper = G("commonUtils:errorHelper");
    //错误消息的枚举
    let errorMsgMenu = errorHelper.Keys;

    //抛出一个错误信息:
    let throwErrorMsg = function (errorMsg) {
        return errorHelper.throwErrorMsg(errorMsg);
    }


    //创建文件夹
    Folder.APICreateFolder = async function ({ userId, folderName }) {
        let newFolderId = G("commonUtils:random_id").newId();
        let sameFolderNameCount = await Folder.getCountByFolderName({ userId, folderName });
        if (sameFolderNameCount > 0) {
            return throwErrorMsg(errorMsgMenu.folderNameRepeat);
        }
        await Folder.createFolder({
            "folderId": newFolderId,
            "folderName": folderName,
            "createUserId": userId
        });
        return await Folder.getFolderByFolderId({ folderId: newFolderId });
    }

    //修改文件夹的名称
    Folder.APIChangeFolderName = async function ({ folderId, newFolderName }) {
        return await Folder.updateFolderPropByFolderId(
            {
                folderId,
                newFolderProps: {
                    "folderName": newFolderName
                }
            });
    }

    //删除文件夹
    Folder.APIDeleteFolder = async function ({ folderId }) {
        return await Folder.updateFolderPropByFolderId({
            folderId,
            newFolderProps: {
                "isDelete": 1
            }
        })
    }

    //通过用户ID获取文件夹列表
    Folder.APIGetFoldersByUserId = async function ({ userId }) {
        return await Folder.find({
            "where": {
                "createUserId": userId,
                "isDelete": 0,
            }
        });
    }

    //通过文件夹id列表获取文件夹列表
    Folder.getFoldersByFolderIds = async function ({ folderIds }) {
        if (!folderIds) {
            return throwErrorMsg(errorMsgMenu.inputInfoIsNotComplete);
        }
        if (!Array.isArray(folderIds)) {
            return throwErrorMsg(errorMsgMenu.inputParamTypeError);
        }
        return Folder.find({
            "where": {
                "folderId": { "inq": folderIds }
            }
        })
    }


    //创建文件夹
    Folder.createFolder = async function ({ folderId, folderName, createUserId }) {
        return new Promise((r, j) => {
            Folder.create({
                "folderId": folderId,
                "folderName": folderName,
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

    Folder.getCountByFolderName = async function ({ userId, folderName }) {
        return await Folder.count({
            "createUserId": userId,
            "folderName": folderName,
            "isDelete": 0,
        });
    }

    Folder.getFolderByFolderId = async function ({ folderId }) {
        return await Folder.findOne({
            "where": {
                "folderId": folderId
            }
        });
    }


    //通过文件夹Id修改文件夹属性
    Folder.updateFolderPropByFolderId = async function ({ folderId, newFolderProps }) {
        return new Promise((r, j) => {
            Folder.updateAll(
                {
                    "folderId": folderId
                },
                newFolderProps
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
