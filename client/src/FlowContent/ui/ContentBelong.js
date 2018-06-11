import React from 'react';
import { Form, Menu, Card, Icon, Input, Button, Checkbox, Modal, Row, Col, Tag, Tooltip, Switch, message, BackTop } from 'antd';
import EditFolderModel from '../../Folder/store/EditFolderModel'
import EditTagModel from '../../Tag/store/EditTagModel';
import '../../index.css'
import PropTypes from 'prop-types';
const { Meta } = Card
import { observer } from 'mobx-react';
import commHelper from '../../CommonUtils/commHelper';
import GSModel from '../../CommonStore/GSModel';
import { CopyToClipboard } from 'react-copy-to-clipboard';

@observer
export default class ContentBelong extends React.Component {

  constructor() {
    super();
    this.state = {
      canEditShareStatus: true
    }
  }

  static defaultProps = {
    flowProcessId: "",//内容的ID
    folderId: "",
    folderName: "",//文件夹的名称
    tags: [],
    tagNames: [],//标签组
    isShared: 0,//当前是否是分享的
    ceateTimeByShow: "",//创建时间
    changeShareStatus: function () {
    },//当修改分享状态的回调函数
    currentContentIsShared: false,
  }
  static propTypes = {
    flowProcessId: PropTypes.string.isRequired,
    folderId: PropTypes.string.isRequired,
    folderName: PropTypes.string.isRequired,
    tags: PropTypes.object.isRequired,
    tagNames: PropTypes.object.isRequired,
    isShared: PropTypes.number.isRequired,
    ceateTimeByShow: PropTypes.string.isRequired,
    changeShareStatus: PropTypes.func.isRequired,
    currentContentIsShared: PropTypes.bool.isRequired,
  }

  showChangeFolderModel() {
    EditFolderModel.changeCurrentStatusIsEditFolder({
      selectFolder: {
        "folderId": this.props.folderId,
        "folderName": this.props.folderName,
      }
    });
  }

  showChangeTagModel() {
    EditTagModel.changeCurrentStatusIsEditTag({
      selectedTags: this.props.tags
    });
  }

  async changeShareStatus(isShared) {
    this.setState({
      "canEditShareStatus": false
    })
    let changeStatus = await this.props.changeShareStatus(isShared);
    this.setState({
      "canEditShareStatus": true
    })
  }

  componentDidMount() {
    if (this.props.currentContentIsShared) {
      this.setState(() => {
        canEditShareStatus: false
      })
    }
  }

  render() {
    let tagsHTML = this.props.tagNames.map(function (item, index) {
      return (<Tag key={`tag_index_${index}`} color="#1890ff">{item}</Tag>)
    });
    console.log("this.props.tagNames[0]===>", this.props.tagNames[0]);
    let currentIsShare = this.props.isShared == 1 ? true : false
    return (
      <div className="contentBelongCon">
        <table style={{ "lineHeight": "50px" }}>
          <tbody>
            <tr>
              <td className="BelongConPropName">
                <Icon type="folder" />所属文件夹:
            </td>
              <td className="BelongConContent">
                <a >{this.props.folderName}</a>
              </td>
              <td>
                {
                  this.props.currentContentIsShared
                    ? null
                    : null
                }

              </td>
            </tr>
            <tr>
              <td className="BelongConPropName">
                <Icon type="tags-o" />标签:
            </td>
              <td className="BelongConContent">
                {
                  (this.props.tagNames.length == 1 && this.props.tagNames[0] == null)
                    ? ""
                    : tagsHTML
                }
              </td>
              <td>
                {
                  this.props.currentContentIsShared
                    ? null
                    : null
                }

              </td>
            </tr>
            <tr>
              <td className="BelongConPropName">
                <Icon type="share-alt" />分享状态:
            </td>
              <td className="BelongConContent">
                <Switch checkedChildren="开"
                  unCheckedChildren="关"
                  checked={currentIsShare}
                  onChange={(isChecked) => {
                    this.changeShareStatus(isChecked)
                  }}
                  disabled={this.state.canEditShareStatus ? false : true}
                />
              </td>
              <td>
                {
                  currentIsShare
                    ?
                    <CopyToClipboard
                      text={commHelper.getShareLink(GSModel.baseInfoSetting.routerPathPrex, this.props.flowProcessId)}
                      onCopy={() => {
                        message.success("复制完成");
                      }}
                    >
                      <Button type="primary" shape="circle" icon="copy" />
                    </CopyToClipboard>
                    : null
                }
              </td>
            </tr>
            <tr>
              <td className="BelongConPropName">
                <Icon type="calendar" />编辑时间:
            </td>
              <td className="BelongConContent">
                {this.props.ceateTimeByShow}
              </td>
              <td>
              </td>
            </tr>
          </tbody>
        </table>
        <BackTop />
      </div>
    );
  }
}