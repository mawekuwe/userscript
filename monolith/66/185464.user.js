// ==UserScript==
// @name        Frozen Cookie
// @namespace   Cookie
// @include     http://orteil.dashnet.org/cookieclicker/
// @version     1
// @grant       none
// ==/UserScript==

var init = Game.Init;
Game.Init = function(){
    init();
    loadCookieMonster();
}

javascript:(
  function () {
    var js = document.createElement('script');
    js.setAttribute('type', 'text/javascript');
    js.setAttribute('src', 'https://raw.github.com/Icehawk78/FrozenCookies/master/frozen_cookies.js');
    document.head.appendChild(js);
 }()
);