"use strict";

const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
};

const setting = {
    start: false,
    score: 0,
    speed: 0,
    x: null,
    y: null,
    traffic: 3,
};

const $audioGame = document.querySelector("#audio-game");
const $audioOvertaking = document.querySelector("#audio-overtaking");
const $audioBreaking = document.querySelector("#audio-breaking");
const $score = document.querySelector(".game__header-score");
const $record = document.querySelector(".game__header-record");
const $gameStartBtnsContainer = document.querySelector(".game__buttons");
const $gameStartBtns = document.querySelectorAll(".game__button");
const $gameArea = document.querySelector(".game__area");
const $car = document.createElement("div");
$car.classList.add("car");
$audioGame.volume = .5;
let stopOvertakingTimeoutId = null;

const updateRecord = () => $record.textContent = `Record: ${localStorage.getItem("bestScore") || 0}`;
const getQuantityElements = height => Math.ceil(document.documentElement.clientHeight / height) + 1;
const getRandomLeft = width => `${Math.random() * ($gameArea.offsetWidth - width)}px`;
updateRecord();


const moveRoad = () => {
    document.querySelectorAll(".game__line").forEach($line => {
        $line.y += setting.speed;
        $line.style.top = `${$line.y}px`;

        $line.y >= document.documentElement.clientHeight && ($line.y = -100);
    });
}

const moveEnemy = () => {
    const carRect = $car.getBoundingClientRect();
    document.querySelectorAll(".enemy").forEach($enemy => {

        const enemyRect = $enemy.getBoundingClientRect();

        if (carRect.bottom >= enemyRect.top && carRect.top <= enemyRect.bottom) {
            $audioOvertaking.play();
            clearTimeout(stopOvertakingTimeoutId);
            stopOvertakingTimeoutId = setTimeout(() => $audioOvertaking.pause(), 1000);

            if (carRect.left <= enemyRect.right && carRect.right >= enemyRect.left) {
                $audioBreaking.play();
                endGame();
            }
        }

        $enemy.y += setting.speed / 2;
        $enemy.style.top = `${$enemy.y}px`;

        if ($enemy.y >= document.documentElement.clientHeight) {
            $enemy.y = -100 * setting.traffic;
            $enemy.style.left = getRandomLeft(50);
        }
    });
}

const playGame = () => {
    if (!setting.start) { return; }

    moveRoad();
    moveEnemy();
    setting.score += setting.speed;
    $score.textContent = `Score: ${setting.score}`;

    setting.x += (keys.ArrowRight - keys.ArrowLeft) * setting.speed
    setting.y += (keys.ArrowDown - keys.ArrowUp) * setting.speed

    setting.x < 0 && (setting.x = 0);
    setting.x > $gameArea.offsetWidth - $car.offsetWidth && (setting.x = $gameArea.offsetWidth - $car.offsetWidth);
    setting.y < 0 && (setting.y = 0);
    setting.y > $gameArea.offsetHeight - $car.offsetHeight && (setting.y = $gameArea.offsetHeight - $car.offsetHeight);

    $car.style.left = `${setting.x}px`
    $car.style.top = `${setting.y}px`

    requestAnimationFrame(playGame);
};

const startGame = e => {
    setting.speed = +e.currentTarget.dataset.speed || 2;
    $audioGame.play();
    $gameStartBtnsContainer.classList.add("_hide");
    $gameArea.innerHTML = "";
    $car.style.left = "calc(50% - 25px)";
    $car.style.top = "auto";
    $car.style.bottom = "10px";

    Object.keys(keys).forEach(name => keys[name] = false);

    for (let i = 0; i < getQuantityElements(100); i++) {
        const $line = document.createElement("div");
        $line.classList.add("game__line");
        $line.y = 100 * i;
        $line.style.top = `${$line.y}px`;
        $gameArea.appendChild($line);
    }

    for (let i = 0; i < getQuantityElements(100 * setting.traffic); i++) {
        const $enemy = document.createElement("div");
        $enemy.classList.add("enemy");
        $enemy.y = - 100 * setting.traffic * (i + 1);
        $enemy.style.top = `${$enemy.y}px`;
        $enemy.style.left = getRandomLeft(50);
        $gameArea.appendChild($enemy);
    }

    setting.start = true;
    setting.score = 0;
    $gameArea.appendChild($car);
    setting.x = $car.offsetLeft;
    setting.y = $car.offsetTop;
    requestAnimationFrame(playGame);
};


const endGame = () => {
    setting.start = false;
    $gameStartBtnsContainer.classList.remove("_hide");
    
    $audioGame.pause();
    $audioOvertaking.pause();

    const bestScore = localStorage.getItem("bestScore") || 0;
    if (setting.score > bestScore) {
        localStorage.setItem("bestScore", setting.score);
        alert(`You have broken the record!\nOld result: ${bestScore}\nYour score: ${setting.score}`);
        updateRecord();
    }

};

const startRun = e => {
    e.preventDefault();
    e.key in keys && (keys[e.key] = true);
};

const stopRun = e => {
    e.preventDefault();
    e.key in keys && (keys[e.key] = false);
};

$gameStartBtns.forEach(btn => btn.addEventListener("click", startGame));
document.addEventListener("keydown", startRun);
document.addEventListener("keyup", stopRun);