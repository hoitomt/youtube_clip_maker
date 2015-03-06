// Content script
// Marshals messages between _extension and _injected

var LocalStorageReader = {
  read: function() {
    var videoClips = []
    var localStorageKeys = Object.keys(localStorage)
    for(var key in localStorageKeys) {
      var videoClipKey = localStorageKeys[key]
      if((/youtube_clips/).test(videoClipKey)){
        var videoClip = localStorage.getItem(videoClipKey)
        videoClips.push(JSON.parse(videoClip));
      }
    }
    return videoClips;
  }
}

var MessageMarshaler = {
  receiveMessageFromExtension: function() {
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
      console.log("Request", request.message)
      if(!request || request.message == "") {
        return;
      }
      if(request.message == "getLocalStorage") {
        var videoClips = LocalStorageReader.read();
        sendResponse({video_clips: videoClips});
      } else {
        MessageMarshaler.sendMessageToDom(request.message);
      }
    });
  },
  sendMessageToDom: function(message) {
    document.dispatchEvent(new CustomEvent(message));
  },
  receiveMessageFromDom: function() {

    window.addEventListener("message", function(event) {
      // We only accept messages from ourselves
      if (event.source != window)
        return;

      MessageMarshaler.sendMessageToExtension(event.data)

    }, false);
  },
  sendMessageToExtension: function(data) {
    console.log("Send message back to Extension");
    chrome.runtime.sendMessage(data);
  },
}

MessageMarshaler.receiveMessageFromExtension();
MessageMarshaler.receiveMessageFromDom();