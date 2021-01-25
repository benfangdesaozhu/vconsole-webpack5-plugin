# vconsole-webpack5-plugin
webpack plugin for [vConsole](https://github.com/WechatFE/vConsole)

帮助开发者在移动端进行调试，本插件是在 [vConsole](https://github.com/WechatFE/vConsole) 的基础上封装的 `webpack` 插件，通过 `webpack` 配置即可自动添加 `vConsole` 调试功能，方便实用。(改插件仅作为个人练习使用)

## 安装

```bash
npm install vconsole-webpack5-plugin -D
```

## 使用

`webpack.conf.js` 文件配置里增加以下插件配置即可

```js
// 引入插件
var vConsolePlugin = require('vconsole-webpack5-plugin'); 

module.exports = {
    ...

    plugins: [
        new vConsolePlugin({
            enable: true // 发布代码前记得改回 false
        }),
        ...
    ]
    ...
}
```
