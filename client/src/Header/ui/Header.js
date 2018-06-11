import React from 'react';
import { Form, Menu, Avatar, Icon, Input, Button, Checkbox, Modal, Affix, Row, Col, Popover } from 'antd';
const Search = Input.Search;
import '../../index.css'
import { observer } from 'mobx-react';
import Model from '../../Header/store/HeaderModel';
import UserModel from '../../CommonStore/UserModel'
@observer
export default class Headers extends React.Component {
    render() {
        return (
            <div className="headerCon">
                <Row>
                    <Col span={4}>
                        <a id="logo" onClick={() => {
                            window.location.reload();
                        }}>
                            <img src="./images/logo_4.png" style={{ height: "auto" }} />
                        </a>
                    </Col>
                    <Col span={24 - 9}>
                        <div id="search-box">
                            <span className="algolia-autocomplete">
                                <Search
                                    placeholder="请输入流程标题/内容关键字进行搜索"
                                    onSearch={(value) => {
                                        Model.searchContent(value);
                                    }}
                                    enterButton
                                />
                            </span>
                        </div>
                    </Col>
                    <Col span={3} style={{ "textAlign": "center" }}>
                        <Button
                            icon="plus"
                            type="primary"
                            onClick={() => {
                                Model.clickNewContentBtn();
                            }}
                        >
                            添加新流程
                        </Button>
                    </Col>
                    <Col span={2} style={{ "textAlign": "center", "cursor": "pointer" }}>
                        <Popover placement="bottom" content={
                            <div>
                                <a onClick={() => {
                                    Model.loginOut();
                                }}>
                                    登出账号
                                </a>
                            </div>
                        }
                            title="我的账号"
                            trigger="click">
                            <Avatar style={{ backgroundColor: "#1890ff", verticalAlign: 'middle' }}>
                                {UserModel.data.nickName.charAt(0).toUpperCase()}
                            </Avatar>
                        </Popover>
                    </Col>
                </Row>
            </div>
        )
    }
}