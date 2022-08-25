const btnStart = document.querySelector(".start"),
      screens = document.querySelectorAll(".screen"),
      btnsChoose = document.querySelectorAll(".choose-list"),
      timeLeft = document.querySelector("#time"),
      board = document.querySelector(".board"),
      btnsSec = document.querySelectorAll(".time-btn"),
      btnsSkill = document.querySelectorAll(".skill-btn"),
      btnMusic = document.querySelector(".music"),
      btnSound = document.querySelector(".effect"),
      btnsSounds = document.querySelector(".button-wrapper");

const congratulations = new Audio('../../public/sounds/congratulations.mp3');
const effectGo = new Audio('../../public/sounds/startGo.mp3');
let hit = new Audio("../../public/sounds/hit.mp3");
hit.volume = 0.3;
let shoot = new Audio('../../public/sounds/shoot.mp3');
const back = new Audio('../../public/sounds/back.mp3');
back.volume = 0.3;
back.loop = true;

let time = 0;
let score = 0;
let totalShoots = 0;
let skill = 0;
let music = null;
let effect = null

localStorage.getItem("music") ? music = !!+localStorage.getItem("music") : music = true;
if (music) {
    btnMusic.classList.add("active");
    soundsChange([back], music);
} else {
    soundsChange([back], music);
}

localStorage.getItem("effect") ? effect = !!+localStorage.getItem("effect") : effect = true;
if (effect) {
    btnSound.classList.add("active")
    soundsChange([hit, shoot, effectGo, congratulations], effect);
} else {
    soundsChange([hit, shoot, effectGo, congratulations], effect);
}

btnsSounds.addEventListener("click", (e) => {
    if (e.target) {
        if  (e.target.classList[0] === "music") {
            music = soundsCondition(e, music, "music", [back])

            if (screens[0].classList.contains("up")) {
                back.play();
            }
        }
        if (e.target.classList[0] === "effect" ) {
            effect = soundsCondition(e, effect, "effect", [hit, shoot, effectGo, congratulations])
        }
    }
})

function soundsCondition(e, elem, type, arrSounds) {
    if (elem) {
        elem = false;
        localStorage.setItem(type, 0);
        e.target.classList.remove("active");
    } else if (!elem) {
        elem = true;
        localStorage.setItem(type, 1);
        e.target.classList.add("active");
    }

    soundsChange(arrSounds, elem);
    return elem;
}

function soundsChange(arr, bool) {
   arr.forEach(item => item.muted = !bool); 
}


document.addEventListener("click", (e) => {
    if (e.target && e.target.getAttribute("data-game") == "start") {
        if (!screens[0].classList.contains("up")) {
            screens[0].classList.add("up");
            back.play();
        } else {
            btnsSec.forEach(sec => sec.classList.remove("active"));
            btnsSkill.forEach(skill => skill.classList.remove("active"));
            screens[1].classList.remove("up");
            score = 0;
            totalShoots = 0;
            skill = 0;
            time = 0;
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
        if (e.target) {
            if (e.target.classList.contains("time-btn")) {
                time = +e.target.getAttribute("data-time");
                changeActive(btnsSec, e.target);
            }
            if (e.target.classList.contains("skill-btn")) {
                skill = +e.target.getAttribute("data-skill");
                changeActive(btnsSkill, e.target);
            }
        }
        if (time && skill) {
            screens[1].classList.add("up");
            startGame(time);
        }
    }) 
)

function changeActive(btns, el) {
    btns.forEach(skill => skill.classList.remove("active"));
    el.classList.add("active");
}

board.addEventListener("click", (e) => {
    if (e.target) {
        if (!timeLeft.parentNode.classList.contains("hide")) {
            shoot.currentTime = 0;
            shoot.play();
            totalShoots++;
        }

        if (e.target.classList.contains("circle")) {
            if (effect) {
                setTimeout(() => {
                    hit.play();
                }, 50);
                
            }
            score++;
            e.target.remove();
            createNewCircle();
        }
        
    }
})

function startGame(timer) {
    effectGo.play();

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
            clearInterval(idInterval);
            endGame();
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
    clearInterval(circleInterval);
    timeLeft.parentNode.classList.add("hide");
    let bestScore = 0;
    let congrText = '';
    let skillLevel = {
        0.5: "pro",
        1: "middle",
        2: "noob",
    }
    
    if (localStorage.getItem(`${time}${skill}`)) {
        bestScore = localStorage.getItem(`${time}${skill}`);
    }

    if (score > bestScore) {
        localStorage.setItem(`${time}${skill}`, score);
        congrText = '<h2 class="congr">Ooops, you have a new best score!</h2>';
        congratulations.play();
    }

    board.innerHTML = `
        <h2>Time: <span class="primary">${time}</span> sec.  Skill level: <span class="primary">${skillLevel[skill]}</span></h2>
        <h3>Total shoots: <span class="primary">${totalShoots}</span></h3>
        <h1>SCORE: <span class="primary">${score}</span></h1>
        ${congrText}
        <h2>Your best score: <span class="primary">${bestScore}</span></h2>
        <div class="a start button" data-game="reload">play again</div>
        <div class="a start button" data-game="start">change setting</div>
    `;
}


function winGame(timeout = 1000, log = 0) {
    const win = setInterval(() => clk(), timeout);
    let count = 0;
    function clk() {
        const circle = document.querySelector(".circle");
        if (circle) {
            circle.click();
            if (log) {
                console.log("kill", count++);
            }
        }
        if (timeLeft.parentNode.classList.contains("hide")) {
            clearInterval(win);
        }
    }
    
}