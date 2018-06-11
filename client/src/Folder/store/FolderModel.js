import { observable, computed, autorunAsync, action, extendObservable } from "mobx";
import GS from '../../CommonStore/GSModel'
import { message } from 'antd'
import AsyncRequest from '../../CommonStore/asyncRequest'
/**
 * 文件夹的父类,
 * 提供通用的文件夹的属性和方法
 */
class FolderModel {
    initDataAndStatus() {
        this.initData();
        this.initStatus();
    }

    initData() {
        let baseData = {
            "folderList": [],
            "selectedFolder": {
                "folderId": "",
                "folderName": ""
            }
        };

        let chrData = this.data;
        let allDatas = { ...baseData, ...chrData };

        //初始化数据
        extendObservable(this.data, allDatas);
    }

    initStatus() {
        let baseStatus = {
            "isChangeFolder": false,
        };

        let chrStatus = this.status;
        let allStatus = { ...baseStatus, ...chrStatus };

        //初始化数据
        extendObservable(this.status, allStatus);
    }

    //获取文件夹列表
    async getFolderList() {
        let folderList = await this.asyncGetFolderList();
        this.data.folderList = folderList;
    }

    //获取我的文件夹列表(如果存在,则使用缓存数据):
    async getFolderListUseCache() {
        let currentfolderList = this.data.folderList
        if (currentfolderList && Array.isArray(currentfolderList) && currentfolderList.length > 0) {
            //文件夹列表已存在
            //直接使用缓存数据
        }
        else {
            //没有获取过,则重启获取文件夹列表
            //获取文件夹
            await this.getFolderList();
        }
        return this.data.folderList;
    }

    @action userSelectedFolder({
       folderId,
        folderName
    }) {
        console.log("userSelectedFolder===>", folderId, folderName);
        this.status.isChangeFolder = true;
        this.data.selectedFolder = {
            "folderId": folderId,
            "folderName": folderName
        }
    }

    //异步获取文件夹列表:
    async asyncGetFolderList() {
        let responseData = await AsyncRequest.getFolderListByUserId({ "userId": GS.baseInfoSetting.userId })
        return responseData["folderList"];
    }

    async asyncCreateFolder({
        folderName = ""
    }) {
        try {
            let responseData = await AsyncRequest.CreateFolder({ "userId": GS.baseInfoSetting.userId, folderName });
            message.success("添加成功");
            return responseData.folderInfo;

        } catch (e) {
            if (e && e.message) {
                return message.error(e.message);
            }
            return message.error("未知错误");
        }
    }
}

export default FolderModel;