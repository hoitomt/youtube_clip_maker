function getUrl(resource) {
  if((/localhost/).test(window.location.host)) {
    return "../" + resource;
  } else {
    return chrome.extension.getURL(resource)
  }
}

function injectResource(scriptFile) {
  var script = document.createElement('script');

  script.type = 'text/javascript';
  script.src = getUrl(scriptFile);

  var entry = document.getElementsByTagName('script')[0];
  entry.parentNode.insertBefore(script, entry);
}

function injectCss(cssFile) {
  var cssFileUrl = getUrl(cssFile);

  var link = document.createElement('link');
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = cssFileUrl

  var entry = document.getElementsByTagName('script')[0];
  entry.parentNode.insertBefore(link, entry);
}

// Must be used in conjunction with an xhr request
function addHtmlToDom() {
  html = this.responseText;

  var elem = document.createElement("div");
  elem.id = 'video-clip-maker';
  elem.innerHTML = html;

  var container = document.getElementById("player");
  container.parentNode.insertBefore(elem, container);
}

function injectHtml(htmlFile) {
  var html = getUrl(htmlFile);
  var xhr = new XMLHttpRequest();
  xhr.onload = addHtmlToDom;

  xhr.open('GET', html, true);
  xhr.send();
}

injectCss('injected.css');
injectHtml('player_controls.html');
injectResource('clippety_injected.js');
