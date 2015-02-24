function injectResource(scriptFile) {
  var script = document.createElement('script');

  script.type = 'text/javascript';
  script.src = chrome.extension.getURL(scriptFile);

  var entry = document.getElementsByTagName('script')[0];
  entry.parentNode.insertBefore(script, entry);
}

injectResource('jquery-2.1.3.min.js');
injectResource('clippety_injected.js');