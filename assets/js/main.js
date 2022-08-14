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