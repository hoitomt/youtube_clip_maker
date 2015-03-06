// This file exists because we don't have access the full HTML5 video player
// from the content script. We need to inject something into the page
// that allows us to get information about the video player.

var DummyPlayer = {
  getCurrentTime: function() {console.log("Dummy getCurrentTime"); return 0;},
  getDuration: function() {console.log("Dummy getDuration");},
  getVideoUrl: function() {console.log("Dummy getUrl"); return "http://ima.dummy.com";},
  getEmbedCode: function() {console.log("Dummy getEmbedCode");},
  playVideo: function() {console.log("Dummy playVideo");},
  pauseVideo: function() {console.log("Dummy pauseVideo");}
};

var ClippetyVideo = {
  startRecord: document.getElementById('start-record'),
  pauseRecord: document.getElementById('stop-record'),
  increaseStartTime: document.getElementById('change-start-time-up'),
  decreaseStartTime: document.getElementById('change-start-time-down'),
  increaseStopTime: document.getElementById('change-stop-time-up'),
  decreaseStopTime: document.getElementById('change-stop-time-down'),
  videoClip: {
    recording: false,
    startTime: null,
    stopTime: null
  },
  videoClips: [],
  initialize: function() {
    this.setPosition();
    this.listenForDomEvents();
  },
  player: function() {
    var p = document.getElementById('movie_player');
    if(p) {
      return p;
    } else {
      return DummyPlayer;
    }
  },
  getCurrentTime: function() {
    return this.player().getCurrentTime();
  },
  getDuration: function() {
    return this.player().getDuration();
  },
  getUrl: function() {
    return this.player().getVideoUrl();
  },
  getEmbedCode: function() {
    return this.player().getVideoEmbedCode();
  },
  playVideo: function() {
    this.player().playVideo();
  },
  pauseVideo: function() {
    this.player().pauseVideo();
  },
  addPlayerControls: function() {
    var player = document.getElementById("player-api");
    var playerControls = document.createElement("div");

    playerControls.innerHTML = '<div><p>Player Controls</p></div>';

    player.parentNode.insertBefore(playerControls, player);
  },
  showRecordButton: function() {
    this.startRecord.className = this.startRecord.className.replace("hidden", "")
  },
  hideRecordButton: function() {
    this.startRecord.className = this.startRecord.className + " hidden";
  },
  showPauseButton: function() {
    this.pauseRecord.className = this.pauseRecord.className.replace("hidden", "")
  },
  hidePauseButton: function() {
    this.pauseRecord.className = this.pauseRecord.className + " hidden";
  },
  persistVideoClip: function(videoClip) {
    var persistedVideoClip = {startTime: videoClip.startTime, stopTime: videoClip.stopTime, url: this.getUrl()}
    localStorage.setItem(this.videoClipKey(videoClip), JSON.stringify(persistedVideoClip));
  },
  videoClipKey: function(videoClip) {
    var videoId = window.location.search.replace("?v=", "");
    return "youtube_clips_" + videoId + "_" + videoClip.startTime + "_" + videoClip.stopTime;
  },
  startRecording: function() {
    console.log("Click Record");
    _.videoClip.recording = true;
    _.videoClip.startTime = _.getCurrentTime();
    _.playVideo();
    _.hideRecordButton();
    _.showPauseButton();
  },
  stopRecording: function() {
    console.log("Pause Record");
    _.videoClip.recording = false;
    _.pauseVideo();
    _.hidePauseButton();
    _.showRecordButton();
    _.videoClip.stopTime = _.getCurrentTime();
    _.persistVideoClip(_.videoClip);
  },
  setPosition: function() {
    var left = "20";
    var container = document.getElementById("player-mole-container")
    if(container) {
      var containerPosition = container.getBoundingClientRect();
      var left = container && containerPosition ? containerPosition.left : left;
    }

    var playerContainer = document.getElementById("player-controls");
    playerContainer.style.margin = "5px 0 0 " + left + "px";
  },
  listenForDomEvents: function() {
    _ = this
    this.startRecord.onclick = function(e){
      if(!_.videoClip.recording) {
        _.startRecording();
      }
    };

    this.pauseRecord.onclick = function(e){
      if(_.videoClip.recording) {
        _.stopRecording();
      }
    }
  }
};

document.addEventListener('getCurrentVideoTime', function(e) {
  var video = {
    currentTime: ClippetyVideo.getCurrentTime(),
    duration: ClippetyVideo.getDuration(),
    url: ClippetyVideo.getUrl(),
    embedCode: ClippetyVideo.getEmbedCode()
  };
  window.postMessage({type: 'currentVideoTime', text: ClippetyVideo.getCurrentTime(), video: video}, '*');
});

document.addEventListener('playVideo', function(e) {
  ClippetyVideo.playVideo();
});

document.addEventListener('pauseVideo', function(e) {
  ClippetyVideo.pauseVideo();
});

ClippetyVideo.initialize();
