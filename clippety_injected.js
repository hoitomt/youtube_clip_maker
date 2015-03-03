// This file exists because we don't have access the full HTML5 video player
// from the content script. We need to inject something into the page
// that allows us to get information about the video player.

ClippetyVideo = {
  player: document.getElementById('movie_player'),
  getCurrentTime: function() {
    return this.player.getCurrentTime();
  },
  getDuration: function() {
    return this.player.getDuration();
  },
  getUrl: function() {
    return this.player.getVideoUrl();
  },
  getEmbedCode: function() {
    return this.player.getVideoEmbedCode();
  },
  playVideo: function() {
    this.player.playVideo();
  },
  pauseVideo: function() {
    this.player.pauseVideo();
  },
  addPlayerControls: function() {
    var player = document.getElementById("player-api");
    var playerControls = document.createElement("div");

    playerControls.innerHTML = '<div><p>Player Controls</p></div>';

    player.parentNode.insertBefore(playerControls, player);
  }
}

function listenForVideoControlEvents() {
  var startRecord = document.getElementById('start-record')
  startRecord.onclick = function(e){
    console.log("clickc");
  }
}

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

listenForVideoControlEvents();
