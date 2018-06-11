import React from 'react';
import { Form, Icon, Input, Button, Checkbox, Modal } from 'antd';
import GSModel from '../../CommonStore/GSModel'
import '../../index.css'

//该page的Model
import Model from '../../CommonStore/UserModel'

//通用Model,例如显示提示信息等
import CommonModal from '../../CommonModal/store/CommonModal';
import { observer } from 'mobx-react';
const FormItem = Form.Item;
@observer
export default class Login extends React.Component {

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
        });
    }

    showModal = () => {
        CommonModal.setModalInfo({
            isShow: true,
            title: "温馨提示",
            content: "暂不支持忘记密码功能"
        })
    }

    render() {
        let center = {
            "left": window.innerWidth / 2 - 200,
            "background": "url(./images/bg-white-lock.png) repeat",
        }
        return (
            <div style={{
                "height": GSModel.baseInfoSetting.minHeight,
                "backgroundColor": "rgba(220, 220, 220, 0.216)",
                "opacity": "0.99"
            }}>
                <div id="loginCon" className="loginCon" style={center}>
                    <div className="loginItemConHead">
                        <img src="./images/logo_s_m.png" style={{ "height": 21 }} />
                        <span style={{ "color": "rgba(0, 0, 0, 0.55)", "fontSize": 20 }}>登录流程小助手</span>

                    </div>
                    <div className="loginItemCon">
                        <Input
                            prefix={
                                <Icon type="mail"
                                    style={{ color: 'rgba(0,0,0,.25)' }}
                                />}
                            value={Model.data.email}
                            onChange={(e) => {
                                Model.userNameChange(e.target.value);
                            }}
                            placeholder="登录邮箱" />
                    </div>
                    <div className="loginItemCon">
                        <Input
                            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            type="password"
                            value={Model.data.pwd}
                            onChange={(e) => {
                                Model.pwdChange(e.target.value);
                            }}
                            placeholder="密码" />
                    </div>

                    <div className="loginItemCon">
                        {
                            Model.status.isLoginIng ?
                                <Button type="primary" onClick={() => {
                                    Model.userLogin();
                                }} className="login-form-button" loading>
                                    登 录
                        </Button>
                                :
                                <Button type="primary" onClick={() => {
                                    Model.userLogin();
                                }} className="login-form-button" >
                                    登 录
                        </Button>
                        }

                    </div>
                    <div style={{ textAlign: "center" }}>
                        <a onClick={
                            () => {
                                Model.gotoRegister()
                            }
                        } >我没有账号,点击注册</a>
                    </div>
                </div>
            </div>
        );
    }
}