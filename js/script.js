// code from chatgpt because js is sorta hard and its 2AM, might rewrite it myself later.
const audio = document.getElementById("ostplayer");
const playImg = document.getElementById("playbutton");
const soundImg = document.getElementById("soundbutton");
const entrance = document.getElementById("entrance");
const door = document.getElementById("doorbutton");
const musicIcon = document.getElementById("musiccion");

let isPlaying = false;
let isMuted = false;
let userInteracted = false;
let wasPlayingBeforeHide = false;

door.addEventListener("click", () => {
  userInteracted = true;
  startPlaybackWithFade();
  door.src = "./images/dooropened.webp";
  setTimeout(enteringDone, 1000);
});

function startPlaybackWithFade() {
  audio.muted = false;
  audio.volume = 0;

  const fadeDuration = 3000;
  const startTime = performance.now();

  const playPromise = audio.play();
  if (playPromise !== undefined) {
    playPromise.then(() => {
      function fadeInVolume(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / fadeDuration, 1);
        audio.volume = progress;
        if (progress < 0.5) {
          requestAnimationFrame(fadeInVolume);
        }
      }
      requestAnimationFrame(fadeInVolume);
      setPlayingUI(true);
    }).catch(err => {
      console.error("Playback failed:", err);
    });
  }
}

function enteringDone() {
  entrance.classList.add("hidden");
  setTimeout(() => {
    entrance.remove();
  }, 3000);
}

audio.addEventListener("timeupdate", () => {
  const current = Math.floor(audio.currentTime);
  const minutes = Math.floor(current / 60);
  const seconds = current % 60;
  const formatted = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  musicIcon.title = `bugcore - lilac boy (${formatted})`;
});

window.addEventListener("load", () => {
  audio.pause();
  audio.currentTime = 0;
  setPlayingUI(false);
});

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    wasPlayingBeforeHide = !audio.paused;
    audio.pause();
    setPlayingUI(false);
  } else {
    if (userInteracted && wasPlayingBeforeHide && !isMuted) {
      audio.play().then(() => {
        setPlayingUI(true);
      }).catch(err => {
        console.log("Playback blocked on refocus:", err);
      });
    }
  }
});

playImg.addEventListener("click", () => {
  userInteracted = true;
  if (!audio.paused) {
    audio.pause();
    setPlayingUI(false);
  } else {
    audio.play().then(() => {
      setPlayingUI(true);
    }).catch(err => {
      console.error("Playback failed:", err);
    });
  }
});

soundImg.addEventListener("click", () => {
  isMuted = !isMuted;
  audio.muted = isMuted;
  soundImg.src = isMuted ? "./images/mute.webp" : "./images/sound.webp";

  if (isMuted) {
    if (!audio.paused) {
      audio.pause();
      setPlayingUI(false);
    }
  } else {
    if (userInteracted && audio.paused && !document.hidden) {
      audio.play().then(() => setPlayingUI(true))
        .catch(err => console.error("Playback failed:", err));
    }
  }
});

function setPlayingUI(playing) {
  isPlaying = playing;
  playImg.src = playing ? "./images/pause.webp" : "./images/play.webp";
  musicIcon.src = playing ? "./images/music.webp" : "./images/music2.webp";
}

const firefoxElement = document.getElementById("firefox");
const linuxElement = document.getElementById("linux");

const ua = navigator.userAgent.toLowerCase();
const platform = navigator.platform.toLowerCase();

const isFirefox = ua.includes("firefox");
const isLinux = platform.includes("linux");

firefoxElement.textContent = isFirefox ? "> thanks for using firefox." : "> switch to firefox...";
linuxElement.textContent   = isLinux   ? "> thanks for using linux."   : "> switch to linux...";
