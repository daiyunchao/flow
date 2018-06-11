import React from 'react';
import {Form, Avatar, Row, Col, Menu, Tooltip, Card, Icon, Input, Button, Checkbox, Modal} from 'antd';
import '../../index.css'
import PropTypes from 'prop-types';
const {TextArea} = Input;
import {observer} from 'mobx-react';
import CommonHelper from '../../CommonUtils/commHelper';
import EventHandler from '../../CommonUtils/eventHandler';
@observer
export default class CreateContentItem extends React.Component {
  constructor() {
    super();
  }

  static defaultProps = {
    rowIndex: 0,//行号
    content: "",//内容
    contentChange: function () {
    },//当内容修改回调事件
    insertItem: function () {
    },//在当前项前加入一项
    addItem: function () {
    },//在该项后添加一项
    deleteItem: function () {
    },//删除该项

  }
  static propTypes = {
    rowIndex: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    contentChange: PropTypes.func.isRequired,
    insertItem: PropTypes.func.isRequired,
    addItem: PropTypes.func.isRequired,
    deleteItem: PropTypes.func.isRequired
  }

  render() {
    //默认行数:
    let rowCount = 4;
    if (this.props.content) {
      rowCount = this.props.content.split('\n').length;
      rowCount = rowCount > 4 ? rowCount : 4
    }

    return (
      <Row style={{"marginBottom": 20, "display": "flex", "justifyContent": "center", "alignItems": "center"}}>
        <Col span={1}>
          <span style={{"fontSize": 50, "color": "rgba(0, 0, 0, 0.45)"}}>{this.props.rowIndex}</span>
        </Col>
        <Col span={24 - 4}>
          <div style={{borderBottom: "1px solid #ccc", "padding": 30}}>
                        <TextArea style={{fontSize:16}} rows={rowCount} value={this.props.content} onChange={
                          (e) => {
                            let newContent = e.target.value;
                            this.props.contentChange(newContent);
                          }
                        }/>
          </div>
        </Col>
        <Col span={3}>
          <div style={{textAlign: "center"}}>
            <a className="optItem"
               onClick={
                 () => {
                   console.log("in insertItem");
                   this.props.insertItem();
                 }
               }
            >插入一项</a>
            <br />
            <a className="optItem"
               onClick={
                 () => {
                   this.props.addItem();
                 }
               }
            >添加一项</a>
            <br />
            <a className="optItem"
               onClick={
                 () => {
                   this.props.deleteItem();
                 }
               }
            >删除该项</a>
          </div>
        </Col>
      </Row>
    )
  }
}