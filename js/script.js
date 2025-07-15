// code from chatgpt because js is sorta hard and its 2AM, might rewrite it myself later.
const audio = document.getElementById("ostplayer");
const playImg = document.getElementById("playbutton");
const soundImg = document.getElementById("soundbutton");
const entrance = document.getElementById("entrance");
const door = document.getElementById("doorbutton");
const musicIcon = document.getElementById("musiccion");

let isPlaying = true;
let isMuted = false;

door.addEventListener("click", () => {
  audio.play().then(() => {
    door.src = "./images/dooropened.webp";
    setTimeout(entering, 1000)
  }).catch(err => {
    console.error("Playback failed:", err);
  });
});

function entering() {
  audio.muted = false;
  audio.volume = 0;

  const fadeDuration = 3000;
  const startTime = performance.now();

  const playPromise = audio.play();

  if (playPromise !== undefined) {
    playPromise.then(() => {
      function fadeInVolume(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / fadeDuration, 0.25);
        audio.volume = progress;

        if (progress < 1) {
          requestAnimationFrame(fadeInVolume);
        }
      }

      requestAnimationFrame(fadeInVolume);
    }).catch((err) => {
      console.error("Audio playback blocked or failed:", err);
    });
  }

  entrance.classList.add("hidden");

  setTimeout(() => {
    entrance.remove();
  }, fadeDuration);

  isPlaying = true;
  playImg.src = "./images/pause.webp";
}

audio.addEventListener("timeupdate", () => {
  const current = Math.floor(audio.currentTime);
  const minutes = Math.floor(current / 60);
  const seconds = current % 60;
  const formatted = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  musicIcon.title = `bugcore - lilac boy (${formatted})`;
});

window.addEventListener("load", () => {
  audio.play().catch(err => {
    console.log("Autoplay blocked:", err);
  });
});

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    audio.pause();
    isPlaying = false;
    playImg.src = "./images/play.webp";
    musicIcon.src = "./images/music2.webp";
  } else if (!isMuted) {
    audio.play();
    isPlaying = true;
    playImg.src = "./images/pause.webp";
    musicIcon.src = "./images/music.webp";
  }
});

playImg.addEventListener("click", () => {
  if (isPlaying) {
    audio.pause();
    playImg.src = "./images/play.webp";
    musicIcon.src = "./images/music2.webp";
  } else {
    audio.play();
    playImg.src = "./images/pause.webp";
    musicIcon.src = "./images/music.webp";
  }
  isPlaying = !isPlaying;
});

soundImg.addEventListener("click", () => {
  isMuted = !isMuted;
  audio.muted = isMuted;
  soundImg.src = isMuted ? "./images/mute.webp" : "./images/sound.webp";

  if (isMuted) {
    audio.pause();
    isPlaying = false;
    playImg.src = "./images/play.webp";
    musicIcon.src = "./images/music2.webp";
  } else if (!document.hidden) {
    audio.play();
    isPlaying = true;
    playImg.src = "./images/pause.webp";
    musicIcon.src = "./images/music.webp";
  }
});

// check browser and os

const firefoxElement = document.getElementById("firefox");
const linuxElement = document.getElementById("linux");

const ua = navigator.userAgent.toLowerCase();
const platform = navigator.platform.toLowerCase();

const isFirefox = ua.includes("firefox");
const isLinux = platform.includes("linux");

if (isFirefox) {
  firefoxElement.textContent = "> thanks for using firefox.";
} else {
  firefoxElement.textContent = "> switch to firefox...";
}

if (isLinux) {
  linuxElement.textContent = "> thanks for using linux.";
} else {
  linuxElement.textContent = "> switch to linux...";
}
