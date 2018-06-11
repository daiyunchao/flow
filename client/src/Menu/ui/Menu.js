import React from 'react';
import { Form, Menu, Icon, Input, Button, Checkbox, Modal } from 'antd';
import Model from '../store/MenuModel';
import FolderModel from '../../Folder/store/EditFolderModel';
import EditTagModel from '../../Tag/store/EditTagModel';
import '../../index.css'
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
import { observer } from 'mobx-react';
import EditTag from '../../Tag/ui/EditTag';

@observer
export default class MyMenu extends React.Component {
  constructor() {
    super();
    Model.addUserLoginEvent();
  }

  clickMenu({ item, key, keypath }) {
    if (key == "last_file") {
      Model.getLastProcessList()
    } else if (key.indexOf("folder_") == 0) {
      let folderId = key.replace("folder_", "")
      Model.getContentListByThisFolder({ folderId: folderId })
    }
    else if (key == "addFolder") {
      //如果是添加文件夹:
      FolderModel.changeCurrentStatusIsCreateFolder();
    }
    else if (key == "addTag") {
      EditTagModel.changeCurrentStatusIsCreateTag();
    }
    else if (key == "share_file") {
      Model.getContentListByShare();
    }
    else if (key.indexOf("tag_") == 0) {
      let tagId = key.replace("tag_", "")
      Model.getContentListByThisTag({ tagId: tagId })
    }
  }

  render() {
    let folderListHtml = Model.data.folderList.map(function (item, index) {
      return (
        <Menu.Item key={"folder_" + item["folderId"]}>
          {item["folderName"]}
        </Menu.Item>);
    })

    let tagListHtml = Model.data.tagList.map(function (item, index) {
      return (<Menu.Item
        key={"tag_" + item["tagId"]}>
        {item["tagName"]}
      </Menu.Item>)
    })
    return (
      <Menu
        onClick={({ item, key, keypath }) => {
          this.clickMenu({ item, key, keypath });
        }}
        style={{}}
        defaultSelectedKeys={[Model.status.default_selected_menu]}
        defaultOpenKeys={[Model.status.default_open_key]}
        mode="inline"
      >
        <Menu.Item
          key="last_file"
          style={{ "marginTop": 0 }}
        >
          <Icon type="profile" />最新文档
        </Menu.Item>
        <SubMenu key="sub1"
          title={
            <span><Icon type="folder" />
              <span>我的文件夹</span>
            </span>
          }>
          <Menu.Item key="addFolder">
            <Icon type="plus" />添加文件夹
          </Menu.Item>
          {folderListHtml}
        </SubMenu>
        <SubMenu key="sub2" title={<span><Icon type="tag-o" /><span>我的标签</span></span>}>
          <Menu.Item key="addTag">
            <Icon type="plus" />添加标签
          </Menu.Item>
          {tagListHtml}
        </SubMenu>
        <Menu.Item key="share_file"><Icon type="share-alt" />我的分享</Menu.Item>
      </Menu>
    )
  }
}