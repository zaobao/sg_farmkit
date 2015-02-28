// ==UserScript==
// @name        sg farmkit
// @namespace   com.sgamer.bbs.farmkit
// @description SG伐木助手
// @include     http://bbs.sgamer.com/thread-*.html
// @include     http://bbs.sgamer.com/*mod=viewthread*
// @version     1.9.9
// @grant       none
// ==/UserScript==

var devmode = false;
if (devmode) {
	var timestamp = new Date();
}

var pcrr = {
	"枪": "&#x67AA;",
	"弹": "&#x5F39;",
	"性": "&#x6027;",
	"毒": "&#x6BD2;",
	"裸": "&#x88F8;",
	"仇": "&#x4EC7;",
	"奸": "&#x5978;",
	"淫": "&#x6DEB;"
}

var rrr = {
	"(不共戴天之|复)\\*": "$1仇",
	"(显示器)\\*\\*": "$1杀手",
	"\\*(幕)": "弹$1",
	"(躺|火)\\*": "$1枪",
	"(核|炸)\\*": "$1弹",
	"(剧)\\*": "$1毒",
	"(意)\\*": "$1淫",
	"(汉)\\*": "$1奸",
	"\\*(情|格|感|别|取向|质)": "性$1",
	"\\*(龙|镖|瘤|奶|狗|素)": "毒$1",
	"\\*(恨)": "仇$1",
	"\\*(照)": "裸$1",
	"\\*(妇)": "淫$1",
	"\\*(臣)": "奸$1",
	"(任|可能|世界|历史|人|个|女|属|理|局限|专业|进攻|本|选择|关键|重要|习惯|灵|观赏|记|惰|理)\\*": "$1性"
}

var fastFormNames = ["fastpostform", "vfastpostform"];

function isParent(obj, parentObj){
	while (obj != undefined && obj != null && obj.tagName.toUpperCase() != 'BODY') {
		if (obj == parentObj){
			return true;
		}
		obj = obj.parentNode;
	}
	return false;
} 

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

function replaceFace(e) {
	var nodes = e.childNodes;
	for (var i = 0; i < nodes.length; i++) {
		if (nodes[i].nodeName && nodes[i].nodeName.toLowerCase() == "img") {
			var smilieid = nodes[i].getAttribute("smilieid");
			if (smilieid >= 85 && smilieid <= 137) {
				e.replaceChild(document.createTextNode("{:" + smilieid + ":}"), nodes[i]);
			} else if (smilieid >= 343 && smilieid <= 419) {
				e.replaceChild(document.createTextNode("{:6_" + smilieid + ":}"), nodes[i]);
			} else if (smilieid == 169 || smilieid == 177 || smilieid == 170 || smilieid == 178) {
				e.replaceChild(document.createTextNode("{:3_" + smilieid + ":}"), nodes[i]);
			} else if (smilieid >= 171 && smilieid <= 176 || smilieid >= 179 && smilieid <= 181) {
				e.replaceChild(document.createTextNode("{:7_" + smilieid + ":}"), nodes[i]);
			} else if (smilieid >= 168 && smilieid <= 276) {
				e.replaceChild(document.createTextNode("{:5_" + smilieid + ":}"), nodes[i]);
			} else {
				e.replaceChild(document.createTextNode("[img=" + nodes[i].width + "," + nodes[i].height + "]" + nodes[i].src + "[/img]"), nodes[i]);
			}
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
	var tt = document.title;
	document.title = recoverText(tt);
})();

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
			var fastre = null;
			var as = postNode.getElementsByTagName("a");
			for (var k = 0; k < as.length; k++) {
				if (as[k].className == "fastre") {
					fastre = as[k];
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
						var span1 = document.createElement("span");
						span1.className = "pipe";
						span1.innerHTML = "|";
						span1.style.cssFloat = "right";
						span1.style.lineHeight = "16px";
						span1.style.margin = "0px 2px";
						divs[j].appendChild(span1);
						var replyBox = document.createElement("span");
						var replyArchor = document.createElement("span");
						replyBox.appendChild(replyArchor);
						replyArchor.innerHTML = "快速回复";
						replyBox.style.cssText = "float: right; padding: 0px 6px;"
						replyArchor.style.cssText = "color: green; cursor: pointer; line-height: 16px;";
						divs[j].appendChild(replyBox);
						var fastReplyPoint = document.createElement("div");
						fastReplyPoint.style.cssText = "overflow-x: visible; overflow-y: visible; position: relative; height: 0px; width: 0px;"; 
						replyBox.appendChild(fastReplyPoint);
						replyArchor.onmouseover = function () {
							this.nextSibling.childNodes[0].style.display = "block";
						}
						replyArchor.onmouseout = function (e) {
							if (isParent(e.relatedTarget, this.parentNode)) {
								return false;
							}
							this.nextSibling.childNodes[0].style.display = "none";
						}
						fastReplyPoint.appendChild(createFastReplyBox());
						divs[j].parentNode.parentNode.style.cssText = "overflow-x: visible; overflow-y: visible;";
						fastReplyPoint.fastre = fastre;
						farmArchor.divPElement = divs[j];
						farmArchor.onclick = function () {
							if (getCookie("SG_farmkit_ifPostTimeLimit")) {
								onNeedMoreTime();
								return false;
							}
							var postText = "伐木伐木";
							var tds = this.divPElement.parentNode.parentNode.parentNode.getElementsByTagName("td");
							for (var k = 0; k < tds.length; k++) {
								if (tds[k].getAttribute("id").match("postmessage_")) {
									replaceFace(tds[k]);
									postText = (tds[k].innerText || tds[k].textContent || tds[k].text).replace(/^\s*/g, "");
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
						farmArchor.innerHTML = "复制伐木";
						farmArchor.style.cssText = "color: green; cursor: pointer; float: right; line-height: 16px; padding: 0px 6px; -moz-user-select:none; -webkit-user-select:none; user-select:none;";
						divs[j].appendChild(farmArchor);
						divs[j].appendChild(document.createTextNode("\n"));
						var span1 = document.createElement("span");
						span1.className = "pipe";
						span1.innerHTML = "|";
						span1.style.cssFloat = "right";
						span1.style.lineHeight = "16px";
						span1.style.margin = "0px 2px";
						divs[j].appendChild(span1);
						var replyBox = document.createElement("span");
						var replyArchor = document.createElement("span");
						replyBox.appendChild(replyArchor);
						replyArchor.innerHTML = "快速回复";
						replyBox.style.cssText = "float: right; padding: 0px 6px;"
						replyArchor.style.cssText = "color: green; cursor: pointer; line-height: 16px;";
						divs[j].appendChild(replyBox);
						var fastReplyPoint = document.createElement("div");
						fastReplyPoint.style.cssText = "overflow-x: visible; overflow-y: visible; position: relative; height: 0px; width: 0px;"; 
						replyBox.appendChild(fastReplyPoint);
						replyArchor.onmouseover = function () {
							this.nextSibling.childNodes[0].style.display = "block";
						}
						replyArchor.onmouseout = function (e) {
							if (isParent(e.relatedTarget, this.parentNode)) {
								return false;
							}
							this.nextSibling.childNodes[0].style.display = "none";
						}
						fastReplyPoint.appendChild(createFastReplyBox());
						fastReplyPoint.fastre = fastre;
						divs[j].parentNode.parentNode.style.cssText = "overflow-x: visible; overflow-y: visible;";
						farmArchor.divPElement = divs[j];
						farmArchor.onclick = function () {
							if (getCookie("SG_farmkit_ifPostTimeLimit")) {
								onNeedMoreTime();
								return false;
							}
							var postText = "伐木伐木";
							var tds = this.divPElement.parentNode.parentNode.parentNode.getElementsByTagName("td");
							var selection = window.getSelection();
							var selectionText;
							if (selection != null && !selection.isCollapsed) {
								var focusNode = selection.focusNode;
								var focusOffset = selection.focusOffset;
								var anchorNode = selection.anchorNode;
								var anchorOffset = selection.anchorOffset
								replaceFace(selection.anchorNode.parentNode);
								selection.collapse(anchorNode, anchorOffset);
								selection.extend(focusNode, focusOffset);
								selectionText = selection.toString();
							}
							if (selectionText != null && selectionText.length > 0) {
								postText = selectionText;
								fastfarm(postText);
								return false;
							}
							for (var k = 0; k < tds.length; k++) {
								if (tds[k].getAttribute("id").match("postmessage_")) {
									replaceFace(tds[k]);
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

function createFastReplyBox() {
	var box = document.createElement("div");
	box.style.cssText = "height: 100px; width: 100px; display: none";
	box.appendChild(createFastReplyItem("道理是这么个道理"));
	box.appendChild(createFastReplyItem("妮说是就是"));
	box.appendChild(createFastReplyItem("抽根烟，压压惊"));
	box.appendChild(createFastReplyItem("XNMBYY"));
	box.appendChild(createFastReplyItem("妮为什么这么毒"));
	box.appendChild(createFastReplyItem("这件事窝已经报警"));
	box.appendChild(createFastReplyItem("建议永丰"));
	box.onmouseout = function (e) {
		if (isParent(e.relatedTarget, this.parentNode.parentNode)) {
			return false;
		}
		this.style.display = "none";
	}
	return box;
}

function createFastReplyItem(str) {
	var item = document.createElement("div");
	item.appendChild(document.createTextNode(str));
	item.style.cursor = "pointer";
	item.style.color = "gray";
	item.onclick = function () {
		this.parentNode.style.display = "none";
		replyFarm(this.parentNode.parentNode.fastre.href, this.innerHTML);
	}
	item.onmouseover = function () {item.style.color = "green"}
	item.onmouseout = function () {item.style.color = "gray"}
	return item;
}

function replyFarm(url, str) {
	if (getCookie("SG_farmkit_ifPostTimeLimit")) {
		onNeedMoreTime();
		return;
	}
	var reply_box = document.createElement("div");
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("GET", url + "&infloat=yes&handlekey=reply&inajax=1&ajaxtarget=fwin_content_reply",true);
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState==4 && xmlhttp.status==200) {
			reply_box.innerHTML = xmlhttp.responseXML.documentElement.childNodes[0].data;
			document.getElementById("postform").message.value = precensore(recoverText(str));
			setTimeLimit();
			document.getElementById("postform").submit();
		}
	}
	xmlhttp.send();
	document.body.appendChild(reply_box);
}

if (devmode) {
	alert("耗时：" + (new Date().getTime() - timestamp.getTime()) + "毫秒");
}