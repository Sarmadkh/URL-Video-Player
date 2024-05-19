document.getElementById('videoUrl').addEventListener('input', function() {
    playVideo();
});

document.title = "URL Video Player";

document.getElementById('videoUrl').addEventListener('input', function() {
    playVideo();
});

function playVideo() {
    var videoUrl = document.getElementById('videoUrl').value;
    var videoPlayer = document.getElementById('videoPlayer');
    var videoTitle = document.getElementById('videoTitle');
    
    if (isValidURL(videoUrl)) {
        videoPlayer.src = videoUrl;
        videoPlayer.play();
        
        var fileName = extractFileName(videoUrl);
        var showName = fileName.split(' - ')[0];
        document.title = showName;

        videoTitle.textContent = fileName;
    } else {
        alert('Please enter a valid video URL.');
    }
}


function isValidURL(url) {
    var pattern = new RegExp('^(https?:\\/\\/)?'+
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+
    '((\\d{1,3}\\.){3}\\d{1,3}))'+
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+\\[\\]]*)*'+
    '(\\?[;&a-z\\d%_.~+=-]*)?'+
    '(\\#[-a-z\\d_]*)?$','i');
    return !!pattern.test(url);
}

function extractFileName(url) {
    var urlObj = new URL(url);
    var pathSegments = urlObj.pathname.split('/');
    var fileName = pathSegments[pathSegments.length - 1];
    
    fileName = fileName.replace(/\./g, ' ');

    var seasonEpisodePattern = /(S\d{2}E\d{2})/i;
    var match = fileName.match(seasonEpisodePattern);

    var showName = "";
    var episodeNumber = "";
    var episodeName = "";

    if (match) {
        episodeNumber = match[0];
        var index = fileName.search(seasonEpisodePattern);
        showName = fileName.substring(0, index).trim();
        fileName = fileName.replace(match[0], '').trim();
    }

    var patternsToRemove = [
        /\b\d{3,4}p\b/gi,
        /\b(mp4|mkv|avi|mov|wmv|flv|mpeg|BluRay|AAC|HDTV|WEBRip|x264)\b/gi
    ];

    patternsToRemove.forEach(function(pattern) {
        var index = fileName.search(pattern);
        if (index !== -1) {
            fileName = fileName.substring(0, index).trim();
        }
    });

    var showNameIndex = fileName.toLowerCase().indexOf(showName.toLowerCase());
    if (showNameIndex !== -1) {
        episodeName = fileName.substring(showNameIndex + showName.length).trim();
    } else {
        episodeName = fileName.trim();
    }

    if (!showName && !episodeNumber) {
        return episodeName;
    }
    return showName + ' - ' + episodeNumber + ' - ' + episodeName;
}
