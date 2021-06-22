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
};

const $score = document.querySelector(".score");
const $gameStart = document.querySelector(".game__start");
const $gameArea = document.querySelector(".game__area");
const $car = document.createElement("div");
$car.classList.add("car");



const playGame = () => {
    if (!setting.start) { return; }

    $gameStart.classList.add("_hide");
    requestAnimationFrame(playGame);
};

const startGame = () => {
    $gameStart.classList.add("_hide");
    setting.start = true;
    $gameArea.appendChild($car);
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