/**
 * 事件帮助类
 */
class eventHandler {
    events = {}
    constructor() {

    }

    //注册事件
    registerEvent({ key, type = "common", fn }) {
        if (this.events[key]) {
            //如果已存在,则添加到原数组中去:
            if (type == "only") {
                this.events[key] = [fn];
            } else {
                this.events[key].push(fn)
            }

        }
        else{
             this.events[key] = [fn];
        }
    }

    //移除事件
    removeEvent({ key }) {
        if (this.events[key]) {
            this.events[key] = [];
        }
    }

    //触发事件
    dispatchEvent({ key,args }) {
        if (this.events[key]) {
            for (let i = 0; i < this.events[key].length; i++) {
                let item = this.events[key][i];
                item(...args);
            }
        }
    }
}
export default new eventHandler