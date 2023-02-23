// ==UserScript==
// @name PT Helper
// @name:zh-CN PT 助手
// @version 0.1.1
// @namespace https://github.com/amorphobia/pt-helper
// @description A helper for private trackers
// @description:zh-CN 私密种子站点的助手
// @author amorphobia
// @homepage https://github.com/amorphobia/pt-helper
// @icon data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIj8+PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48ZGVmcz48c3R5bGU+LmMxe2ZpbGw6IzA1ZmZhMX0uYzJ7ZmlsbDojNzFjN2VjfS5jM3tmaWxsOiNmZjUyNTJ9LmM0e2ZpbGw6IzY1NzM3ZX08L3N0eWxlPjwvZGVmcz48dGl0bGU+c2hhcmUtZmlsbGVkPC90aXRsZT48Y2lyY2xlIGNsYXNzPSJjMSIgY3g9IjQwNS4zMyIgY3k9IjEwNi42NyIgcj0iODUuMzMiLz48Y2lyY2xlIGNsYXNzPSJjMiIgY3g9IjQwNS4zMyIgY3k9IjQwNS4zMyIgcj0iODUuMzMiLz48Y2lyY2xlIGNsYXNzPSJjMyIgY3g9IjEwNi42NyIgY3k9IjI1NiIgcj0iODUuMzMiLz48cGF0aCBjbGFzcz0iYzQiIGQ9Ik00MDUuMzMsMjk4LjY3YTEwNi41NCwxMDYuNTQsMCwwLDAtODMuOSw0MC44NkwyMDkuNjksMjgzLjY2YTEwNi43OCwxMDYuNzgsMCwwLDAsMC01NS4zMWwxMTEuNzUtNTUuODdhMTA2LjI3LDEwNi4yNywwLDEsMC0xOS4xMy0zOC4xNUwxOTAuNTYsMTkwLjJhMTA2LjY3LDEwNi42NywwLDEsMCwwLDEzMS42bDExMS43NSw1NS44N2ExMDYuNjcsMTA2LjY3LDAsMSwwLDEwMy03OVptMC0yNTZhNjQsNjQsMCwxLDEtNjQsNjRBNjQuMDcsNjQuMDcsMCwwLDEsNDA1LjMzLDQyLjY3Wk0xMDYuNjcsMzIwYTY0LDY0LDAsMSwxLDY0LTY0QTY0LjA3LDY0LjA3LDAsMCwxLDEwNi42NywzMjBaTTQwNS4zMyw0NjkuMzNhNjQsNjQsMCwxLDEsNjQtNjRBNjQuMDcsNjQuMDcsMCwwLDEsNDA1LjMzLDQ2OS4zM1oiLz48L3N2Zz4=
// @supportURL https://github.com/amorphobia/pt-helper/issues
// @license AGPL-3.0-or-later
// @match *://hhanclub.top/*
// @match *://nanyangpt.com/*
// @match *://pt.sjtu.edu.cn/*
// @match *://tjupt.org/*
// @grant GM_addStyle
// @grant GM_registerMenuCommand
// @grant GM_unregisterMenuCommand
// @grant GM_openInTab
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_notification
// @grant GM_xmlhttpRequest
// @noframes
// ==/UserScript==

/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Hhanclub = void 0;
const index_1 = __webpack_require__(2);
class Hhanclub extends index_1.NexusPHP {
    constructor() {
        super("hhanclub.top");
        this.menu_items = [
            {
                "id": "bannerFold",
                "type": "switch",
                "display": "自动折叠横幅（隐藏时折叠设置无效）",
                "name": "自动折叠横幅",
                "value": true
            },
            {
                "id": "bannerHide",
                "type": "switch",
                "display": "隐藏横幅（隐藏时折叠设置无效）",
                "name": "隐藏横幅",
                "value": false
            }
        ].concat(this.menu_items);
    }
    onLoad() {
        super.onLoad();
        if (this.getHostValue("bannerHide")) {
            this.css += `
td.clear.nowrap img {
    display: none;
}`;
        }
        else if (this.getHostValue("bannerFold")) {
            const banner = document.querySelector("td.clear.nowrap");
            const original_height = banner === null || banner === void 0 ? void 0 : banner.clientHeight;
            this.css += `
td.clear.nowrap img {
    height: 10px;
    overflow: hidden;
    transition: height 0.5s;
}

td.clear.nowrap img:hover {
    height: ${original_height}px;
}`;
        }
    }
}
exports.Hhanclub = Hhanclub;


/***/ }),
/* 2 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NexusPHP = void 0;
const common_1 = __webpack_require__(3);
class NexusPHP extends common_1.Common {
    constructor(host) {
        super(host);
        this.passkey = "";
        this.menu_items = [
            {
                "id": "thanks",
                "type": "switch",
                "display": "自动说谢谢",
                "name": "自动说谢谢",
                "value": true
            }
        ].concat(this.menu_items);
    }
    onLoad() {
        super.onLoad();
        this.getPasskey();
        if (this.getHostValue("thanks") && location.href.indexOf("/details.php") >= 0) {
            this.sayThanks();
        }
    }
    getPasskey() {
        const value = this.getHostValue("passkey");
        let passkey = "";
        if (value) {
            passkey = String(value);
        }
        if (passkey != "") {
            this.passkey = passkey;
            return;
        }
        const cp_url = "https://" + this.host + "/usercp.php";
        GM_xmlhttpRequest({
            method: "GET",
            url: cp_url,
            onload: (response) => {
                if (response.status != 200) {
                    console.log("Failed to get passkey.");
                    return;
                }
                const container = document.implementation.createHTMLDocument().documentElement;
                container.innerHTML = response.responseText;
                const tds = container.querySelectorAll("td.rowfollow");
                for (const td of tds) {
                    const tc = td;
                    const re = /[\w\d]{32}/;
                    const result = re.exec(tc.innerText);
                    if (result) {
                        this.setHostValue("passkey", result[0]);
                        this.passkey = result[0];
                        return;
                    }
                }
            },
            onabort: () => {
                console.log("Abort to get passkey");
            },
            onerror: () => {
                console.log("Error to get passkey");
            }
        });
    }
    sayThanks() {
        this.wait(2000).then(() => {
            const input = document.querySelector("#saythanks");
            if (input && !input.disabled) {
                input.click();
            }
        }).catch(() => { console.log("Failed to say thanks."); });
    }
}
exports.NexusPHP = NexusPHP;


/***/ }),
/* 3 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Common = void 0;
const helper_home = "https://github.com/amorphobia/pt-helper";
const num_emoji = ["0️⃣", "1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"];
class Common {
    constructor(host) {
        this.host = "";
        this.menu_items = [{
                "id": "feedback",
                "type": "link",
                "display": "💬反馈与建议",
                "value": helper_home + "/issues"
            }];
        this.host = host;
        this.registered_items = [];
        this.css = "";
    }
    init() {
        for (const item of this.menu_items) {
            item.id = this.host + "_" + item.id;
            if ((item.type == "switch" || item.type == "selection") && GM_getValue(item.id) == null) {
                GM_setValue(item.id, item.value);
            }
        }
        this.registerMenu();
    }
    onLoad() { }
    addStyle() {
        if (typeof GM_addStyle !== "undefined") {
            GM_addStyle(this.css);
        }
        else {
            const style = document.createElement("style");
            style.appendChild(document.createTextNode(this.css));
            (document.querySelector("head") || document.documentElement).appendChild(style);
        }
    }
    registerMenu() {
        for (const item of this.registered_items) {
            GM_unregisterMenuCommand(item);
        }
        this.registered_items = [];
        for (const item of this.menu_items) {
            const value = GM_getValue(item.id);
            if (value && value != null) {
                item.value = value;
            }
            let reg_item;
            switch (item.type) {
                case "switch":
                    reg_item = GM_registerMenuCommand(`${item.value ? "✅" : "❌"}${item.display}`, () => {
                        this.toggleSwitch(item);
                    });
                    break;
                case "selection":
                    reg_item = GM_registerMenuCommand(`${num_emoji[item.value]}${item.display[item.value]}`, () => {
                        this.nextSelection(item);
                    });
                    break;
                case "link":
                    reg_item = GM_registerMenuCommand(`${item.display}`, () => {
                        GM_openInTab(item.value, { active: true, insert: true, setParent: true });
                    });
                    break;
                case "text":
                    reg_item = GM_registerMenuCommand(`${item.display}`, () => { });
                    break;
                default:
                    console.log(`Unrecognized menu item: ${item.id}`);
                    break;
            }
            if (reg_item !== undefined) {
                this.registered_items.push(reg_item);
            }
        }
    }
    toggleSwitch(item) {
        const status = item.value ? "关闭" : "开启";
        GM_setValue(item.id, !item.value);
        GM_notification({
            text: `已${status}「${item.name}」\n（点击刷新网页后生效）`,
            timeout: 3500,
            onclick: () => { location.reload(); }
        });
        this.registerMenu();
    }
    nextSelection(item) {
        const new_value = (item.value + 1) % item.display.length;
        GM_setValue(item.id, new_value);
        GM_notification({
            text: `切换为「${item.display[new_value]}」\n（点击刷新网页后生效）`,
            timeout: 3500,
            onclick: () => { location.reload(); }
        });
        this.registerMenu();
    }
    wait(ms) {
        return new Promise((resolve, reject) => {
            setTimeout(resolve, ms);
        });
    }
    getHostValue(id) {
        return GM_getValue(this.host + "_" + id);
    }
    setHostValue(id, value) {
        GM_setValue(this.host + "_" + id, value);
    }
}
exports.Common = Common;


/***/ }),
/* 4 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NanyangPT = void 0;
const NexusPHP_1 = __webpack_require__(2);
class NanyangPT extends NexusPHP_1.NexusPHP {
    constructor() {
        super("nanyangpt.com");
        this.menu_items = [
            {
                "id": "bannerHide",
                "type": "switch",
                "display": "隐藏横幅",
                "name": "隐藏横幅",
                "value": false
            }
        ].concat(this.menu_items);
    }
    onLoad() {
        super.onLoad();
        if (this.getHostValue("bannerHide")) {
            const info = document.querySelector("#info_block");
            const info_height = (info === null || info === void 0 ? void 0 : info.clientHeight) ? info.clientHeight + 5 : 30;
            this.css += `
table.head {
    display: none;
}

table.mainouter {
    margin-top: ${info_height}px;
}`;
        }
    }
}
exports.NanyangPT = NanyangPT;


/***/ }),
/* 5 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SJTU = void 0;
const index_1 = __webpack_require__(2);
class SJTU extends index_1.NexusPHP {
    constructor() {
        super("pt.sjtu.edu.cn");
    }
}
exports.SJTU = SJTU;


/***/ }),
/* 6 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TJUPT = void 0;
const index_1 = __webpack_require__(2);
class TJUPT extends index_1.NexusPHP {
    constructor() {
        super("tjupt.org");
        this.menu_items = [
            {
                "id": "bannerFold",
                "type": "switch",
                "display": "自动折叠横幅（隐藏时折叠设置无效）",
                "name": "自动折叠横幅",
                "value": true
            },
            {
                "id": "bannerHide",
                "type": "switch",
                "display": "隐藏横幅（隐藏时折叠设置无效）",
                "name": "隐藏横幅",
                "value": false
            },
            {
                "id": "stickyHide",
                "type": "selection",
                "display": [
                    "显示所有置顶",
                    "隐藏一重置顶",
                    "隐藏一、二重置顶",
                    "隐藏所有置顶"
                ],
                "value": 0
            },
            {
                "id": "directLink",
                "type": "switch",
                "display": "种子直链按钮（左键点击按钮复制直链）",
                "name": "种子直链",
                "value": true
            },
            {
                "id": "colorBlind",
                "type": "switch",
                "display": "色盲模式",
                "name": "色盲模式",
                "value": false
            }
        ].concat(this.menu_items);
    }
    onLoad() {
        var _a;
        super.onLoad();
        if (this.getHostValue("bannerHide")) {
            this.css += `
.logo_img img {
    display: none;
}`;
        }
        else if (this.getHostValue("bannerFold")) {
            const logo_img = document.querySelector(".logo_img");
            const original_height = logo_img === null || logo_img === void 0 ? void 0 : logo_img.clientHeight;
            this.css += `
.logo_img {
    height: 10px;
    overflow: hidden;
    transition: height 0.5s;
}

.logo_img:hover {
    height: ${original_height}px;
}`;
        }
        switch (this.getHostValue("stickyHide")) {
            case 3:
                this.css += `
.triple_sticky_bg {
    display: none;
}`;
            case 2:
                this.css += `
.double_sticky_bg {
    display: none;
}`;
            case 1:
                this.css += `
.sticky_bg {
    display: none;
}`;
            default:
                break;
        }
        if (this.getHostValue("directLink") && this.passkey != "") {
            const id_re = /id=[\d]+/;
            const tds = document.querySelectorAll("table.torrentname > tbody > tr:nth-of-type(1) > td:nth-of-type(3)");
            for (const td of tds) {
                const dl = td.querySelector("a");
                const result = id_re.exec((_a = dl === null || dl === void 0 ? void 0 : dl.href) !== null && _a !== void 0 ? _a : "");
                if (!result) {
                    continue;
                }
                const direct_link = `https://www.${this.host}/download.php?${result[0]}&passkey=${this.passkey}`;
                const img = document.createElement("img");
                img.setAttribute("src", "pic/trans.gif");
                img.setAttribute("class", "torrent_direct_link");
                img.setAttribute("alt", "DL");
                const a = document.createElement("a");
                a.setAttribute("title", "左键单击复制，链接中包含个人秘钥Passkey，切勿泄露！");
                a.setAttribute("onclick", "return false");
                a.setAttribute("id", "direct_link");
                a.setAttribute("href", direct_link);
                a.setAttribute("data-clipboard-text", direct_link);
                a.appendChild(img);
                td.prepend(a);
            }
            this.css += `
img.torrent_direct_link {
    width: 16px;
    height: 16px;
    background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAH5QTFRFR3BMyKN4cz0Td3d3sLCw6enp////qHg4oaGhcz0TlpaWkV8opnU2lmQrjVklqHg4m2kvo3I03ruJiFMhn24y4r+N2raG5cSP9+jQg04e1rKD68uUnYpv6ceS0q5/fkkaoaGhzqp8h4eHr6+v+Pj4ekQXdkAV+/v78fHxy6Z6f0p3WgAAAAp0Uk5TAP///////5aWlrne7esAAACHSURBVBjTbc5HEsIwEERRA5qxLeecc77/BTEN0oq/m1ddKhnG36xxtPRhBq2UxyFlG5gAt5zXk+hc59IFRM3yQksTAdKOf3UpICxYCEFEXIQAL2NCnHkAJ/4s7jh2AH6uFrkPSOrvgrhOAFWvFn0FGCYWhDemAbBd6h/XBtgfuh1gP3X2fb4BlrkIUt3i2kgAAAAASUVORK5CYII=');
    padding-bottom: 1px;
}`;
            location.assign("javascript:registerClipboardJS('#direct_link');void(0)");
        }
        if (this.getHostValue("colorBlind")) {
            if (location.href.indexOf("/classes.php") >= 0) {
                const spans = document.querySelectorAll("table.main > tbody > tr > td:nth-of-type(2) > ul > li > span[style=\"color: green\"]");
                for (const span of spans) {
                    span.setAttribute("style", "color: blue");
                }
            }
        }
    }
    getPasskey() {
        const value = this.getHostValue("passkey");
        let passkey = "";
        if (value) {
            passkey = String(value);
        }
        if (passkey != "") {
            this.passkey = passkey;
            return;
        }
        const link = document.querySelector("[title=\"Latest Torrents\"]");
        const re = /passkey=([\d\w]+)/;
        const result = re.exec(link.href);
        this.passkey = result && result.length > 1 ? result[1] : "";
        if (this.passkey != "") {
            this.setHostValue("passkey", this.passkey);
        }
    }
}
exports.TJUPT = TJUPT;


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;

Object.defineProperty(exports, "__esModule", ({ value: true }));
const hhanclub_top_1 = __webpack_require__(1);
const nanyangpt_com_1 = __webpack_require__(4);
const pt_sjtu_edu_cn_1 = __webpack_require__(5);
const index_1 = __webpack_require__(6);
const host = window.location.host;
const sites = new Map([
    ["hhanclub.top", new hhanclub_top_1.Hhanclub()],
    ["nanyangpt.com", new nanyangpt_com_1.NanyangPT()],
    ["pt.sjtu.edu.cn", new pt_sjtu_edu_cn_1.SJTU()],
    ["tjupt.org", new index_1.TJUPT()]
]);
const site = sites.get(host);
if (site) {
    site.init();
    site.onLoad();
    site.addStyle();
}

})();

/******/ })()
;