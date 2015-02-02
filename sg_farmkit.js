// ==UserScript==
// @name        sg farmkit
// @namespace   com.sgamer.bbs.farmkit
// @description SG伐木助手
// @include     http://bbs.sgamer.com/thread-*.html
// @include     http://bbs.sgamer.com/*mod=viewthread*
// @version     1.2.5
// @grant       none
// ==/UserScript==

var pcrr = {
	"枪": "&#x67AA;",
	"弹": "&#x5F39;",
	"性": "&#x6027;",
	"毒": "&#x6BD2;",
	"裸": "&#x88F8;",
	"仇": "&#x4EC7;"
}

var rrr = {
	"(可能|世界|历史|人|个|女|属|理)\\*": "$1性",
	"(躺|火)\\*": "$1枪",
	"(核|炸)\\*": "$1弹",
	"(意)\\*": "$1淫",
	"\\*(情|格)": "性$1",
	"\\*(龙|镖|瘤)": "毒$1",
	"\\*(恨)": "仇$1",
	"\\*(幕)": "弹$1",
	"\\*(照)": "裸$1"
}

var fastFormNames = ["fastpostform", "vfastpostform"];

function getCookie(c_name) {
	if (document.cookie.length > 0) {
		c_start = document.cookie.indexOf(c_name + "=");
		if (c_start != -1) { 
			c_start = c_start + c_name.length + 1 ;
			c_end = document.cookie.indexOf(";", c_start);
			if (c_end == -1) {
				c_end = document.cookie.length;
			}
			return unescape(document.cookie.substring(c_start, c_end));
		} 
	}
	return "";
}

function setCookie (c_name, value, expiresecs) {
	var exdate = new Date();
	exdate.setSeconds(exdate.getSeconds() + expiresecs);
	document.cookie = c_name + "=" + escape(value) + ((expiresecs == null) ? "" : ";expires=" + exdate.toGMTString());
}

function setTimeLimit() {
	setCookie("SG_farmkit_ifPostTimeLimit", "1", 16);
}
function precensore (str) {
	if (str) {
		for (var ch in pcrr) {
			str = str.replace(new RegExp(ch, "ig"), pcrr[ch]);
		}
	}
	if (str.length < 10) {
		str = str + "          ";
	}
	return str;
}

function recoverText (str) {
	if (str) {
		for (var ch in rrr) {
			str = str.replace(new RegExp(ch, "ig"), rrr[ch]);
		}
	}
	return str;
}

function precensoreFastForm(formName) {
	var form = document.getElementById(formName);
	if (form) {
		form.onsubmit = function (e) {
			this.message.value = parseurl(precensore(this.message.value));
			setTimeLimit();
			ajaxpost(formName, 'return_reply', 'return_reply', 'onerror');
			return false;
		}
	}
}

(function () { 
	document.getElementById("scrolltop").getElementsByTagName("a")[0].onclick = function () {
		showWindow('reply', this.href);
		setTimeout(function () {
			precensoreFastForm("postform");
		}, 500);
		return false;
	}
})();

(function () { 
	for (var i = 0; i < fastFormNames.length; i++) {
		precensoreFastForm(fastFormNames[i]);
	}
})();

function onNeedMoreTime() {
	if (document.getElementById('ntcwin')) {
		var ntcwin = document.getElementById('ntcwin');
	} else {
		var ntcwin = document.createElement('div');
		ntcwin.id = "ntcwin";
		ntcwin.className = "popuptext";
		ntcwin.style.cssText = "position: fixed; z-index: 501; left: 466.5px; top: 30px; display: none;";
		document.getElementById("append_parent").appendChild(ntcwin);
		var table = document.createElement("table");
		table.className = "popupcredit";
		table.cellspacing = "0";
		table.cellpadding = "0";
		ntcwin.appendChild(table);
		var tr = document.createElement("tr");
		table.appendChild(tr);
		var tdl = document.createElement("td");
		tdl.className = "pc_l";
		tr.appendChild(tdl);
		var tdc = document.createElement("td");
		tdc.className = "pc_c";
		tr.appendChild(tdc);
		var tdr = document.createElement("td");
		tdr.className = "pc_r";
		tr.appendChild(tdr);
		var div_inner = document.createElement("div");
		div_inner.className = "pc_inner";
		tdc.appendChild(div_inner);
		var i_text = document.createElement("i");
		i_text.innerHTML = "抱歉，您两次发表间隔少于 15 秒，请稍候再发表";
		div_inner.appendChild(i_text);
	}
	document.getElementById('ntcwin').style.display = "block";
	setTimeout(function () {
		document.getElementById('ntcwin').style.display = "none";
	}, 2500);
}

function fastfarm(replyStr) {
	if (getCookie("SG_farmkit_ifPostTimeLimit")) {
		onNeedMoreTime();
		return;
	}
	document.getElementById("fastpostmessage").value = precensore(recoverText(replyStr));
	setTimeLimit();
	document.getElementById("fastpostform").submit();
}

(function () {
	var ih = document.getElementById("thread_subject").innerHTML;
	document.getElementById("thread_subject").innerHTML = recoverText(ih);
})();

(function () {
	var postlist = document.getElementById("postlist");
	if (postlist == null) {
		return;
	}
	var postNodes = postlist.childNodes;
	for (var i = 0, isReply = 0; i < postNodes.length; i++) {
		var postNode = postNodes[i];
		if (postNode && 
			postNode.getAttribute && 
			postNode.getAttribute("id") && 
			postNode.getAttribute("id").match("post_")) {
			var tds = postNode.getElementsByTagName("td");
			for (var k = 0; k < tds.length; k++) {
				if (tds[k].id && tds[k].id.match("postmessage_")) {
					tds[k].innerHTML = recoverText(tds[k].innerHTML);
				}
			}
			if (isReply == 1) {
				var divs = postNode.getElementsByTagName("div");
				for (var j = 0; j < divs.length; j++) {
					if (divs[j].className == "authi" && divs[j].parentNode.className == "pti") {
						var span = document.createElement("span");
						span.className = "pipe";
						span.innerHTML = "|";
						span.style.cssFloat = "right";
						span.style.lineHeight = "16px";
						span.style.margin = "0px 2px";
						divs[j].appendChild(span);
						divs[j].appendChild(document.createTextNode("\n"));
						var farmArchor = document.createElement("a");
						farmArchor.innerHTML = "复制伐木";
						farmArchor.style.color = "green";
						farmArchor.style.cursor = "pointer";
						farmArchor.style.cssFloat = "right";
						farmArchor.style.lineHeight = "16px";
						farmArchor.style.padding = "0px 6px";
						divs[j].appendChild(farmArchor);
						divs[j].appendChild(document.createTextNode("\n"));
						farmArchor.divPElement = divs[j];
						farmArchor.onclick = function () {
							var postText = "伐木伐木";
							var tds = this.divPElement.parentNode.parentNode.parentNode.getElementsByTagName("td");
							for (var k = 0; k < tds.length; k++) {
								if (tds[k].getAttribute("id").match("postmessage_")) {
									postText = tds[k].innerText || tds[k].textContent || tds[k].text;
									if (postText[0] == "\n") {
										postText = postText.slice(1);
									}
									break;
								}
							}
							fastfarm(postText);
						}
					}
				}
			} else {
				var divs = postNode.getElementsByTagName("div");
				for (var j = 0; j < divs.length; j++) {
					if (divs[j].className == "authi" && divs[j].parentNode.className == "pti") {
						var span = document.createElement("span");
						span.className = "pipe";
						span.innerHTML = "|";
						span.style.cssFloat = "right";
						span.style.lineHeight = "16px";
						span.style.margin = "0px 2px";
						divs[j].appendChild(span);
						divs[j].appendChild(document.createTextNode("\n"));
						var farmArchor = document.createElement("a");
						var speedFarmText = document.createElement
						farmArchor.innerHTML = "快速伐木";
						farmArchor.style.cssText = "color: green; cursor: pointer; float: right; line-height: 16px; padding: 0px 6px; -moz-user-select:none; -webkit-user-select:none; user-select:none;";
						divs[j].appendChild(farmArchor);
						divs[j].appendChild(document.createTextNode("\n"));
						farmArchor.divPElement = divs[j];
						farmArchor.onclick = function () {
							var postText = "伐木伐木";
							var tds = this.divPElement.parentNode.parentNode.parentNode.getElementsByTagName("td");
							var selection = window.getSelection();
							if (selection != null) {
								selectionText = selection.toString();
							}
							if (selectionText != null && selectionText.length > 0) {
								postText = selectionText;
								fastfarm(postText);
								return false;
							}
							for (var k = 0; k < tds.length; k++) {
								if (tds[k].getAttribute("id").match("postmessage_")) {
									postText = (tds[k].innerText || tds[k].textContent || tds[k].text)
										.replace(/(^\s*)|(\s*$)/g, "").split("\n").pop();
									if (postText[0] == "\n") {
										postText = postText.slice(1);
									}
									break;
								}
							}
							fastfarm(postText);
							return false;
						}
					}
				}
				isReply = 1;
			}
		}
	}
})();
