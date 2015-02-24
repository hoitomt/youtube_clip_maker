// Extension code
// Code Flow: _extension -> _content_script -> _injected.js
// The _injected code handles the state of the recording and persistence

var ClippetyExtension = {
  recording: false,
  startTime: null,
  stopTime: null,
  init: function() {
    this.listenForEvents()
    this.sendMessage({greeting: "Hello Good Buddy"}, function(response){
      $("#status").html(response.farewell);
    });
  },
  listenForEvents: function() {
    _ = this;
    $("#toggle-recording").click(function(){
      if(_.recording) {
        _.stopRecording();
        _.setStatusMessage("Start Recording");
      } else {
        _.startRecording();
        _.setStatusMessage("Stop Recording");
      }
    });
  },
  startRecording: function() {
    _ = this
    var callback = function(response){
      console.log(response.farewell);
      $("#status").html(response.farewell)
      $('#start-time').html(response.currentTime);
      _.recording = true;
    };
    this.getRemoteVideoCurrentTime({greeting: "Hello Good Buddy"}, callback)
  },
  stopRecording: function() {
    this.stopTime = this.moviePlayer().getCurrentTime();
    $('#stop-time').html(this.stopTime);
    this.recording = false;
  },
  setStatusMessage: function(msg) {
    $('#toggle-recording').html(msg)
  },
  getRemoteVideoCurrentTime: function(msgObj, callback) {
    $("#status").html("Send Message")
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, msgObj, callback);
    });
    // chrome.tabs.executeScript({
    //   code: 'document.getElementById("movie_player").getCurrentTime()';
    // });
  }
}

$(function(){
  $("#status").html("Init ClippetyExtension")
  ClippetyExtension.init()
});
