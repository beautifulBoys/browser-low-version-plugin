# browser-low-version-plugin

## 说明

本插件用于低版本浏览器的升级提示，低版本浏览器不支持一些高级的属性方法或CSS属性（如：Object.defineProperty，transform 等），从而导致浏览器报错，所以我们需要提示用户升级浏览器来使用我们提供的服务。

升级提示分为两种级别，一为强制升级，页面级提示，不升级浏览器无法使用。二为建议升级，弹窗级提示，可关闭后继续使用。

## 配置使用

webpack.base.conf.js
```js
const BrowserWebpackPlugin = require('./browser-low-version-plugin/index.js')

module.exports = {
  ...
  plugins: [
    new HtmlWebpackPlugin({
      ...
    }),
    new BrowserWebpackPlugin({
      debug: false,
      warn: {
        ...
      }
    })
  ]
  ...
}
```
插件依赖 html-webpack-plugin，所以，请将 html-webpack-plugin 的配置置于前面。

## 参数说明

### debug

* 类型：`Boolean`
* 默认值：`false`，非必需
* 描述：项目配置的时候，开启 debug 会在命令行及浏览器中输出必要的参数，方便调试。

### warn

* 类型：`Object`
* 默认值：如下，非必需
* 描述：弹窗级升级提示浏览器最低版本配置，可覆盖默认配置。

| 浏览器名称 | 最低版本号 |
| - | - |
| Chrome | 35 |
| IE | 10 |
| Safari | 8 |
| Firefox | 15 |
| 360SE | 7 |
| 360EE | 7 |
| QQ | 7 |
| 2345Explorer | 4 |
| Sogou | 4 |
| Opera | 22 |
| Baidu | 4 |
| Edge | 12 |

### error

* 类型：`Object`
* 默认值：如下，非必需
* 描述：页面级升级提示浏览器最低版本配置，可覆盖默认配置。

| 浏览器名称 | 最低版本号 |
| - | - |
| IE | 8 |

## 其他说明

弹窗关闭时，会在浏览器 Cookie 中存入标识。网站切换页面时，会先去查询该标识，能查到则不会弹出，查不到则会弹出。

Cookie 存储代码如下：
```js
function setCookie (name, value) {
  document.cookie = name + '=' + value;
}

setCookie('browser-plugin-cookie', 1);
```
