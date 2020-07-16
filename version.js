(function () {
  BROWSER_LIBRARY_JS
  function getCookie (name) {
    var attrs = document.cookie.split('; ');
    var map = {};
    for (var i = 0; i < attrs.length; i++) {
      var keys = attrs[i].split('=');
      map[keys[0]] = keys[1];
    }
    return map[name]
  }
  
  function setCookie (name, value) {
    document.cookie = name + '=' + value;
  }
  
  function addClass (el, className) {
    el.className += ' ' + className;
  }
  
  function removeClass (el, className) {
    var reg = new RegExp(className, 'g');
    el.className = el.className.replace(reg, '');
  }
  
  function isesolBrowserTipCloseEvent () {
    var dom = document.getElementsByClassName('isesol--v-warn')[0];
    setCookie(low_version_cookie, 1);
    removeClass(dom, 'show');
  }
  
  function createLowVersionDom (html) {
    var target = document.createElement('div');
    // target.setAttribute('id', low_version_id);
    target.innerHTML = html;
    return target;
  }
  
  function versionCompare (curV, reqV) {
    if(curV && reqV){
      var arr1 = String(curV).split('.'),
          arr2 = String(reqV).split('.');
      var minLength = Math.min(arr1.length, arr2.length), position = 0, diff = 0;
      while (position < minLength && ((diff = parseInt(arr1[position]) - parseInt(arr2[position])) == 0)){
          position++;
      }
      diff = (diff != 0) ? diff : (arr1.length - arr2.length);
      return diff >= 0;
    } else {
      return false;
    }
  }
  
  function level (currV, warnV, errV) {
    var type = '';
    if (versionCompare(currV, errV)) {
      if (!versionCompare(currV, warnV)) {
        type = 'warn';
      }
    } else {
      type = 'error';
    }
    return type;
  }
  
  // var error_html = ERROR_HTML;
  var warn_html = WARN_HTML;
  var options = OPTIONS_SIGN;
  var scripts = SCRIPTS_SIGN;
  var version_scirpt_id = SCRIPTS_ID_SIGN;
  var low_version_id = DOM_ID;
  var low_version_cookie = BROWSER_COOKIE;
  var debug_sign = DEBUG_SIGN;
  
  var info = new Browser();
  var warnVersion = options.warn[info.browser] ? options.warn[info.browser].toString() : '0';
  var errorVersion = options.error[info.browser] ? options.error[info.browser].toString() : '0';
  var currentVersion = info.version;
  
  // 提示的级别，warn error
  var low_version_type = level(currentVersion, warnVersion, errorVersion);
  warn_html = warn_html.replace('LOW_VERSION_TYPE', low_version_type);

  if (low_version_type === 'warn') {
    document.body.appendChild(createLowVersionDom(warn_html));
    var cookie = getCookie(low_version_cookie);
    var dom = document.getElementsByClassName('isesol--v-warn')[0];
    var closeBtn = document.getElementsByClassName('isesolBrowserTipClose')[0];
    if (debug_sign) {
      console.log(info, cookie ? 'cookie存在' : 'cookie不存在');
    }
    if (!cookie) {
      addClass(dom, 'show');
      closeBtn.addEventListener('click', isesolBrowserTipCloseEvent);
    }
  }
})()
