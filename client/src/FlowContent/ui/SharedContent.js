import React from 'react';
import { Form, Menu, Card, Icon, Input, Button, Checkbox, Modal, message, Row, Col } from 'antd';
import Model from '../store/CurrentContentModel';
import ContentItem from './ContentItem';
import ContentBelong from './ContentBelong';
import EventHandler from '../../CommonUtils/eventHandler';
import CommHelper from '../../CommonUtils/commHelper';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import CommonModal from '../../CommonModal/store/CommonModal';
import GSModel from '../../CommonStore/GSModel'
import '../../index.css'
import { observer } from 'mobx-react';
@observer
export default class ShareContentModel extends React.Component {
    constructor() {
        super();
        this.model = Model;
    }
    render() {
        if (Model.status.contentHasError) {
            return (
                <div className="shareContentMain" style={{ "height": window.innerHeight }}>
                    <div style={{
                        "textAlign": "center",
                        "paddingTop": "30%",
                        "fontSize": 25
                    }}>
                        <span>抱歉,该流程已被删除或取消了分享</span>
                    </div>
                </div>
            )
        }
        if (Model.status.hasContent) {
            let contentList = this.model.data.contentItemList;
            let contentListWithCopy = this.model.data.contentItemListWithCopy.join('\n');
            let contentListHtml = contentList.map(function (item, index) {
                let rowIndex = index + 1;
                return (
                    <ContentItem
                        key={"contentItem_" + index}
                        rowIndex={rowIndex}
                        isShared={true}
                        content={item}
                    >
                    </ContentItem>
                )
            });

            return (
                <div className="shareContentMain" style={{ "height": window.innerHeight }}>
                    <Card
                        title={<div style={{ "fontSize": 25, }}>{this.model.data.title}</div>}
                        style={{ background: "rgba(255,255,255,0.8)" }}>
                        {contentListHtml}
                    </Card>
                </div>

            )
        } else {
            return (
                <div className="shareContentMain" style={{ "height": window.innerHeight }}>
                    <div style={{
                        "textAlign": "center",
                        "paddingTop": "30%",
                        "fontSize": 25
                    }}>
                        <span>正在加载流程中...请稍后</span>
                    </div>
                </div>
            )
        }
    }
}
