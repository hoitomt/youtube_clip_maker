// Extension code
// Code Flow: _extension.js -> _content_script.js -> _injected.js
// The _injected code handles the state of the recording and persistence

var ClippetyExtension = {
  recording: false,
  startTime: null,
  stopTime: null,
  videoUrl: null,
  videoEmbedCode: null,
  videoDuration: null,
  init: function() {
    this.listenForEvents();
    this.receiveRemoteVideoCurrentTime();
  },
  listenForEvents: function() {
    _ = this;
    $("#toggle-recording").click(function(){
      if(_.recording) {
        $(this).html("Start Recording");
        _.stopRecording();
      } else {
        $(this).html("Stop Recording");
        _.startRecording();
      }
    });
  },
  startRecording: function() {
    _ = this
    _.recording = true;
    _.playVideo();
    _.getRemoteVideoCurrentTime({message: "getCurrentVideoTime"});
  },
  stopRecording: function() {
    _ = this
    _.recording = false;
    _.pauseVideo();
    _.getRemoteVideoCurrentTime({message: "getCurrentVideoTime"})
  },
  setStatusMessage: function() {
    var msg = "";
    if(this.recording) {
      msg = "Recording...";
    } else {
      msg = "Not Recording";
    }
    $('#status').html(msg)
  },
  setStartTime: function(startTime) {
    $('#start-time').html(startTime);
    $('#stop-time').html(null);
  },
  setStopTime: function(stopTime) {
    $('#stop-time').html(stopTime);
  },
  updateVideoMetrics: function(videoData) {
    _ = this;
    _.videoUrl = videoData.url;
    _.videoEmbedCode = videoData.embedCode;
    _.videoDuration = videoData.duration;
    if(_.recording) {
      _.startTime = videoData.currentTime;
      _.setStartTime(videoData.currentTime);
    } else {
      _.stopTime = videoData.currentTime;
      _.setStopTime(videoData.currentTime);
    }
  },
  getRemoteVideoCurrentTime: function(msgObj) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, msgObj);
    });
  },
  playVideo: function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {message: "playVideo"});
    });
  },
  pauseVideo: function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {message: "pauseVideo"});
    });
  },
  receiveRemoteVideoCurrentTime: function() {
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
      ClippetyExtension.setStatusMessage();
      ClippetyExtension.updateVideoMetrics(request.video);
    });
  }
}

$(function(){
  $("#status").html("Init ClippetyExtension")
  ClippetyExtension.init()
});
