# flow
> 流程管理在线小助手
该工具只做了做一件事情,流程记录
无论是工作中还是生活中,做很多事情都是有1,2,3这样的流程,但如果想在流程中添加一项将会修改后续全部的序号

如: 

1.打开电脑

2.登录dota2

3.选择服务器,点击开始比赛按钮

4.选英雄

但如果我想在第二步的时候插入一个 登录steam平台,就会涉及到修改2-4的后续序列

该工具就是解决这个问题





### 技术栈:
前端使用React+WebPack
后端使用 NodeJs的Loopback + MongoDB

### 包含的功能:
1. 注册
![avatar](https://github.com/daiyunchao/flow/blob/master/jietu/register.jpg?raw=true)

2. 登录
(本地将存储用户信息,用于免登录)
![avatar](https://github.com/daiyunchao/flow/blob/master/jietu/login.jpg?raw=true)

3. 编辑流程

添加流程时候 可以自由的 插入项/添加项/删除项/
![avatar](https://github.com/daiyunchao/flow/blob/master/jietu/add_flow.jpg?raw=true)

4. 流程列表&查询流程

完成编辑后的流程将会出现在列表的最上面
在每一项的右侧的提供有模拟完成功能,让完成项和未完成项区分开来,减少大脑的思考和记忆成本
如果流程多的话 可以使用头部的查询 流程名称和流程内容关键字进行查找
![avatar](https://github.com/daiyunchao/flow/blob/master/jietu/add_flow_comp.jpg?raw=true)

5. 文件夹&标签

为了更好的将流程进行分类,该工具有文件夹和标签功能,目的依然是更方便的存储和查找
![avatar](https://github.com/daiyunchao/flow/blob/master/jietu/add_floder.jpg?raw=true)
![avatar](https://github.com/daiyunchao/flow/blob/master/jietu/add_tag.jpg?raw=true)

6. 导出&分享

为了将我们写好的流程分享到其他小伙伴,小工具提供了导出功能,该功能将会把流程转换成普通的文本内容,进行复制
当然如果觉得普通的文本内容不能满足你,也可以选择网页形式的分享
![avatar](https://github.com/daiyunchao/flow/blob/master/jietu/share.jpg?raw=true)

### 有待完善:
1. 安全性
密码目前使用明文存储
访问API等未使用JWT

2. 功能性
收藏别人分享来的流程
共享组(在共享组的成员,可共享别人的流程)
删除文件夹/标签
修改文件夹/标签
UI美化


### 配置和使用
在跟目录使用 npm install 或是 yarn install 安装库
service文件夹中的datasources.json文件,这是对应的数据配置
service/run文件夹下有pm2的启动文件,修改对应的启动路径
切换到根目录的client文件夹,该文件夹就是客户端文件夹了
npm install 或 yarn install
安装客户端使用到的库
在client文件夹中执行 npm run build 打包文件夹 访问 http://127.0.0.1:3000/proccess/login.html(根据build好的提示文字进行访问)


### 如果安装或使用过程中有任何问题:
[Issues](https://github.com/daiyunchao/flow/issues)


