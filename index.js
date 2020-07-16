'use strict';
const fs = require('fs')
const path = require('path')

var versionString = fs.readFileSync(
  path.resolve(__dirname, './version.js'), 'utf8'
)
var errorHTML = fs.readFileSync(
  path.resolve(__dirname, './error.html'), 'utf8'
)
var warnHTML = fs.readFileSync(
  path.resolve(__dirname, './warn.html'), 'utf8'
)
var browser_library = fs.readFileSync(
  path.resolve(__dirname, './browser.js'), 'utf8'
)

// 插件名称
const PLUGIN_NAME = 'browser-low-version-plugin'
// 版本检测 script 的 ID
var SCRIPTS_ID_SIGN = 'browser-plugin-script'
// 低版本提示1的 ID
var DOM_ID = 'browser-plugin'
// 低版本提示弹窗记录COOKIE NAme
var BROWSER_COOKIE = 'browser-plugin-cookie'
// 低版本警告型（可运行）提示判断配置
const WARN_OPTION = {
  Chrome: '35',
  IE: '10',
  Safari: '8',
  Firefox: '15',
  '360SE': '7',
  '360EE': '7',
  QQ: '7',
  '2345Explorer': '4',
  Sogou: '4',
  Opera: '22',
  Baidu: '4',
  Edge: '12'
}
// 低版本报错型（不可运行）提示判断配置
const ERROR_OPTION = {
  Chrome: '35',
  IE: '8',
  Safari: '8',
  Firefox: '15',
  '360SE': '7',
  '360EE': '7',
  QQ: '7',
  '2345Explorer': '4',
  Sogou: '4',
  Opera: '22',
  Baidu: '4',
  Edge: '12'
}
class BrowserVersionPlugin {
  constructor(options) {
    let { warn, error, debug } = options || {}
    this.options = {
      warn: warn ? {...WARN_OPTION, ...warn} : WARN_OPTION,
      error: error ? {...ERROR_OPTION, ...error} : ERROR_OPTION
    }
    this.debug = debug ? true : false
  }

  apply(compiler) {
    // webpack 4
    if (compiler.hooks) {
      compiler.hooks['compilation'].tap(PLUGIN_NAME, this.hooksHandler.bind(this))
    } else {
      compiler.plugin('compilation', this.pluginHandler.bind(this))
    }
  }

  hooksHandler(compilation) {
    if (!compilation.hooks.htmlWebpackPluginAfterHtmlProcessing) {
      const message = `您好，本插件依赖 “html-webpack-plugin”，请先确认“html-webpack-plugin”是否已安装，并将其置于 ${PLUGIN_NAME} 前面。`
      log.error(message)
      throw new Error(message)
    }
    compilation.hooks.htmlWebpackPluginAfterHtmlProcessing.tapAsync(
      PLUGIN_NAME,
      (htmlPluginData, cb) => this.afterHtmlProcessingFn(htmlPluginData, cb, compilation)
    )
  }

  pluginHandler(compilation) {
    compilation.plugin(
      'html-webpack-plugin-before-html-processing',
      (htmlPluginData, cb) => {
        this.afterHtmlProcessingFn(htmlPluginData, cb, compilation)
      }
    )
  }

  createCheckVersion (scripts) {
    versionString = versionString
    .replace('BROWSER_LIBRARY_JS', browser_library)
    .replace('WARN_HTML', JSON.stringify(warnHTML))
    .replace('OPTIONS_SIGN', JSON.stringify(this.options))
    .replace('SCRIPTS_SIGN', JSON.stringify(scripts))
    .replace('SCRIPTS_ID_SIGN', JSON.stringify(SCRIPTS_ID_SIGN))
    .replace('DOM_ID', JSON.stringify(DOM_ID))
    .replace('BROWSER_COOKIE', JSON.stringify(BROWSER_COOKIE))
    .replace('DEBUG_SIGN', this.debug)
    return `<script type="text/javascript" id="${SCRIPTS_ID_SIGN}">${versionString}</script>`
  }

  afterHtmlProcessingFn(htmlPluginData, cb, compilation) {
    versionString = this.createCheckVersion(htmlPluginData.assets.js)
    errorHTML = errorHTML.replace('IE_LOWER_VERSION_TAG', this.options.error.IE)
    htmlPluginData.html = htmlPluginData.html
                          .replace(/<body([^<>]*)>/, '<body$1>BROWSER_VERSION_MOUNT_ERROR_TAGBROWSER_VERSION_MOUNT_JS_TAG')
                          .replace('BROWSER_VERSION_MOUNT_ERROR_TAG', '\n' + errorHTML)
                          .replace('BROWSER_VERSION_MOUNT_JS_TAG', versionString + '\n')
    if (this.debug) {
      console.log('-----------browser-webpack-plugin-----------')
      console.log('this.options.warn: ', this.options.warn)
      console.log('html: ', htmlPluginData.html)
      console.log('-----------browser-webpack-plugin-----------')
    }
    cb(null, htmlPluginData)
  }
}

module.exports = BrowserVersionPlugin