import React from 'react';
import { Form, Icon, Input, Button, Checkbox, Modal, Select } from 'antd';
import '../../index.css'
import { observer } from 'mobx-react';
import Model from '../store/EditTagModel';
const Option = Select.Option;
@observer
export default class EditTag extends React.Component {
    tagChange(e) {
        Model.changeTags(e);
    }
    render() {
        let currentIsCreateStatus = Model.status.isCreateStatus;
        let selectedTag = Model.data.selectedTags.map(function (item) {
            return item.tagName;
        });
        let canSelectTags = Model.data.tagsList.map(function (item) {

            return (<Option key={item.tagId} value={item.tagName}>{item.tagName}</Option>)
        });
        return (
            <div>
                <Modal
                    title={<span><Icon type="tags-o" />
                        {
                            Model.status.title
                        }</span>}
                    maskClosable={false}
                    visible={Model.status.isShow}
                    onOk={() => {
                        if (currentIsCreateStatus) {
                            Model.ClickCreateSure();
                        } else {
                            Model.ClickEditSure();
                        }
                    }}
                    onCancel={() => {
                        if (currentIsCreateStatus) {
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
                            currentIsCreateStatus
                                ?
                                <div>
                                    <span className="createFolderName">
                                        请输入标签名称:
                                    </span>
                                    <Input
                                        style={{ "width": "70%" }}
                                        placeholder="请输入标签的名称"
                                        value={Model.data.newTagName}
                                        onChange={
                                            (e) => {
                                                let newTagName = e.target.value;
                                                Model.changeTagName(newTagName);
                                            }
                                        }
                                    ></Input>
                                </div>
                                :
                                <div>
                                    <span className="createFolderName">
                                        请选择新的标签:
                                    </span>
                                    <Select
                                        mode="tags"
                                        labelInValue={false}
                                        placeholder="Please select"
                                        value={selectedTag}
                                        onChange={this.tagChange}
                                        style={{ width: '90%' }}
                                    >
                                        {canSelectTags}
                                    </Select>
                                </div>
                        }
                    </div>
                </Modal>
            </div>)
    }
}