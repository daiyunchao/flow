import React from 'react';
import {
  Form,
  Menu,
  Card,
  Select,
  Dropdown,
  Icon,
  Input,
  Button,
  Checkbox,
  Modal,
  Row,
  Col,
  Tag,
  Tooltip,
  Switch
} from 'antd';
import '../../index.css'
const { Meta } = Card
const Option = Select.Option;
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import FolderModel from '../../Folder/store/EditFolderModel';
// import TagsModel from '../../Tag/store/ContentTagModel';
import TagsModel from '../../Tag/store/EditTagModel';
@observer
export default class CreateContentBelong extends React.Component {

  static defaultProps = {
    folderId: "",
    folderName: "",//文件夹的名称
    tags: [],
    tagNames: [],//标签组
    isShared: 1,//当前是否是分享的
    ceateTimeByShow: ""//创建时间
  }
  static propTypes = {
    folderId: PropTypes.string.isRequired,
    folderName: PropTypes.string.isRequired,
    tags: PropTypes.object.isRequired,
    tagNames: PropTypes.object.isRequired,
    isShared: PropTypes.number.isRequired,
    ceateTimeByShow: PropTypes.string.isRequired,
  }

  constructor() {
    super();
    //设置内容:
  }

  componentDidMount() {
    FolderModel.userSelectedFolder({
      "folderId": this.props.folderId,
      "folderName": this.props.folderName
    });
    TagsModel.data.selectedTags = this.props.tags

    //查询文件夹列表
    FolderModel.getFolderListUseCache();
    TagsModel.getTagListUseCache();
  }

  changeShareStatus(isOpen) {
    this.props.changeShareStatus(isOpen)
  }


  render() {

    //构建菜单项:
    let folderItemList = FolderModel.data.folderList.map(function (item) {
      return (<Menu.Item key={item.folderId} selectable>{item.folderName}</Menu.Item>);
    })
    const canSelectFolder = (
      <Menu onClick={(e) => {
        FolderModel.changeFolder(e);
      }}>
        {folderItemList}
      </Menu>
    );
    let FolderModelData = FolderModel.data;
    let selectedFolderName = FolderModelData.selectedFolder.folderName;
    if (!selectedFolderName && FolderModelData.folderList.length > 0) {
      //如果未选中文件夹,并且有待选列表时,选中默认的第一个
      let folderList = FolderModelData.folderList;
      FolderModel.userSelectedFolder({
        "folderId": folderList[0]["folderId"],
        "folderName": folderList[0]["folderName"]
      });
      //
      // selectedFolderName = folderList[0]["folderName"];
    }
    if (!selectedFolderName) {
      //如果还是空,则说明未选中任何文件夹并且文件夹列表为空
      selectedFolderName = "未选中任何文件夹"
    }

    let selectedTag = TagsModel.data.selectedTags.map(function (item) {
      return item.tagName;
    });
    let canSelectTags = TagsModel.data.tagsList.map(function (item) {
      return (<Option key={item.tagId} value={item.tagName}>{item.tagName}</Option>)
    });
    return (
      <div className="contentBelongCon">
        <table style={{ "lineHeight": "50px" }}>
          <tbody>
            <tr>
              <td className="BelongConPropName">
                <Icon type="folder" />所属文件夹:
            </td>
              <td className="BelongConContent">
                <Dropdown.Button overlay={canSelectFolder}>
                  {selectedFolderName}
                </Dropdown.Button>
              </td>
              <td>
                <Tooltip title="添加文件夹">
                  <a onClick={() => {
                    FolderModel.changeCurrentStatusIsCreateFolder();
                  }} className="optItem">
                    <Icon type="plus" />
                  </a>
                </Tooltip>
              </td>
            </tr>
            <tr>
              <td className="BelongConPropName">
                <Icon type="tags-o" />标签:
            </td>
              <td className="BelongConContent">
                <Select
                  mode="tags"
                  placeholder="Please select"
                  value={selectedTag}
                  onChange={(e) => {
                    TagsModel.userChangeTags(e);
                  }}
                  style={{ width: '90%' }}
                >
                  {canSelectTags}
                </Select>
              </td>
              <td>
                <Tooltip title="添加标签">
                  <a onClick={() => {
                    TagsModel.changeCurrentStatusIsCreateTag();
                  }} className="optItem">
                    <Icon type="plus" />
                  </a>
                </Tooltip>
              </td>
            </tr>
            <tr>
              <td className="BelongConPropName">
                <Icon type="share-alt" />开启分享:
            </td>
              <td className="BelongConContent">
                <Switch checkedChildren="开" onChange={(isOpen) => {
                  this.changeShareStatus(isOpen)
                }} unCheckedChildren="关" defaultChecked />
              </td>
              <td>

              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}