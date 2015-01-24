// ==UserScript==
// @name        sg farmkit
// @namespace   com.sgamer.bbs.farmkit
// @description SG伐木助手
// @include     http://bbs.sgamer.com/thread-*.html
// @include     http://bbs.sgamer.com/*mod=viewthread*
// @version     1.2.1
// @grant       none
// ==/UserScript==

var pcrr = {
	"枪": "&#x67AA;",
	"弹": "&#x5F39;",
	"性": "&#x6027;",
	"毒": "&#x6BD2;"
}

var rrr = {
	"(核)\\*": "$1弹",
	"\\*(龙)": "毒$2"
}

var fastFormNames = ["fastpostform", "vfastpostform"];

function precensore (str) {
	if (str) {
		for (var ch in pcrr) {
			str = str.replace(new RegExp(ch, "ig"), pcrr[ch]);
		}
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

function fastfarm(replyStr) {
	document.getElementById("fastpostmessage").value = precensore(recoverText(replyStr));
	document.getElementById("fastpostform").submit();
}

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
