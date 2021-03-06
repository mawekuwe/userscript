﻿// coding: utf-8
// ==UserScript==
// @name           Test000
// @namespace      Test000
// @include        http://*.ikariam.tld/index.php?view=island*
// ==/UserScript==

for(var i=0; i < 16; i++) {
	var cityLevel = xpathS('//li[@id="cityLocation' + i + '"]//li[@class="citylevel"]/text()');
	GM_log('cityLevel for location ' + i + ' is ' + cityLevel);
	
	if(cityLevel == '0') {
		var bLink = xpathS('//li[@id="cityLocation' + i + '"]//li[@class="blockade"]/a/@href');
		var cityID = getIntValue(bLink);
		var cityOwner = xpathS('//li[@id="cityLocation' + i + '"]//li[@class="owner"]/text()');
		var ally = xpathS('//li[@id="cityLocation' + i + '"]//li[@class="ally"]/text()');
		var NF = function(){
			//selectCity(i, cityID, 0); 
			//selectGroup.activate(this, 'cities'); 
			//return false;
			if(confirm('您確定要封鎖來自聯盟('+ally+')的'+cityOwner+'正創建的新城鎮嗎？'))
				location.replace(bLink);
		}

		
		var cityLi = document.getElementById('cityLocation' + i);

		var cityLink = document.createElement("a");
		cityLink.id = 'city_' + i;
		cityLink.innerHTML = '<span class="textLabel"><span class="before"></span>新城鎮 玩家:' + cityOwner + '(' + ally + ')<span class="after"></span></span>';
		cityLink.href = "#";
		cityLink.addEventListener('click', NF	, false);
		cityLi.appendChild(cityLink);
	}

}

function xpath(query) {
  return document.evaluate(query, document, null,XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
}

function xpathS(query) {
	  return document.evaluate(query, document, null,XPathResult.STRING_TYPE, null).stringValue;
}

function getIntValue(str, defaultValue) {
  var temp = ""+str;
  temp = temp.replace(/[^0-9]+/g, "");
  temp = parseInt(temp);
  if (defaultValue != undefined && (temp == undefined || (""+temp == "NaN"))) {
    return defaultValue;
  }
  return temp;
}
