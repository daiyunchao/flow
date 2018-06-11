import { observable, computed, autorunAsync, action, extendObservable } from "mobx";
import TagsModel from './TagsModel'
class ContentTagModel extends TagsModel {
    constructor() {
        super();
        this.data={};
        this.status={};
        this.initDataAndStatus();
    }

    setVal({
        selectedTags
    }) {
        this.data.selectedTags = selectedTags;
    }
}
export default new ContentTagModel();