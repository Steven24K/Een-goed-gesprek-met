const playIconContainer = document.getElementById('play-icon');
const audio = document.getElementById('audio-1');
const progressBar = document.getElementById('seek-slider');
const currentTime = document.getElementById('current-time');
const durationTime = document.getElementById('duration');

let playState = 'play';

playIconContainer.addEventListener('click', () => {
    if(playState === 'play') {
        audio.play();
        playState = 'pause';
        playIconContainer.innerText = "Pause";
    } else {
        audio.pause();
        playState = 'play';
        playIconContainer.innerText = "Play";

    }
});

function progressValue() {
    progressBar.max = audio.duration;
    progressBar.value = audio.currentTime;

    currentTime.textContent = formatTime(audio.currentTime);
    durationTime.textContent = formatTime(audio.duration);
}

setInterval(progressValue, 500);

function formatTime(sec) {
    let minutes = Math.floor(sec / 60);
    let seconds = Math.floor(sec - minutes * 60);
    if (isNaN(minutes)) minutes = 0
    if (isNaN(seconds)) seconds = 0
    if (seconds < 10) {
        seconds = `0${seconds}`;
    }
    return `${minutes}:${seconds}`;
}

function changeProgressBar() {
    audio.currentTime = progressBar.value;
}

progressBar.addEventListener("click", changeProgressBar);

async function get_podcasts_from_feed() {
    let res = await fetch('https://stevenkoerts.nl/Een-goed-gesprek-met/feed.rss')
        .then(response => response.text())
        .then(xml => {
            let parser = new DOMParser();
            let xmlDoc = parser.parseFromString(xml, "text/xml");
            return xmlDoc;
        });

    let items = res.getElementsByTagName('item');
    let podcasts = [];

    for (let c = 0; c < items.length; c++) {
        let p = items[c];
        let podcast = {
            title: p.getElementsByTagName('title')[0].innerHTML,
            date: p.getElementsByTagName('pubDate')[0].innerHTML,
            description: p.getElementsByTagName('description')[0].innerHTML,
            file: p.getElementsByTagName('enclosure')[0].getAttribute('url'),
        }
        podcasts.push(podcast);
    }

    return podcasts;

}

function mkPodcastMarkup(file, title, id) {
    let li = document.createElement('li');
    let div = document.createElement('div');
    let audio = document.createElement('audio');
    let p = document.createElement('p');
    let button = document.createElement('button');
    let span_current_time = document.createElement('span');
    let input_slider = document.createElement('input');
    let span_duration = document.createElement('span');


    audio.id = `audio-${id}`;
    audio.src = file;
    audio.preload="metadata";
    audio.loop = true;

    p.innerText = title;

    button.className = 'play-icon';
    button.id = `play-icon-${id}`;

    span_current_time.id = `current-time-${id}`;
    span_current_time.className = 'time';
    span_current_time.innerText = "0:00";

    input_slider.id = 'seek-slider';
    input_slider.type = 'range'; 
    input_slider.max = "100"; 
    input_slider.min = "0"; 
    input_slider.value = '0';

    span_duration.id = `duration-${id}`;
    span_duration.className = 'time'; 
    span_duration.innerText = '0:00';


    div.className = "audio-player";
    div.id = `audio-player-container-${id}`;
    div.appendChild(audio);
    div.appendChild(p);
    div.appendChild(button);
    div.appendChild(span_current_time);
    div.appendChild(input_slider);
    div.appendChild(span_duration);

}


window.addEventListener('load', async () => {
    let p = await get_podcasts_from_feed();
    console.log(p);
})