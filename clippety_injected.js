// This file exists because we don't have access the full HTML5 video player
// from the content script. We need to inject something into the page
// that allows us to get information about the video player.

var DummyPlayer = {
  getCurrentTime: function() {console.log("Dummy getCurrentTime");},
  getDuration: function() {console.log("Dummy getDuration");},
  getUrl: function() {console.log("Dummy getUrl");},
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
  listenForDomEvents: function() {
    _ = this
    this.startRecord.onclick = function(e){
      console.log("Click Record");
      if(!_.videoClip.recording) {
        _.videoClip.recording = true;
        _.getCurrentTime();
        _.playVideo();
        _.hideRecordButton();
        _.showPauseButton();
      }
    };

    this.pauseRecord.onclick = function(e){
      console.log("Pause Record");
      if(_.videoClip.recording) {
        _.videoClip.recording = false;
        _.pauseVideo();
        _.getCurrentTime();
        _.hidePauseButton();
        _.showRecordButton();
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
