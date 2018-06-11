import React from 'react';
import { Form, Menu, Icon, Input, Button, Checkbox, Modal, Card, List, Avatar } from 'antd';
import Model from '../store/MenuModel';
import '../../index.css'
import { observer } from 'mobx-react';
@observer
export default class ContentList extends React.Component {
  constructor() {
    super();
    // Model.getLastProcessList();
  }

  render() {
    console.log("in Content list render");
    return (
      <List
        itemLayout="horizontal"
        loading={Model.status.contentListIsLoadding}
        locale={{ emptyText: '暂无流程' }}
        style={{}}
        dataSource={Model.data.currentProcessList}
        renderItem={item => (
          <List.Item
            onClick={() => {
              item.setCurrentContentToFlowContentDetail();
            }}
            className={"contentListItem listItem_" + item.data.flowProcessId}>
            <List.Item.Meta
              title={<a>{item.data.title}</a>}
              description={
                <div>
                  <p>来自:{item.data.folderName}</p>
                  <p>编辑时间:{item.data.ceateTimeByShow}</p>
                </div>
              }
            />
          </List.Item>
        )}
      />
    )
  }
}