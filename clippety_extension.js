// Extension code
// Code Flow: _extension.js -> _content_script.js -> _injected.js
// The _injected code handles the state of the recording and persistence

var ClippetyExtension = {
  init: function() {
    _ = this;
    $('#get-saved-videos').click(function() {
      _.getLocalStorageValues();
    });
    var videoClips = this.getLocalStorageValues();
  },
  readFromLocalStorage: function() {
  },
  getLocalStorageValues: function() {
    _ = this;
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {message: "getLocalStorage"}, function(response) {
        console.log(response.video_clips);
        _.addClipsToDom(response.video_clips);
      });
    });
  },
  addClipsToDom: function(videoClips) {
    $.each(videoClips, function(i, videoClip){
      var listItem = "<li>" + videoClip.url + ": " + videoClip.startTime + "</li>";
      $('#saved-videos-list').append(listItem);
    })
  }
}

$(function(){
  ClippetyExtension.init();
});
