// This file exists because we don't have access the full HTML5 video player
// from the content script. We need to inject something into the page
// that allows us to get information about the video player.

ClippetyVideo = {
  getCurrentVideoTime: function() {
    var player = document.getElementById('movie_player');
    var time = player.getCurrentTime()
    return time
  }
}

document.addEventListener('getCurrentVideoTime', function(e) {
  console.log("Get Current Video Time");
  var currentTimeEvent = new CustomEvent("returnCurrentVideoTime", {"detail": ClippetyVideo.getCurrentVideoTime()});
  document.dispatchEvent(currentTimeEvent);
});
