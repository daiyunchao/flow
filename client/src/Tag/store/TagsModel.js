import { observable, computed, autorunAsync, action, extendObservable } from "mobx";
import GS from '../../CommonStore/GSModel'
import { message } from 'antd'
import AsyncRequest from '../../CommonStore/asyncRequest'
class TagsModel {

    initDataAndStatus() {
        this.initData();
        this.initStatus();
    }
    initData() {
        let baseData = {
            "tagNames": [],
            "tagsList": [],
            "selectedTags": [],
        };

        let chrData = this.data;
        let allDatas = { ...baseData, ...chrData };

        //初始化数据
        extendObservable(this.data, allDatas);
    }

    initStatus() {
        let baseStatus = {
            "isChangeTags": false,
        };

        let chrStatus = this.status;
        let allStatus = { ...baseStatus, ...chrStatus };

        //初始化数据
        extendObservable(this.status, allStatus);
    }


    @action userChangeTags(newTag) {
        let newSelectedTags = [];
        for (let i = 0, len = this.data.tagsList.length; i < len; i++) {
            let item = this.data.tagsList[i];
            if (newTag.indexOf(item.tagName) > -1) {
                newSelectedTags.push(item);
            }
        }
        this.data.selectedTags = newSelectedTags;
    }

    async getTagList() {
        let tagList = await this.asyncGetTagList();
        this.data.tagsList = tagList;
        this.data.tagNames = tagList.map(function (item) {
            return item.tagName;
        })
    }

    async getTagListUseCache() {
        let currentTagList = this.data.tagsList;
        if (currentTagList && Array.isArray(currentTagList) && currentTagList.length > 0) {
            //文件夹列表已存在
            //直接使用缓存数据
        }
        else {
            //没有获取过,则重启获取文件夹列表
            //获取文件夹
            await this.getTagList();
        }
        return this.data.tagsList;
    }

    //异步获取文件夹列表:
    async asyncGetTagList() {
        let responseData = await AsyncRequest.getTagListByUserId({ "userId": GS.baseInfoSetting.userId })
        return responseData["tagList"];
    }

    async asyncCreateTag({ tagName }) {
        try {
            let responseData = await AsyncRequest.CreateTag({ "userId": GS.baseInfoSetting.userId, tagName });
            message.success("添加成功");
            console.log("responseData.tagInfo===>", responseData.tagInfo);
            return responseData.tagInfo;

        } catch (e) {
            if (e && e.message) {
                return message.error(e.message);
            }
            return message.error("未知错误");
        }
    }
}
export default TagsModel;