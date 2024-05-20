document.getElementById('videoUrl').addEventListener('input', function() {
    playVideo();
});

document.getElementById('hlsUrl').addEventListener('input', function() {
    playHlsVideo();
});

document.title = "URL Video Player";

function playVideo() {
    var videoUrl = document.getElementById('videoUrl').value;
    var videoPlayer = document.getElementById('videoPlayer');
    var videoTitle = document.getElementById('videoTitle');

    videoPlayer.src = videoUrl;
    videoPlayer.play();

    var fileName = extractFileName(videoUrl);
    var showName = fileName.split(' - ')[0];
    document.title = showName || fileName;

    videoTitle.textContent = fileName;
}

function playHlsVideo() {
    var hlsUrl = document.getElementById('hlsUrl').value;
    var videoPlayer = document.getElementById('videoPlayer');
    var videoTitle = document.getElementById('videoTitle');

    if (Hls.isSupported()) {
        var hls = new Hls();
        hls.loadSource(hlsUrl);
        hls.attachMedia(videoPlayer);
        hls.on(Hls.Events.MANIFEST_PARSED, function() {
            videoPlayer.play();
        });
    } else if (videoPlayer.canPlayType('application/vnd.apple.mpegurl')) {
        videoPlayer.src = hlsUrl;
        videoPlayer.play();
    }

    var fileName = extractFileName(hlsUrl);
    var showName = fileName.split(' - ')[0];
    document.title = showName || fileName;

    videoTitle.textContent = fileName;
}

function extractFileName(url) {
    var urlObj = new URL(decodeURIComponent(url));
    var pathSegments = urlObj.pathname.split('/');
    var fileName = pathSegments[pathSegments.length - 1];

    fileName = fileName.replace(/\./g, ' ');
    fileName = fileName.replace(/%20/g, ' '); // Replace %20 with space

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
        /\b(mp4|mkv|avi|mov|wmv|flv|mpeg|BluRay|AAC|WEBRip|x264)\b/gi
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

