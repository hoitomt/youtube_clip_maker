// Content script
// Marshals messages between _extension and _injected

function listenForExtensionEvents() {
  console.log("Listening for events from the extension");
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if(request.message == "") {
      return;
    }
    document.dispatchEvent(new CustomEvent("getCurrentVideoTime"));
  });
}

function listenForDomEvents() {
  console.log("Listening for events from the dom");
  document.addEventListener("returnCurrentVideoTime", function(event){

    console.log("Document Listener - Event from DOM", event);
  });
}

listenForExtensionEvents();
listenForDomEvents();