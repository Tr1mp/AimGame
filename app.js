const btnStart = document.querySelector(".start"),
      screens = document.querySelectorAll(".screen"),
      btnsChoose = document.querySelectorAll(".choose-list"),
      timeLeft = document.querySelector("#time"),
      board = document.querySelector(".board");
let time = 0;
let score = 0;
let skill = 0;
document.addEventListener("click", (e) => {
    if (e.target && e.target.getAttribute("data-game") == "start") {
        if (!screens[0].classList.contains("up")) {
            screens[0].classList.add("up");
        } else {
            screens[1].classList.remove("up");
            score = 0
            skill = 0;
            time = 0;
        }
        
    }
    if (e.target && e.target.getAttribute("data-game") == "reload") {
        score = 0
        startGame(time);
    }
    
})

btnsChoose.forEach(btn => 
    btn.addEventListener("click", (e) => {
        console.log(e.target);
        // console.log(+e.target.getAttribute("data-time"));
        
        if (e && e.target.classList.contains("time-btn")) {
            time = +e.target.getAttribute("data-time");
        }

        if (e && e.target.classList.contains("skill-btn")) {
            skill = +e.target.getAttribute("data-skill");
        }

        if (time && skill) {
            console.log(skill);
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
})

function startGame(timer) {
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
    clearInterval(circleInterval);
    timeLeft.parentNode.classList.add("hide");
    let bestScore = 0;
    let congrutilations = '';
    if (localStorage.getItem(`${time}${skill}`)) {
        bestScore = localStorage.getItem(`${time}${skill}`);
    }
    if (score > bestScore) {
        localStorage.setItem(`${time}${skill}`, score);
        congrutilations = '<h2>Ooops, you have a new best score!</h2>';
    }
    board.innerHTML = `
        <h1>SCORE: <span class="primary">${score}</span></h1>
        ${congrutilations}
        <h2>Your best score: <span class="primary">${bestScore}</span></h2>
        <div class="a start" data-game="reload">play again</div>
        <div class="a start" data-game="start">change setting</div>
    `;
}


// localStorage.setItem('number', 5);

