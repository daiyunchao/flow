import React from 'react';
import '../../index.css'
//该page的Model
import Model from '../../CommonStore/UserModel'
import CommonModal from '../../CommonModal/store/CommonModal';
import { observer } from 'mobx-react';
import { Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const AutoCompleteOption = AutoComplete.Option;

const residences = [{
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [{
        value: 'hangzhou',
        label: 'Hangzhou',
        children: [{
            value: 'xihu',
            label: 'West Lake',
        }],
    }],
}, {
    value: 'jiangsu',
    label: 'Jiangsu',
    children: [{
        value: 'nanjing',
        label: 'Nanjing',
        children: [{
            value: 'zhonghuamen',
            label: 'Zhong Hua Men',
        }],
    }],
}];

@observer
class RegistrationForm extends React.Component {
    state = {
        confirmDirty: false,
        autoCompleteResult: [],
    };
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                // console.log('Received values of form: ', values);
                Model.userRegister(
                    {
                        email: values.email,
                        nickname: values.nickname,
                        pwd: values.password,
                    }
                )
            }
        });
    }
    handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    }
    compareToFirstPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('password')) {
            callback('两次输入密码不相同!');
        } else {
            callback();
        }
    }
    validateToNextPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], { force: true });
        }
        callback();
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { autoCompleteResult } = this.state;

        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 18 },
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 16,
                    offset: 6,
                },
            },
        };
        let center={
            "left":window.innerWidth/2-500,
            "background": "url(./images/bg-white-lock.png) repeat",
        }
        return (
            <div style={{ "height": window.innerHeight, "backgroundColor": "rgba(220, 220, 220, 0.216)", "opacity": "0.99" }}>
                <div className="registerCon">
                    <div className="loginItemConHead">
                        <img src="./images/logo_s_m.png" style={{ "height": 21 }} />
                        <span style={{ "color": "rgba(0, 0, 0, 0.55)", "fontSize": 20 }}>注册流程小助手</span>
                    </div>
                    <Form onSubmit={this.handleSubmit}>
                        <FormItem
                            {...formItemLayout}
                            label="登录邮箱"
                        >
                            {getFieldDecorator('email', {
                                rules: [{
                                    type: 'email', message: '请输入有效的邮箱地址!',
                                }, {
                                    required: true, message: '请输入邮箱地址!',
                                }],
                            })(
                                <Input />
                                )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="登录密码"
                        >
                            {getFieldDecorator('password', {
                                rules:
                                    [
                                        {
                                            required: true, message: '请输入登录密码!',
                                        },
                                        {
                                            min: 6, message: '密码长度不能小于6位'
                                        },
                                        {
                                            validator: this.validateToNextPassword,
                                        }
                                    ],
                            })(
                                <Input type="password" />
                                )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="再次输入登录密码"
                        >
                            {getFieldDecorator('confirm', {
                                rules: [
                                    {
                                        required: true, message: '请再次输入登录密码!',
                                    },
                                    {
                                        min: 6, message: '密码长度不能小于6位'
                                    },
                                    {
                                        validator: this.compareToFirstPassword,
                                    }
                                ],
                            })(
                                <Input type="password" onBlur={this.handleConfirmBlur} />
                                )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label={(
                                <span>
                                    昵称&nbsp;
              <Tooltip title="让我们知道如何称呼您?">
                                        <Icon type="question-circle-o" />
                                    </Tooltip>
                                </span>
                            )}
                        >
                            {getFieldDecorator('nickname', {
                                rules: [{ required: true, message: '请输入您的昵称!', whitespace: true }],
                            })(
                                <Input />
                                )}
                        </FormItem>
                        <FormItem {...tailFormItemLayout}>
                            {
                                Model.status.isLoginIng
                                    ? <Button type="primary" htmlType="submit" loading>注册</Button>
                                    : <Button type="primary" htmlType="submit" >注册</Button>
                            }
                            <a style={{ float: "right" }} onClick={
                                () => {
                                    Model.gotoLogin()
                                }
                            } >我已经有账号了,点击登录</a>
                        </FormItem>
                    </Form>
                </div>
            </div>
        );
    }
}

const WrappedRegistrationForm = Form.create()(RegistrationForm);
export default WrappedRegistrationForm;