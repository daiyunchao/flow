import React from 'react';
import { Form, Icon, Input, Button, Checkbox, Modal, Dropdown, Menu } from 'antd';
import '../../index.css'
import { observer } from 'mobx-react';
import Model from '../store/EditFolderModel';
@observer
/**
 * 创建/编辑文件夹
 * 单例 页面初始化被加载
 */
export default class EditFolder extends React.Component {
    
    render() {
        let currentIsCreateStatus = Model.status.isCreateStatus;
        let menuItem = Model.data.folderList.map(function (item) {
            return (<Menu.Item key={item.folderId} selectable>{item.folderName}</Menu.Item>)
        });
        let menu = (
            <Menu onClick={(e) => {
                Model.changeFolder(e);
            }}>
                {menuItem}
            </Menu>
        );

        return (
            <div>
                <Modal
                    title={
                        <span>
                            <Icon type="folder" />
                            {Model.status.title}
                        </span>}
                    maskClosable={false}
                    visible={Model.status.isShow}
                    onOk={() => {
                        if (currentIsCreateStatus == true) {
                            Model.ClickCreateSure();
                        } else {
                            Model.ClickEditSure();
                        }
                    }}
                    onCancel={() => {
                        if (currentIsCreateStatus == true) {
                            Model.ClickCreateCancel();
                        }
                        else {
                            Model.ClickEditCancel();
                        }
                    }}
                    cancelText="取消"
                    okText="确定"
                >
                    <div>
                        {
                            currentIsCreateStatus == true
                                ?
                                <div>
                                    <span className="createFolderName">
                                        请输入文件夹名称:
                                    </span>
                                    <Input
                                        value={Model.data.newFolderName}
                                        style={{ "width": "70%" }}
                                        placeholder="请输入文件夹的名称"
                                        onChange={
                                            (e) => {
                                                let newValue = e.target.value;
                                                Model.changeFolderName(newValue);
                                            }
                                        }
                                    >
                                    </Input>
                                </div>
                                :
                                <div>
                                    <span className="createFolderName">请选择新的文件夹:</span>
                                    <Dropdown.Button overlay={menu}>
                                        {
                                            Model.data.selectedFolder.folderName
                                        }
                                    </Dropdown.Button>
                                </div>
                        }

                    </div>
                </Modal>
            </div>)
    }
}