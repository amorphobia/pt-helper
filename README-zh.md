# PT 助手

[English readme](./README.md)

PT 站的小助手。

## 用法

1. 安装一个运行用户脚本的浏览器插件
2. 从 [greasyfork](https://greasyfork.org/zh-CN/scripts/460549-pt-helper) 或 [github](https://github.com/amorphobia/pt-helper/raw/main/userscript/index.user.js) 安装 PT 助手

## 亮点特性

### 自动折叠横幅

![auto fold banner](https://s2.loli.net/2023/02/14/x7NEu96le5Bq4IV.gif)

### 种子直链

![tjupt-dl.gif](https://s2.loli.net/2023/02/17/JUtxICqRfHMN73y.gif)

### 自动说谢谢

![thanks.gif](https://s2.loli.net/2023/02/20/xRS1aX9eQfwuOtA.gif)

## 开发

1. 使用命令 `npm install` 或 `npm ci` 安装依赖
2. 在文件 [`package.json`](./package.json) 中编辑 `userscript` 对象里的设置，可以参考 [`plugins/userscript.plugin.ts`](./plugins/userscript.plugin.ts) 中的注释
3. 在 `src` 目录中开始编辑（例如 [`src/index.ts`](./src/index.ts)）
4. 使用 `npm run build` 生成用户脚本
5. 在 Tampermonkey 中导入生成的脚本

## 许可

[模板](https://github.com/pboymt/userscript-typescript-template) 中的代码采用 [MIT](./template-LICENSE) 许可

PT 助手的代码采用 [AGPL-3.0](./LICENSE)-or-later 许可
