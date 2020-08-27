(()=>{
  const menuItems = [
      { "menuText": "home",
        "url": "{{ APP_PREFIX }}/",
        "logo": "{{ APP_PREFIX }}/assets/site-logo-long.png"
      },
      { "menuText": "editor",
        "url": "/e/",
        "logo": "{{ APP_PREFIX }}/assets/editor-logo.png"
      },
      { "menuText": "warper",
        "url": "/w/",
        "logo": "{{ APP_PREFIX }}/assets/warper-logo.png"
      },
      { "menuText": "reservoir",
        "url": "/r/",
        "logo": "{{ APP_PREFIX }}/assets/reservoir-logo.png"
      }
  ];

  function currentPrefix() {
    const loc = window.location.pathname;
    const i = loc.indexOf("/", 1);
    if (i < 0) {
      return loc;
    }
    return loc.substring(0, i+1);
  }

  function currentLogoUrl() {
    url = currentPrefix();
    for (let i = 0; i < menuItems.length; ++i) {
      if (menuItems[i].url == url) {
        return menuItems[i].logo;
      }
    }
    return menuItems[0].logo;
  }

  function createElement(tag, attrs, text) {
    const el = document.createElement(tag);
    if (attrs != undefined) {
      for (const [attr, value] of Object.entries(attrs)) {
        el.setAttribute(attr, value);
      }
    }
    if (text) {
      el.innerHTML = text;
    }
    return el;
  }

  function createMenuItem(text, url) {
    const elA = document.createElement("a");
    elA.setAttribute("href", url);
    const elDiv = document.createElement("div");
    elDiv.setAttribute("class", "kartta-menu-item");
    elDiv.innerHTML = text;
    elA.appendChild(elDiv);
    elDiv.addEventListener('click', (e) => {
      window.location.href = (
          window.location.protocol
              + "//"
              + window.location.hostname
              + (window.location.port != "" ? (":" + window.location.port) : "")
              + url
      );
    });
    return elA;
  }

  function createDropDown() {
    const elDiv = createElement("div", {
      "class": "kartta-app-menu-dropdown",
    });
    menuItems.forEach(item => {
      elDiv.appendChild(createMenuItem(item.menuText, item.url));
    });
    return elDiv;
  }

  function installAppMenu() {
    const appMenuPlaceholder = document.getElementById("kartta-app-menu");

    if (!appMenuPlaceholder) {
      return;
    }

    const elem = createElement("div", {
      "class": "kartta-logo-wrapper",
    });
    const img = createElement("img", {
      "class": "kartta-app-menu-logo",
      "src": currentLogoUrl(),
    });
    elem.appendChild(img);

    const menu = createDropDown();
    const menuPlacer = createElement("div", {
      "class": "kartta-menu-placer kartta-app-menu-hidden"
    });
    menuPlacer.appendChild(menu);
    elem.appendChild(menuPlacer);

    const fudge = 5;
    const moveListener = (e) => {
      rect = menuPlacer.getBoundingClientRect();
      if ((e.clientX > rect.right + fudge)
          || (e.clientX < rect.left - fudge)
          || (e.clientY < rect.top - fudge)
          || (e.clientY > rect.bottom + fudge)) {
          menuPlacer.classList.add("kartta-app-menu-hidden");
          document.removeEventListener('mousemove', moveListener);
      }
    };

    img.addEventListener('mouseenter', (e) => {
      menuPlacer.classList.remove("kartta-app-menu-hidden");
      document.addEventListener('mousemove', moveListener);
    });

    //appMenuPlaceholder.parentNode.insertBefore(appMenuWrapper, appMenuPlaceholder);
    appMenuPlaceholder.parentNode.insertBefore(elem, appMenuPlaceholder);
    appMenuPlaceholder.parentNode.removeChild(appMenuPlaceholder);
  }

  function writeCookie(name, value) {
    document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + "; path=/";
  }

  function readCookie(name) {
    const name_equals = encodeURIComponent(name) + "=";
    const words = document.cookie.split(';');
    for (var i = 0; i < words.length; i++) {
      let c = words[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1, c.length);
      }
      if (c.indexOf(name_equals) === 0) {
        return decodeURIComponent(c.substring(name_equals.length, c.length));
      }
    }
    return null;
  }

  function createCookieBar() {
    const outerDiv = createElement("div", {
      "class": "kartta-cookie-bar"
    });
    const leftDiv = createElement("div", {
      "class": "kartta-cookie-bar-left"
    }, "This site uses cookies from Google to deliver its services and to analyze traffic.");
    leftDiv.appendChild(createElement("a", {
      "class": "kartta-cookie-bar-learn-more-link",
      "href": "https://policies.google.com/technologies/cookies"
    }, "Learn more."));
    const rightDiv = createElement("div", {
      "class": "kartta-cookie-bar-right"
    });
    rightDiv.appendChild(createElement("a", {
      "class": "kartta-cookie-bar-ok-link",
      "href": "javascript:void(0)"
    }, "Ok, Got it."));
    rightDiv.addEventListener('click', (e) => {
      writeCookie("kartta_allow_cookies", "yes");
      // In a perfect world we would just do
      //    outerDiv.parentNode.removeChild(outerDiv);
      // here to dynamically remove the cookie bar, but instead we
      // force a page reload because some apps (e.g. editor) don't
      // correctly handle reflowing their content when an element is
      // removed.  Since the cookie is set at this point, the page
      // will be rendered without the cookie bar after reload.
      window.location.reload(false);
    });
    outerDiv.appendChild(leftDiv);
    outerDiv.appendChild(rightDiv);
    return outerDiv;
  }

  function installCookieBar() {
    const cookieBarPlaceholder = document.getElementById("kartta-app-cookie-bar");
    if (!cookieBarPlaceholder) {
      return;
    }
    if (readCookie("kartta_allow_cookies") != "yes") {
      cookieBarPlaceholder.parentNode.insertBefore(createCookieBar(), cookieBarPlaceholder);
    }
    cookieBarPlaceholder.parentNode.removeChild(cookieBarPlaceholder);
  }

  document.addEventListener("DOMContentLoaded", () => {
    installAppMenu();
    installCookieBar();
  });

})();