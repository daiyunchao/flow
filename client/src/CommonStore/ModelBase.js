import { observable, computed, autorunAsync, action, extendObservable } from "mobx";
class ModelBase{
    constructor(){
        this.data = {};
        this.status = {};
    }

    dataPropChange = (value, prop) => {
        if (this["data"]) {
            this["data"][prop] = value;
        }
    }

    statusPropChange = (value, prop) => {
        if (this["status"]) {
            this["status"][prop] = value;
        }
    }
}
export default ModelBase;