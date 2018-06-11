import React from 'react';
import { Form, Icon, Input, Button, Checkbox, Modal, Row, Col } from 'antd';
import Menu from '../../Menu/ui/Menu'
import ContentList from '../../Menu/ui/MenuContentList';
import Header from '../../Header/ui/Header'
import Content from '../../FlowContent/ui/Content'
import CreateContent from '../../FlowContent/ui/CreateContent';
import EditContent from '../../FlowContent/ui/EditContent';
import '../../index.css'
import Model from '../store/MainModel';
import CommonModal from '../../CommonModal/store/CommonModal';
import { observer } from 'mobx-react';
import EventHandler from '../../CommonUtils/eventHandler';
@observer
export default class Main extends React.Component {
    constructor() {
        super();
        let self = this;
    }
    render() {
        let h = (Model.status.totalHeight - 30) + "px";
        let contentHtml = null;
        if (Model.status.pageStatus == "create") {
            contentHtml = (
                <div className="cotnentCon">
                    <CreateContent ></CreateContent>
                </div>
            );
        } else if (Model.status.pageStatus == "edit") {
            contentHtml = (
                <div className="cotnentCon">
                    <EditContent></EditContent>
                </div>
            );

        }
        else if (Model.status.pageStatus == "detail") {
            //
            contentHtml = (
                <div className="cotnentCon">
                    <Content></Content>
                </div>
            );
        }

        return (
            <div className="mainCon">
                <Header></Header>
                <div className="contentCon" style={{  "marginTop": 5 }}>
                    <Row >
                        <Col span={3} className="menu_" style={{height:window.innerHeight-70}}>
                            <Menu></Menu>
                        </Col>
                        <Col span={4} className="contentList" style={{height:window.innerHeight-70}}>
                            <ContentList></ContentList>
                        </Col>
                        <Col span={24 - 3 - 4} className="contentMain" style={{height:window.innerHeight-70}}>
                            {contentHtml}
                        </Col>
                    </Row>
                </div>

            </div>
        )
    }
}