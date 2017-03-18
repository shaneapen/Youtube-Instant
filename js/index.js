
/*
Optimizatons & features Required

autocompletion below search box - 
http://stackoverflow.com/questions/11275365/youtube-api-search-auto-complete
https://jqueryui.com/autocomplete/
http://codepen.io/tayfunerbilen/pen/rIHvD?editors=1010
http://shreyaschand.com/blog/2013/01/03/google-autocomplete-api/
 
*/

var myTimeout;

function youtube_parser() {
   clearTimeout( myTimeout );
   var urlBox = document.getElementById("ytUrl");
   var url = urlBox.value;
   var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
   var match = url.match(regExp);
   if (match && match[7].length == 11) {
      loadVideo(match[7]);
   } else if (urlBox.value != '') {
      // keyWordsearch();      
      myTimeout = setTimeout(keyWordsearch, 400);
   }else{
      reset();
   }
}

function loadVideo(id) {
   //checks whether the new video is same as the one already playing..
   //if so, exit function to avoid player refresh
   if (sessionStorage.currentID == id)
      return;
   sessionStorage.currentID = id;
   var video = document.getElementById("ytPlayer");
   video.setAttribute('src', "https://www.youtube.com/embed/" + id + "?autoplay=1&iv_load_policy=3&rel=0");   
}

function reset() {
   sessionStorage.clear();
   document.getElementById('ytUrl').value = "";
   document.getElementById("ytPlayer").setAttribute('src', 'http://youtube.com/embed/demo');
   document.getElementById('relatedVideos').innerHTML = "";
}

//Youtube Instant 
//AIzaSyCmh6oIkO9zVR5s7QtOeYwsZTN0lOV5OjI
function keyWordsearch() {
   gapi.client.setApiKey('AIzaSyCmh6oIkO9zVR5s7QtOeYwsZTN0lOV5OjI');
   gapi.client.load('youtube', 'v3', function() {
      console.log("API Called.")
      makeRequest();
   });
}
function makeRequest() {
   var q = document.getElementById('ytUrl').value;
   var request = gapi.client.youtube.search.list({
      q: q,
      part: 'snippet', //changed from id to snippet to get video title and thumbnail
      type: 'video',
      maxResults: 6
   });
   request.execute(function(response) {

      var srchItems = response.result.items;
      console.log("API Returned ");
      console.log(srchItems);
      loadVideo(srchItems[0].id.videoId);
      document.getElementById('relatedVideos').innerHTML = "";
      for(i=1;i<6;++i){
         document.getElementById('relatedVideos').innerHTML += "<a onclick='loadVideo(\"" + srchItems[i].id.videoId +"\")'><img class='thumbnail' title='" + srchItems[i].snippet.title + "' src='" + srchItems[i].snippet.thumbnails.medium.url+ "'/></a>";
      }

   })
}

function createGif() {
   if (sessionStorage.currentID) {
      window.open("https://gifs.com/?source=https://youtu.be/" + sessionStorage.currentID);
   } else {
      alert("No video found!");
   }
}

function downloadVideo() {
   if (sessionStorage.currentID) {
      window.open("http://keepvid.com/?url=https://youtu.be/" + sessionStorage.currentID);
   } else {
      alert("No video found");
   }
}


//ignores non alphanumeric key entry
document.onkeydown = checkKey;
function checkKey(e) {

    e = e || window.event;
   console.log(e.keyCode)

    if ((e.keyCode >=37 && e.keyCode <=40) || (e.keyCode >=173 && e.keyCode<=179)) {
      console.log('Ignored keyboard entry')
    }      

}