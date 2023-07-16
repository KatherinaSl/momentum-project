// пункт 8 переводятся настройки приложения. 
// При переключении языка приложения в настройках, язык настроек тоже меняется +3

// пункт 7 можно запустить и остановить проигрывания трека кликом по кнопке Play/Pause 
// рядом с ним в плейлисте +3

// пункт 4 выводится уведомление об ошибке при вводе некорректных значений, для которых API 
// не возвращает погоду (пустая строка или бессмысленный набор символов) +5


const body = document.querySelector('body');
let randomNum = getRandomNum(1, 20);

let lang = localStorage.getItem('lang')
if (lang === null) {
    lang = navigator.language.slice(0, 2)
}

if (lang === 'be') {
    document.getElementById('language-toggle').checked = false
} else {
    document.getElementById('language-toggle').checked = true
}


// changing language

document.getElementById('language-toggle').addEventListener('click', (event) => {
    if (event.target.checked === true) {
        lang = "en"
    } else {
        lang = "be"
    }

    localStorage.setItem('lang', lang)
    location.reload()
})

// time and calendar

function showTime() {
    const date = new Date();
    let currentTime = date.toLocaleTimeString(('en-GB'));
    let time = document.querySelector('.time')
    time.textContent = currentTime;

    setTimeout(showTime, 1000);

}
showTime()

function showDate() {
    const date = new Date();
    let options = { weekday: 'long', month: 'long', day: 'numeric', timeZone: 'UTC' };
    let currentDate = date.toLocaleDateString(lang, options);
    let dateTime = document.querySelector('.date');
    dateTime.textContent = currentDate;
}
showDate()

// welcome text
let translations = {
    morning: {
        be: 'Добрай раніцы',
        en: 'Good morning'
    },
    afternoon: {
        be: 'Добры дзень',
        en: 'Good afternoon'
    },
    evening: {
        be: 'Добры вечар',
        en: 'Good evening',
    },
    night: {
        be: 'Дабранач',
        en: 'Good night',
    },
    winds: {
        be: 'Хуткасць паветра',
        en: 'Wind speed',
    },
    humidity: {
        be: 'Вільготнасць',
        en: 'Humidity',
    },

};

const timeOfDay = getTimeOfDay();

function showGreeting(lang) {
    let timeOfDay = getTimeOfDay();
    let text = translations[timeOfDay][lang];
    let greeting = document.querySelector('.greeting');
    greeting.textContent = text;
}
showGreeting(lang)

let placeholderText = {
    be: "[Увядзіце імя]",
    en: "[Enter name]",
}


document.querySelector('.name').placeholder = placeholderText[lang]

function getTimeOfDay() {
    const date = new Date();
    let hours = date.getHours();

    if (6 <= hours && hours < 12) {
        return "morning"
    }
    if (12 <= hours && hours < 18) {
        return "afternoon"
    }
    if (18 <= hours && hours < 24) {
        return "evening"
    }
    if (0 <= hours && hours < 6) {
        return "night"
    }
}

// say my name

// перед перезагрузкой или закрытием страницы (событие beforeunload) 
// данные нужно сохранить
function setLocalStorageName() {
    localStorage.setItem('username', document.querySelector('.name').value);
}
window.addEventListener('beforeunload', setLocalStorageName)

// перед загрузкой страницы (событие load) данные нужно восстановить и отобразить
function loadLocalStorageName() {
    let nameFromLocalStorage = localStorage.getItem('username');

    if (nameFromLocalStorage !== null) {
        document.querySelector('.name').value = nameFromLocalStorage;
    }
}
window.addEventListener('load', loadLocalStorageName)


// slider

function getRandomNum(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function setBg() {
    const img = new Image();
    let bgNum = randomNum.toString().padStart(2, "0");
    let imgUrl = "https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/" + timeOfDay + "/" + bgNum + ".jpg";
    img.src = imgUrl;
    img.onload = () => {
        body.style.backgroundImage = "url('https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/" + timeOfDay + "/" + bgNum + ".jpg')"
    };
}

function getSlideNext() {
    randomNum++
    if (randomNum > 20) {
        randomNum = 1;
    }
    setBg()
}

function getSlidePrev() {
    randomNum--
    if (randomNum < 1) {
        randomNum = 20;
    }
    setBg()
}

document.querySelector('.slide-next').addEventListener('click', getSlideNext)
document.querySelector('.slide-prev').addEventListener('click', getSlidePrev)


// weather widget

const city = document.querySelector('.city');

async function getWeather(city, localeCode) {
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&lang=${localeCode}&appid=1f0d1c1a2b49143eb83d6dbc29b9e6b1&units=metric`;
    const res = await fetch(url);
    const data = await res.json();

    weatherIcon.className = 'weather-icon owf';
    weatherIcon.classList.add(`owf-${data.weather[0].id}`);
    temperature.textContent = `${data.main.temp.toFixed(0)}°C`;
    weatherDescription.textContent = data.weather[0].description;

    wind.textContent = `${translations.winds[localeCode]} : ${data.wind.speed.toFixed(0)}m/s`;
    humidity.textContent = `${translations.humidity[localeCode]}: ${data.main.humidity.toFixed(0)}%`;
}

const weatherIcon = document.querySelector('.weather-icon');
const temperature = document.querySelector('.temperature');
const weatherDescription = document.querySelector('.weather-description');
const wind = document.querySelector('.wind');
const humidity = document.querySelector('.humidity')


document.querySelector('.city').addEventListener('change', (event) => {
    if (event.type === 'change') {
        let cityStr = event.target.value
        getWeather(cityStr, lang);
        event.target.blur();
    }
})

getWeather('Minsk', lang)

function setLocalStorageCity() {
    localStorage.setItem('city', document.querySelector('.city').value);
}
window.addEventListener('beforeunload', setLocalStorageCity)


function loadLocalStorageCity() {
    let cityFromLocalStorage = localStorage.getItem('city');

    if (cityFromLocalStorage !== null) {
        document.querySelector('.city').value = cityFromLocalStorage;
    }
}
window.addEventListener('load', loadLocalStorageCity)

let cityFromLocalStorage = localStorage.getItem('city');
getWeather(cityFromLocalStorage === null ? 'Minsk' : cityFromLocalStorage, lang)



// quotes  of the Day
async function getQuotes() {
    const quotes = 'data.json';
    const res = await fetch(quotes);
    const data = await res.json();
    let quotesLength = data[lang].length

    let i = getRandomNum(0, quotesLength - 1)
    document.querySelector('.quote').textContent = data[lang][i].text
    document.querySelector('.author').textContent = data[lang][i].author

}

getQuotes()

document.querySelector('.change-quote').addEventListener('click', getQuotes)


// audio player

const audio = new Audio();
let isPlaying = false;  /*флаг */
let playNum = 0;
audio.src = playList[playNum].src;

let progressBar = document.querySelector('.progress-bar');
let currentTime = document.querySelector('.current-time')
let songDuration = document.querySelector('.duration')


audio.currentTime = 0;   /*аудиотрек при каждом запуске функции playAudio() будет проигрываться с начала*/
// проигрывание трека
function playAudio() {
    if (!isPlaying) {
        audio.play();
        isPlaying = true;

        currentTime.innerHTML = '00:00';

        // progress player
        setTimeout(() => {
            progressBar.max = audio.duration;
            songDuration.innerHTML = formatTime(audio.duration);
        }, 300)

        // progress bar
        setInterval(() => {
            progressBar.value = audio.currentTime
            currentTime.innerHTML = formatTime(audio.currentTime)
        }, 500)

        // name of playing track
        document.querySelector('.song-title').innerHTML = playList[playNum].title

        // mute button
        document.querySelector('.fa').addEventListener('click', () => {
            audio.muted = !audio.muted;
        })

        selectedTrack()

    } else {
        isPlaying = false;
        audio.pause();
    }
}

// jump in time
progressBar.addEventListener('click', (event) => {
    audio.currentTime = progressBar.value
})

function selectedTrack() {
    for (let playItem of document.querySelectorAll('.play-item')) {
        console.log(playList[playNum].title + " " + playItem.textContent)
        if (playList[playNum].title === playItem.textContent) {
            playItem.classList.add('active-play-item')
        } else {
            playItem.classList.remove('active-play-item')
        }
    }

}

const formatTime = (time) => {
    let min = Math.floor(time / 60);
    if (min < 10) {
        min = `0${min}`;
    }
    let sec = Math.floor(time % 60);
    if (sec < 10) {
        sec = `0${sec}`;
    }
    return `${min} : ${sec}`
}


// изменение кнопки
function toggleBtn() {
    document.querySelector('.play').classList.toggle('pause');
    playAudio()
}
document.querySelector('.play').addEventListener('click', toggleBtn);


function playNext() {
    playNum++
    if (playNum > 3) {
        playNum = 0

    }
    audio.src = playList[playNum].src;

    isPlaying = false;
    playAudio();

    document.querySelector('.play').classList.add('pause');
}

function playPrev() {
    playNum--
    if (playNum < 1) {
        playNum = 3
    }
    audio.src = playList[playNum].src;
    isPlaying = false;
    playAudio();

    document.querySelector('.play').classList.add('pause');
}

document.querySelector('.play-next').addEventListener('click', playNext)
document.querySelector('.play-next').addEventListener('click', selectedTrack)
document.querySelector('.play-prev').addEventListener('click', playPrev)
document.querySelector('.play-prev').addEventListener('click', selectedTrack)

import playList from './playList.js';

// create playlist
for (let i = 0; i < playList.length; i++) {
    let li = document.createElement('li');
    li.classList.add('play-item');
    li.textContent = playList[i].title;
    document.querySelector('.play-list').append(li);
}


// volume change
document.querySelector('.volume-bar').addEventListener('click', (event) => {
    audio.volume = event.target.value / 100
})
