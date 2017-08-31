import React, {Component} from "react";

// 注册组件
export default class SignUpForm extends Component {
    render() {
        return (
            <form className="signUp"
                  onSubmit={this.props.onSubmit.bind(this)}>
                <div className="row">
                    <label htmlFor="">邮箱</label>
                    <input type="email"
                           placeholder="email address"
                           value={this.props.formData.email}
                           onChange={this.props.onChange.bind(null, "email")}/>
                </div>
                <div className="row">
                    <label htmlFor="">用户名</label>
                    <input type="text"
                           placeholder="username"
                           value={this.props.formData.username}
                           onChange={this.props.onChange.bind(null, "username")}/>
                </div>
                <div className="row">
                    <label htmlFor="">密码</label>
                    <input type="password"
                           placeholder="password"
                           value={this.props.formData.password}
                           onChange={this.props.onChange.bind(null, "password")}/>
                </div>
                <div className="row action">
                    <button type="submit">注册</button>
                </div>
            </form>
        )
    }
}