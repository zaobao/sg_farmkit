// ==UserScript==
// @name        sg farmkit
// @namespace   com.sgamer.bbs.farmkit
// @description SG伐木助手
// @include     http://bbs.sgamer.com/thread-*.html
// @include     http://bbs.sgamer.com/*mod=viewthread*
// @version     1
// @grant       none
// ==/UserScript==

function fastfarm(replyStr) {
	document.getElementById("fastpostmessage").value = replyStr;
	document.getElementById("fastpostform").submit();
}

var postNodes = document.getElementById("postlist").childNodes;

for (var i = 0, isReply = 0; i < postNodes.length; i++) {
	var postNode = postNodes[i];
	if (postNode && 
		postNode.getAttribute && 
		postNode.getAttribute("id") && 
		postNode.getAttribute("id").match("post_")) {
		if (isReply == 1) {
			var divs = postNode.getElementsByTagName("div");
			for (var j = 0; j < divs.length; j++) {
				if (divs[j].className == "authi" && divs[j].parentNode.className == "pti") {
					var span = document.createElement("span");
					span.className = "pipe";
					span.innerHTML = "|";
					divs[j].appendChild(span);
					divs[j].appendChild(document.createTextNode("\n"));
					var farmArchor = document.createElement("a");
					farmArchor.innerHTML = "复制伐木";
					farmArchor.style.color = "green";
					farmArchor.style.cursor = "pointer";
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
			isReply = 1;
		}
	}
}
