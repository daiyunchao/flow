import React from 'react';
import { Form, Menu, Card, Icon, Input, Button, Checkbox, Modal, message } from 'antd';
import Model from '../store/CurrentContentModel';
import ContentItem from './ContentItem';
import ContentBelong from './ContentBelong';
import EventHandler from '../../CommonUtils/eventHandler';
import CommHelper from '../../CommonUtils/commHelper';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import CommonModal from '../../CommonModal/store/CommonModal';
import MainModel from '../../Main/store/MainModel';
import '../../index.css'
import { observer } from 'mobx-react';
@observer
export default class ContentModel extends React.Component {
    constructor() {
        super();
        this.model = Model;
    }


    //显示删除确认框:
    showDeleteModal() {
        CommonModal.setModalInfo({
            title: "温馨提示",
            content: "如果一旦删除该流程将不能恢复,确定要删除吗?",
            sureCB: function () {
                Model.deleteFlowContent();
            },
            cancelCB: function () {

            }
        });
    }


    //将流程内容转换成编辑状态
    changeStatusToEdit() {
        Model.changeContentStatusIsEdit();
    }

    render() {
        if (Model.status.hasContent) {
            let contentList = this.model.data.contentItemList;
            let contentListWithCopy = this.model.data.contentItemListWithCopy.join('\n');
            let contentListHtml = contentList.map(function (item, index) {
                let rowIndex = index + 1;
                return (
                    <ContentItem
                        key={"contentItem_" + index}
                        rowIndex={rowIndex}
                        content={item}
                    >
                    </ContentItem>
                )
            });

            return (
                <Card
                    title={<div style={{ "fontSize": 25, }}>{this.model.data.title}</div>}
                    extra={
                        <div>
                            <CopyToClipboard
                                text={contentListWithCopy}
                                onCopy={() => {
                                    message.success("复制完成");
                                }}
                            >
                                <a className="optItem">
                                    <Icon type="copy" />
                                    复制流程
                                </a>
                            </CopyToClipboard>
                            <a className="optItem" onClick={() => {
                                this.changeStatusToEdit();
                            }}>
                                <Icon type="edit" />
                                编辑
                                </a>
                            <a className="optItem"
                                onClick={() => {
                                    this.showDeleteModal();
                                }}>
                                <Icon type="delete" />
                                删除
                            </a>
                        </div>}
                    style={{ background: "rgba(255,255,255,0.8)", "minHeight": window.innerHeight - 75 }}>
                    {contentListHtml}
                    <ContentBelong {...this.model.data} changeShareStatus={
                        (isShared) => {
                            this.model.changeContentShareStatus(isShared)
                        }}></ContentBelong>
                </Card>
            )
        } else {
            return (
                <div style={{ background: "rgba(255,255,255,0.7)", "minHeight": window.innerHeight - 75 }}>
                    <div style={{ "textAlign": "center", "paddingTop": "30%", "fontSize": 25 }}>
                        <span>还没有任何流程,</span><a onClick={() => {
                            MainModel.changeStatus({
                                "pageStatus": "create"
                            });
                        }}>戳这里添加</a>
                    </div>
                </div>
            )
        }
    }
}