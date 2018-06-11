> 使用 基于react+mobx+and 创建空项目(只有很少的流程测试代码),因为看到的脚手架包含的内容实在是太多,想找一个单纯的空项目,实在是不容易

> 使用:

1. 拷贝zip到本地

2. 修改项目名为自己的项目名

3. cd 到项目根目录 执行 npm i -d 安装依赖

4. 执行 npm run start

5. 默认未3000端口 打开提示网址,可以看到一段文字和一个antd的按钮,点击按钮将会更换显示内容

6. 如果想打包项目 使用 npm run build ,在build模式下 默认已关闭了日志显示,如想打开到 config/webpack.config.prod.js 文件中 搜索drop_debugger 将 drop_debugger修改为 false  drop_console 修改为false
7. 如果发现build/index.html 引用 css 或 js 路径不正确可以在 package.json中查找homePage属性,修改为想要的属性,默认配置为'./'



> 项目代码基本结构:
```
-- build 生成好的代码

-- config webpack相关配置

-- images 图片资源

-- public 共享资源,build时会使用到

-- script 执行脚本

-- src 项目文件

---- store 存储

------ commUtils 通用工具

-------- environmentConfig.js 环境配置文件

------ mobx mobx的Model文件

-------- TestModel.js 测试使用的Mobx的Model文件

---- ui 页面

---- index.js 入口文件

---- router.js 路由文件

```
> todoList:
1. 升级webpack版本
2. 升级react版本