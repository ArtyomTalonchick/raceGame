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
    speed: 3,
    x: null,
    y: null,
    traffic: 3,
};

const $score = document.querySelector(".score");
const $gameStart = document.querySelector(".game__start");
const $gameArea = document.querySelector(".game__area");
const $car = document.createElement("div");
$car.classList.add("car");

const getQuantityElements = height => Math.ceil(document.documentElement.clientHeight / height) + 1;
const getRandomLeft = width => `${Math.random() * ($gameArea.offsetWidth - width)}px`;


const moveRoad = () => {
    document.querySelectorAll(".game__line").forEach($line => {
        $line.y += setting.speed;
        $line.style.top = `${$line.y}px`;

        $line.y >= document.documentElement.clientHeight && ($line.y = -100);
    });
}

const moveEnemy = () => {
    document.querySelectorAll(".enemy").forEach($enemy => {
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

const startGame = () => {
    $gameStart.classList.add("_hide");   

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
    $gameArea.appendChild($car);
    setting.x = $car.offsetLeft;
    setting.y = $car.offsetTop;
    requestAnimationFrame(playGame);
};

const startRun = e => {
    e.preventDefault();
    keys[e.key] = true;
};

const stopRun = e => {
    e.preventDefault();
    keys[e.key] = false;
};

$gameStart.addEventListener("click", startGame);
document.addEventListener("keydown", startRun);
document.addEventListener("keyup", stopRun);