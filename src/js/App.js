import React, {Component} from 'react';
// CSS
import '../css/reset.css';
import 'normalize.css';
import '../css/App.css';
// Component
import TodoInput from './TodoInput';
import TodoItem from './TodoItem';
import UserDialog from './UserDialog';
import AV, {getCurrentUser, signOut, TodoModel} from "./leanCloud";

// Component App
class App extends Component {
    constructor(props) {
        super(props);
        // 存储数据与状态，载入localStorage
        this.state = {
            user: getCurrentUser() || {},
            newTodo: '',
            todoList: []
        };
        // 刷新判断登录状态 ==> 获取数据
        this.getUserInfo();
    }

    render() {
        console.log("App render");

        // todos 存储 TodoItem
        let todos = this.state.todoList
        // 过滤出还存在的Todo
            .filter((item) => !item.deleted)
            // 遍历每一个还在的Todo
            .map((item, index) => {
                return (
                    // 返回TodoItem存进todos
                    <li key={index}>
                        <TodoItem todo={item}
                                  onToggle={this.toggle.bind(this)}
                                  onDelete={this.delete.bind(this)}/>
                    </li>
                )
            })
        // 返回最终要渲染到页面的内容
        return (
            <div className="App">
                <h1>
                    {this.state.user.username || "我"}的待办清单
                    {this.state.user.id ?
                        <button id="signOut" onClick={this.signOut.bind(this)}>登出</button> :
                        null}
                </h1>
                <div className="inputWrapper">
                    {/*
                     ** content 存储输入的 newTodo
                     ** onSubmit 存储自定义函数 addTodo
                     ** onChange 存储自定义函数 changeTitle
                     **/}
                    <TodoInput content={this.state.newTodo}
                               onSubmit={this.addTodo.bind(this)}
                               onChange={this.changeTitle.bind(this)}/>
                </div>
                {/* 用一个有序列表存储 Todos */}
                <ol className='todoList'>
                    {todos}
                </ol>
                {this.state.user.id ?
                    null :
                    <UserDialog onSignUp={this.onSignUpOrSignIn.bind(this)}
                                onSignIn={this.onSignUpOrSignIn.bind(this)}/>}
            </div>
        );
    }

    //getUserInfo 查询
    getUserInfo() {
        let user = getCurrentUser();
        if (user) {
            TodoModel.getByUser(user, (todos) => {
                let stateCopy = JSON.parse(JSON.stringify(this.state));
                stateCopy.todoList = todos;
                this.setState(stateCopy)
            })
        }
    }

    // 登录/注册
    onSignUpOrSignIn(user) {
        let stateCopy = JSON.parse(JSON.stringify(this.state));
        stateCopy.user = user;
        this.setState(stateCopy);
        // 进来后第一时间获取数据
        this.getUserInfo();
    }

    // 登出功能 ===> 清除数据
    signOut() {
        let confirmSignOut = window.confirm("确认登出？")
        if (confirmSignOut) {
            signOut();
            let stateCopy = JSON.parse(JSON.stringify(this.state));
            stateCopy.user = {};
            stateCopy.todoList = [];
            this.setState(stateCopy);
        }
    }

    // componentDidUpdate 在组件更新之后调用
    componentDidUpdate() {
    }

    // 删除一个 TodoItem
    delete(event, todo) {
        TodoModel.destroy(todo.id, () => {
            todo.deleted = true;
            this.setState(this.state);
        })
    }

    // 切换 TodoItem 状态 ==> 更新leanCloud
    toggle(e, todo) {
        let oldStatus = todo.status;
        todo.status = todo.status === 'completed' ? '' : 'completed';
        this.setState(this.state);
        TodoModel.update(todo, () => {
                this.setState(this.state)
            }, (error) => {
                todo.status = oldStatus;
                this.setState(this.state);
                alert("服务器未同步！")
            }
        )
    }

    // 让TotoInput从只读变为可写
    changeTitle(event) {
        this.setState({
            newTodo: event.target.value,
            todoList: this.state.todoList
        })
    }

    // 在TodoList里添加一个Todo
    addTodo(event) {
        let newTodo = {
            status: "",
            title: event.target.value,
            deleted: false
        };
        TodoModel.create(newTodo, (id) => {
            // leanCloud.js ==> successFn(response.id)
            newTodo.id = id;
            this.state.todoList.push(newTodo);
            this.setState({
                newTodo: "",
                todoList: this.state.todoList
            })
        }, (error) => {
            // leanCloud.js ==> errorFn(error)
            console.log(error)
        });
        // console.log(this.state.todoList)
    }
}

// 模块出口
export default App;

