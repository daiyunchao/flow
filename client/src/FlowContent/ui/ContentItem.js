import React from 'react';
import {Form, Avatar, Row, Col, Menu, Tooltip, Card, Icon, Input, Button, Checkbox, Modal, message} from 'antd';
import '../../index.css'
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import CommonHelper from '../../CommonUtils/commHelper';
import EventHandler from '../../CommonUtils/eventHandler';

import {CopyToClipboard} from 'react-copy-to-clipboard';
const {TextArea} = Input;
@observer
export default class ContentItem extends React.Component {

  constructor() {
    super();
    this.state = {
      currentIsChecked: false,
      isEditStatus: false,
      newContent: "",
      oldContent: ""
    }
  }

  static defaultProps = {
    rowIndex: 0,//行号
    content: "",//内容,
    isShared: false,

  }
  static propTypes = {
    rowIndex: PropTypes.number.isRequired,
    content: PropTypes.string.isRequired,
    isShared: PropTypes.bool.isRequired,
  }

  //修改检查状态
  changeCheckStatus = (isChecked) => {
    this.setState({
      "currentIsChecked": isChecked
    })
    return false;
  }

  //改变编辑状态
  changeEditStatus = (isEditStatus) => {
    let self = this;
    if (isEditStatus) {
      this.changeEditStatusIsTrue();
    }

  }

  changeEditStatusIsTrue() {
    this.setState({
      "newContent": this.props.content,
      "isEditStatus": true,
    })
  }

  saveCurrentContent = () => {
    EventHandler.dispatchEvent({
      "key": "changeCurrentContent",
      "args": [this.props.rowIndex, this.state.newContent]
    })
    this.setState({
      "isEditStatus": false,
    })
  }

  changeCurrentContent = (e) => {
    let value = e.target.value;
    this.setState({
      "newContent": value
    })
  }
  resetContent = () => {
    this.setState({
      "newContent": this.props.content,
      "isEditStatus": false,
    })
  }

  render() {
    let htmlContent = this.props.content.replace(/\n/g, '<br/>');
    let rowNumberBgColor = "rgba(0, 0, 0, 0.45)";
    let rowBottomBorderColor = "1px solid #ccc";
    let fontColor = "rgba(0, 0, 0, 0.65)";
    if (this.state.currentIsChecked) {
      let checkColor = "#108ee9";
      rowNumberBgColor = checkColor;
      rowBottomBorderColor = "1px solid " + checkColor;
      fontColor = "rgba(0, 0, 0, 0.65)";
    }

    //默认行数:
    let rowCount = 4;
    if (this.state.isEditStatus && this.state.newContent) {
      rowCount = this.state.newContent.split('\n').length;
      rowCount = rowCount < 4 ? 4 : rowCount
    }

    return (
      <Row style={{"marginBottom": 20, "display": "flex", "justifyContent": "center", "alignItems": "center"}}>
        <Col span={1}>
          <span style={{"fontSize": 50,"color":rowNumberBgColor}}>{this.props.rowIndex}</span>
        </Col>
        <Col span={24 - 4}>
          <div style={{borderBottom: rowBottomBorderColor, "padding": 30}}>
            {
              this.state.isEditStatus
                ?
                <TextArea style={{fontSize:16}} rows={rowCount} value={this.state.newContent} onChange={(e) => {
                  this.changeCurrentContent(e);
                }}/>
                :
                <span className="contentFont" style={{"color": fontColor}}
                      dangerouslySetInnerHTML={{__html: htmlContent}}>
                                </span>
            }

          </div>
        </Col>
        <Col span={3}>
          {
            this.props.isShared ?
              <div style={{textAlign: "center"}}>
                <CopyToClipboard
                  text={this.props.content}
                  onCopy={() => {
                    message.success("复制完成");
                  }}
                >
                  <Tooltip title="复制该项">
                    <a className="optItem">
                      <Icon type="copy"/>
                    </a>
                  </Tooltip>
                </CopyToClipboard>

                {
                  this.state.currentIsChecked
                    ?
                    <Tooltip title="撤销完成该项">
                      <a onClick={() => {
                        this.changeCheckStatus(false)
                      }} className="optItem">
                        <Icon type="close"/>
                      </a>
                    </Tooltip>
                    :
                    <Tooltip title="模拟完成该项">
                      <a onClick={() => {
                        this.changeCheckStatus(true)
                      }} className="optItem">
                        <Icon type="check"/>
                      </a>
                    </Tooltip>
                }

              </div>
              :
              this.state.isEditStatus
                ?
                <div style={{textAlign: "center"}}>
                  <Tooltip title="保存该项">
                    <a onClick={() => {
                      this.saveCurrentContent();
                    }} className="optItem">
                      <Icon type="save"/>
                    </a>
                  </Tooltip>
                  <Tooltip title="取消编辑">
                    <a onClick={() => {
                      this.resetContent();
                    }} className="optItem">
                      <Icon type="close"/>
                    </a>
                  </Tooltip>
                </div>
                :
                <div style={{textAlign: "center"}}>
                  <Tooltip title="编辑该项">
                    <a onClick={() => {
                      this.changeEditStatus(true);
                    }} className="optItem">
                      <Icon type="edit"/>
                    </a>
                  </Tooltip>

                  <CopyToClipboard
                    text={this.props.content}
                    onCopy={() => {
                      message.success("复制完成");
                    }}
                  >
                    <Tooltip title="复制该项">
                      <a className="optItem">
                        <Icon type="copy"/>
                      </a>
                    </Tooltip>
                  </CopyToClipboard>

                  {
                    this.state.currentIsChecked
                      ?
                      <Tooltip title="撤销完成该项">
                        <a onClick={() => {
                          this.changeCheckStatus(false)
                        }} className="optItem">
                          <Icon type="close"/>
                        </a>
                      </Tooltip>
                      :
                      <Tooltip title="模拟完成该项">
                        <a onClick={() => {
                          this.changeCheckStatus(true)
                        }} className="optItem">
                          <Icon type="check"/>
                        </a>
                      </Tooltip>
                  }


                </div>
          }

        </Col>
      </Row>
    )
  }
}