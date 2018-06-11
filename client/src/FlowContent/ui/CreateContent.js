import React from 'react';
import {Form, Menu, Card, Icon, Input, Button, Checkbox, Modal, Row, Col} from 'antd';
import CreateContentModel from '../store/CreateContentModel';
import CreateContentBelong from './CreateContentBelong';
import CreateContentItem from './CreateContentItem';
import EventHandler from '../../CommonUtils/eventHandler';
import PropTypes from 'prop-types';
import '../../index.css'
import {observer} from 'mobx-react';
@observer
export default class CreateContent extends React.Component {
  constructor() {
    super();
    let self = this;
    self.model = new CreateContentModel();

  }

  render() {
    let Model = this.model;
    let modelData = Model.data;
    let contentHTML = modelData.contentItemList.map(function (item, index) {
      return (
        <CreateContentItem
          key={`editContent_${index}`}
          rowIndex={`${index + 1}`}
          content={item}
          contentChange={
            (newContent) => {
              Model.changeItemContent(index + 1, newContent);
            }
          }
          insertItem={
            () => {
              Model.InsertItemInBefore(index + 1);
            }
          }
          addItem={
            () => {
              Model.AddItemAfter(index + 1);
            }
          }
          deleteItem={
            () => {
              Model.DeleteItem(index + 1);
            }
          }
        >
        </CreateContentItem>
      )
    })
    return (
      <Card
        title={
          <Input
            style={{width: "80%"}}
            size="large"
            value={modelData.title}
            placeholder="请输入流程标题"
            onChange={
              (e) => {
                let newTitle = e.target.value;
                Model.changeTitle(newTitle);
              }
            }
          >
          </Input>
        }
        extra={
          <div>
            <a className="optItem"
               onClick={
                 () => {
                   Model.clickSaveBtn();
                 }}>
              <Icon type="save"/>
              保存
            </a>
          </div>}
        style={{background: "rgba(255,255,255,0.7)", "minHeight": window.innerHeight - 75}}>
        <CreateContentBelong
          {...Model.data} changeShareStatus={
          (isOpen) => {
            this.model.data.isShared = isOpen == true ? 1 : 0;
            console.log("model.data.isShared==>", this.model.data.isShared);
          }
        }></CreateContentBelong>
        {contentHTML}
        <Row>
          <Col span={1}></Col>
          <Col span={24 - 4} style={{"textAlign": "right"}}>
            <Button
              type="primary"
              loading={Model.status.btnIsLoadding}
              icon="save"
              onClick={
                () => {
                  Model.clickSaveBtn();
                }}
            >
              保 存
            </Button>
          </Col>
          <Col span={3}></Col>
        </Row>
      </Card>
    );
  }
}
