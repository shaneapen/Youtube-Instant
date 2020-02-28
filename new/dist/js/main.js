/*
    Youtube Instant by codegena.com
    Written by Shan Eapen Koshy
    Please report errors/suggestions to shaneapen@gmail.com
*/

var myTimeout;

function youtube_parser() {
    clearTimeout(myTimeout);
    var urlBox = document.getElementById("ytUrl");
    var url = urlBox.value;
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    var match = url.match(regExp);
    if (match && match[7].length == 11) {
        loadVideo(match[7]);
    } else if (urlBox.value != '') {
        myTimeout = setTimeout(searchKeyword, 400);
    }
}

function loadVideo(id) {
    //checks whether the new video is same as the one already playing..
    //if so, exit function to avoid player refresh
    document.getElementById('error-card').classList.add('hidden');
    if (sessionStorage.currentID == id) return;
    sessionStorage.currentID = id;
    var video = document.getElementById("ytPlayer");
    video.setAttribute('src', "https://www.youtube.com/embed/" + id + "?autoplay=1&iv_load_policy=3&rel=0");
}

function searchKeyword() {
    gapi.client.setApiKey('AIzaSyCmh6oIkO9zVR5s7QtOeYwsZTN0lOV5OjI');
    gapi.client.load('youtube', 'v3', function () {
        makeRequest();
    });
}

function makeRequest() {
    var q = document.getElementById('ytUrl').value;
    var request = gapi.client.youtube.search.list({
        q: q,
        part: 'snippet',
        type: 'video',
        maxResults: 4
    });
    request.execute(function (response) {

        if (response.code > 300) {
            document.getElementById('error-card').classList.remove('hidden');
        } else {
            var srchItems = response.result.items;
            
            loadVideo(srchItems[0].id.videoId);

            for (i = 1; i < 4; ++i) {
                document.querySelectorAll('img.yt-suggest')[i - 1].src = srchItems[i].snippet.thumbnails.high.url;
                document.querySelectorAll('p.yt-suggest-title')[i - 1].textContent = srchItems[i].snippet.title;
                document.querySelectorAll('a.yt-suggest-channel')[i - 1].textContent = srchItems[i].snippet.channelTitle;
                document.querySelectorAll('a.yt-suggest-channel')[i - 1].href = "https://youtube.com/channel/" + srchItems[i].snippet.channelId;
                document.querySelectorAll('img.yt-suggest')[i - 1].classList.remove('hidden');
                document.querySelectorAll('svg.rounded-top')[i - 1].classList.add('hidden');
            }

            document.addEventListener('click', function (event) {

                if (event.target.matches('#btn1')) {
                    loadVideo(srchItems[1].id.videoId);
                } else if (event.target.matches('#btn2')) {
                    loadVideo(srchItems[2].id.videoId);
                } else if (event.target.matches('#btn3')) {
                    loadVideo(srchItems[3].id.videoId);
                } else {
                    event.preventDefault();
                }
            }, false);
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

function randomVideo(){
    var videos = ['fyAXhMU-fbc','4faq9L15y60','rhL3I-IOFvo','MqrsrgXDxX4','LbONZIRXnYM','JPQNm2d3QIQ','ZfPk_cEiT0w','JZdeqUl-5Dc','54XNkKUQkW8','XUuL5ksxPT0','2I1ZU5g1QNo','GB_S2qFh5lU','7xEjr39yYuo','Q1I3kwHhoUU','jOAoQO9UOHs','EgBJmlPo8Xw','TZP885KZCtQ','Ie2Xv2dD1Bg','MgdG91aCsPU','LZyybvVx-js','LGD7oUwoVNY','GbpNM2zsP50','kTWoeqPXpuo','CIrowsD7QBk','12o3Zgupu_8','NkQF5CLdqow','LAq_AL9TXOc','YucNRt9eLBs','oW89KaA1OVk','P0k4_VVoC_E',];
    loadVideo(videos[Math.floor(Math.random() * videos.length)]);
}

//ignores non alphanumeric key entry
document.onkeydown = checkKey;

function checkKey(e) {
    e = e || window.event;
    if ((e.keyCode >= 37 && e.keyCode <= 40) || (e.keyCode >= 173 && e.keyCode <= 179)) {
        console.log('Ignored keyboard entry')
    }
}