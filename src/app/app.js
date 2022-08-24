const btnStart = document.querySelector(".start"),
      screens = document.querySelectorAll(".screen"),
      btnsChoose = document.querySelectorAll(".choose-list"),
      timeLeft = document.querySelector("#time"),
      board = document.querySelector(".board"),
      btnsSec = document.querySelectorAll(".time-btn"),
      btnsSkill = document.querySelectorAll(".skill-btn"),
      btnMusic = document.querySelector(".music"),
      btnSound = document.querySelector(".sound"),
      btnsEffect = document.querySelector(".button-wrapper");

const back = new Audio('../../public/audio/back.mp3');
back.volume = 0.3;

let time = 0;
let score = 0;
let totalShoots = 0;
let skill = 0;
let music = null;
let sound = null

localStorage.getItem("music") ? music = !!+localStorage.getItem("music") : music = true;
if (music) {
    btnMusic.classList.add("active");
}
localStorage.getItem("sound") ? sound = !!+localStorage.getItem("sound") : sound = true;

if (sound) {
    btnSound.classList.add("active")
}




btnsEffect.addEventListener("click", (e) => {
    if (e.target && e.target.classList.contains("music") ) {
        music = musicCondition(music, "music",  e)

        if (music && screens[1].classList.contains("up")) {
            back.play();
        }
        if (!music) {
            back.pause();
        }
    }
    if (e.target &&  e.target.classList.contains("sound")) {
        sound = musicCondition(sound, "sound",  e)
    }
})

function musicCondition(elem, type, e) {
    if (elem) {
        elem = false;
        localStorage.setItem(type, 0);
        e.target.classList.remove("active");
    } else if (!elem) {
        elem = true;
        localStorage.setItem(type, 1);
        e.target.classList.add("active");
    }

    return elem;
}


document.addEventListener("click", (e) => {
    if (e.target && e.target.getAttribute("data-game") == "start") {
        if (!screens[0].classList.contains("up")) {
            screens[0].classList.add("up");
        } else {
            btnsSec.forEach(sec => sec.classList.remove("active"));
            btnsSkill.forEach(skill => skill.classList.remove("active"));
            screens[1].classList.remove("up");
            score = 0;
            totalShoots = 0;
            skill = 0;
            time = 0;
            back.pause();
        }
        
    }
    if (e.target && e.target.getAttribute("data-game") == "reload") {
        totalShoots = 0;
        score = 0
        startGame(time);
    }
    
})

btnsChoose.forEach(btn => 
    btn.addEventListener("click", (e) => {
        if (e && e.target.classList.contains("time-btn")) {
            time = +e.target.getAttribute("data-time");
            btnsSec.forEach(sec => sec.classList.remove("active"));
            e.target.classList.add("active");
        }

        if (e && e.target.classList.contains("skill-btn")) {
            skill = +e.target.getAttribute("data-skill");
            btnsSkill.forEach(skill => skill.classList.remove("active"));
            e.target.classList.add("active");
        }

        if (time && skill) {
            screens[1].classList.add("up");
            startGame(time);
        }
    }) 
)

board.addEventListener("click", (e) => {
    if (e && e.target.classList.contains("circle")) {
        score++;
        e.target.remove();
        createNewCircle();
    }
    if (sound && !timeLeft.parentNode.classList.contains("hide")) {
        const shoot = new Audio('../../public/audio/shoot.mp3');
        shoot.play();
    }
    totalShoots++;
})

function startGame(timer) {
    if (music) {
        back.play();
    }
    
    if (timeLeft.parentNode.classList.contains("hide")) {
        timeLeft.parentNode.classList.remove("hide");
    }
    board.innerHTML = ``;
    renderTime(timer);
    changeTime(timer);
    createNewCircle();
}


function changeTime(timer) {
    const idInterval = setInterval(() => { 
        --timer;
        renderTime(timer);
        if (!timer) {
            endGame();
            clearInterval(idInterval);
        }
    }, 1000);
}

const renderTime = timer => {
    let min = parseInt(timer / 60);
    let sec = timer - min * 60;
    sec < 10 ? sec = `0${sec}` : sec;
    min < 10 ? min = `0${min}` : min;
    timeLeft.innerHTML = `${min}:${sec}`
};
let circleInterval = null;
const createNewCircle = () => {
    
    if (circleInterval) {
        clearInterval(circleInterval);
    }

    const circle = document.createElement("div");
    circle.classList.add("circle");

    const size = randomSize(10 * skill, 20 * skill);
    circle.style.width = `${size}px`
    circle.style.height = `${size}px`

    const {height, width} = board.getBoundingClientRect();
    const y = randomSize(0 + size, height - size);
    const x = randomSize(0 + size, width - size);
    
    circle.style.top = `${y}px`;
    circle.style.left = `${x}px`;

    board.append(circle);
    deliteCircle(circle);
}

function deliteCircle( el) {
    circleInterval = setInterval(() => {
        el.remove();
        createNewCircle();
    }, 2000 * skill);
}

function randomSize(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

function endGame() {
    const congratulations = new Audio('../../public/audio/congratulations.mp3');
    clearInterval(circleInterval);
    timeLeft.parentNode.classList.add("hide");
    let bestScore = 0;
    let congrText = '';
    
    if (localStorage.getItem(`${time}${skill}`)) {
        bestScore = localStorage.getItem(`${time}${skill}`);
    }

    if (score > bestScore) {
        localStorage.setItem(`${time}${skill}`, score);
        congrText = '<h2 class="congr">Ooops, you have a new best score!</h2>';
        if (sound) {
            congratulations.play();
        }
    }

    board.innerHTML = `
        <h3>Total shoots: <span class="primary">${totalShoots}</span></h3>
        <h1>SCORE: <span class="primary">${score}</span></h1>
        ${congrText}
        <h2>Your best score: <span class="primary">${bestScore}</span></h2>
        <div class="a start" data-game="reload">play again</div>
        <div class="a start" data-game="start">change setting</div>
    `;
}