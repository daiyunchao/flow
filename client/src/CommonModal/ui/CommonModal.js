import React from 'react';
import { Form, Icon, Input, Button, Checkbox, Modal } from 'antd';
import '../../index.css'
import { observer } from 'mobx-react';

//提供UI数据/状态的Model
import Model from '../store/CommonModal';
@observer
/**
 * 用于通用Model显示,提示信息等对话框
 * 单例,页面初始化时被加载
 */
export default class CommonModal extends React.Component {
    render() {
        return (
            <div>
                <Modal
                    title={Model.status.title}
                    visible={Model.status.isShow}
                    onOk={() => {
                        Model.status.sureCB();
                    }}
                    onCancel={() => {
                        Model.status.cancelCB();
                    }}
                    cancelText="取消"
                    okText="确定"
                >
                    {Model.status.content}
                </Modal>
            </div>)
    }
}