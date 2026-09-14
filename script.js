// ==================================================
// FLOWTYPE
// ==================================================


// ================= ELEMENTS =================

const gameArea = document.getElementById("gameArea");
const welcome = document.getElementById("welcome");

const startButton = document.getElementById("startButton");

const musicToggle = document.getElementById("musicToggle");

const pauseButton = document.getElementById("pauseButton");
const restartButton = document.getElementById("restartButton");
const resumeButton = document.getElementById("resumeButton");

const playAgainButton =
    document.getElementById("playAgainButton");

const gameControls =
    document.getElementById("gameControls");

const pauseScreen =
    document.getElementById("pauseScreen");

const resultsScreen =
    document.getElementById("resultsScreen");


// ================= HUD =================

const scoreDisplay =
    document.getElementById("score");

const levelDisplay =
    document.getElementById("level");

const wpmDisplay =
    document.getElementById("wpm");

const accuracyDisplay =
    document.getElementById("accuracy");

const comboDisplay =
    document.getElementById("combo");

const finalScore =
    document.getElementById("finalScore");

const finalWpm =
    document.getElementById("finalWpm");

const finalAccuracy =
    document.getElementById("finalAccuracy");


// ================= WORD BANK =================

const words = [

    "cat",
    "dog",
    "sun",
    "moon",
    "tree",
    "book",
    "rain",
    "star",
    "house",
    "water",
    "music",
    "light",
    "dream",
    "cloud",
    "flower",
    "garden",
    "window",
    "forest",
    "coffee",
    "summer",
    "winter",
    "computer",
    "keyboard",
    "morning",
    "evening",
    "journey",
    "adventure",
    "beautiful",
    "creative",
    "peaceful",
    "bicycle",
    "library",
    "diamond",
    "theater",
    "rainbow",
    "machine",
    "vehicle",
    "sunrise",
    "freedom",
    "harmony",
    "kitchen",
    "country",
    "network",
    "mystery",
    "curtain",
    "promise",
    "handbag",
    "balloon",
    "weather",
    "cottage",
    "blanket",
    "plumage",
    "biscuit",
    "iceberg",
    "cupcake",
    "earring",
    "desktop",
    "company",
    "example",
    "council",
    "service",
    "problem",
    "control",
    "society",
    "process",
    "support",
    "century",
    "history",
    "section",
    "subject",
    "quality",
    "project",
    "chapter",
    "manager",
    "account",
    "success",
    "capital",
    "defense",
    "product",
    "village",
    "husband",
    "science",
    "economy",
    "picture",
    "college",
    "station",
    "species",
    "concern",
    "purpose",
    "ability"

];

const letters =
    "abcdefghijklmnopqrstuvwxyz";


// ================= DIFFICULTIES =================

const difficulties = {

    slow: {
        speed: 42,
        spawn: 1500,
        maxTargets: 3
    },

    easy: {
        speed: 55,
        spawn: 1250,
        maxTargets: 3
    },

    normal: {
        speed: 70,
        spawn: 1050,
        maxTargets: 4
    },

    fast: {
        speed: 90,
        spawn: 850,
        maxTargets: 5
    },

    "very-fast": {
        speed: 115,
        spawn: 650,
        maxTargets: 6
    }

};


// ================= GAME VARIABLES =================

let selectedSpeed = "slow";

let targets = [];

let gameStarted = false;
let paused = false;

let score = 0;
let combo = 0;

let totalTyped = 0;
let correctTyped = 0;

let typedCharacters = 0;

let startTime = 0;

let spawnTimer = null;
let animationFrame = null;

let lastFrameTime = 0;


// ================= AUDIO =================

let audioContext = null;

let music = null;

let musicPlaying = false;


// ================= RANDOM =================

function randomLetter() {

    return letters[
        Math.floor(
            Math.random() * letters.length
        )
    ];

}


function randomWord() {

    return words[
        Math.floor(
            Math.random() * words.length
        )
    ];

}


// ================= SPEED BUTTONS =================

const speedButtons =
    document.querySelectorAll(".speed-option");


speedButtons.forEach(button => {

    button.addEventListener("click", () => {

        selectedSpeed =
            button.dataset.speed;

        speedButtons.forEach(btn => {

            btn.classList.remove("active");

        });

        button.classList.add("active");

    });

});


// ================= CREATE TARGET =================

function createTarget() {

    const settings =
        difficulties[selectedSpeed];

    if (
        targets.length >=
        settings.maxTargets
    ) {
        return;
    }


    const isLetter =
        Math.random() < 0.6;

    const text =
        isLetter
            ? randomLetter()
            : randomWord();


    const element =
        document.createElement("div");

    element.classList.add(
        "game-item"
    );


    if (isLetter) {

        element.classList.add(
            "single-letter"
        );

    }


    element.dataset.text = text;

    element.dataset.typed = "";

    element.innerHTML =
        `<span class="typed"></span>
         <span class="remaining">${text}</span>`;


    const areaWidth =
        gameArea.clientWidth;

    const targetWidth =
        isLetter ? 40 : Math.min(
            180,
            text.length * 17
        );


    const maxX =
        Math.max(
            20,
            areaWidth - targetWidth - 20
        );


    let x = 20;

    let attempts = 0;


    while (attempts < 30) {

        x =
            20 +
            Math.random() *
            Math.max(1, maxX - 20);


        let safe = true;


        for (const target of targets) {

            if (
                Math.abs(target.x - x) <
                targetWidth + 35
            ) {

                safe = false;

                break;

            }

        }


        if (safe) {
            break;
        }


        attempts++;

    }


    const target = {

        element,

        text,

        typed: "",

        x,

        y: -45,

        width: targetWidth,

        height: 40

    };


    element.style.left =
        `${x}px`;

    element.style.top =
        `${target.y}px`;


    gameArea.appendChild(element);

    targets.push(target);

}


// ================= UPDATE TARGET VISUAL =================

function updateTargetVisual(target) {

    const typed =
        target.element.querySelector(
            ".typed"
        );

    const remaining =
        target.element.querySelector(
            ".remaining"
        );


    typed.textContent =
        target.typed;

    remaining.textContent =
        target.text.slice(
            target.typed.length
        );

}


// ================= SPAWN =================

function startSpawning() {

    clearInterval(spawnTimer);


    spawnTimer = setInterval(() => {

        if (
            gameStarted &&
            !paused
        ) {

            createTarget();

        }

    }, difficulties[selectedSpeed].spawn);

}


// ================= START GAME =================

function startGame() {

    gameStarted = true;

    paused = false;

    score = 0;
    combo = 0;

    totalTyped = 0;
    correctTyped = 0;

    typedCharacters = 0;

    startTime = Date.now();


    targets.forEach(target => {

        target.element.remove();

    });


    targets = [];


    scoreDisplay.textContent = "0";
    comboDisplay.textContent = "0";
    levelDisplay.textContent = "1";
    wpmDisplay.textContent = "0";
    accuracyDisplay.textContent = "100%";


    welcome.style.display = "none";

    resultsScreen.style.display = "none";
    pauseScreen.style.display = "none";

    gameControls.style.display = "flex";


    createTarget();

    createTarget();


    startSpawning();

    lastFrameTime = performance.now();

    cancelAnimationFrame(animationFrame);

    animationFrame =
        requestAnimationFrame(
            gameLoop
        );

}


// ================= GAME LOOP =================

function gameLoop(timestamp) {

    if (!gameStarted) {
        return;
    }


    const delta =
        Math.min(
            0.05,
            (timestamp - lastFrameTime) /
            1000
        );


    lastFrameTime = timestamp;


    if (!paused) {

        const speed =
            difficulties[selectedSpeed].speed;


        for (
            let i = targets.length - 1;
            i >= 0;
            i--
        ) {

            const target =
                targets[i];


            target.y +=
                speed * delta;


            target.element.style.top =
                `${target.y}px`;


            if (
                target.y >
                gameArea.clientHeight + 60
            ) {

                missTarget(i);

            }

        }

    }


    animationFrame =
        requestAnimationFrame(
            gameLoop
        );

}


// ================= MISS =================

function missTarget(index) {

    const target =
        targets[index];


    target.element.remove();

    targets.splice(index, 1);


    combo = 0;

    updateHUD();

}


// ================= FIND BEST TARGET =================

function findTargetForKey(key) {

    const possible =
        targets.filter(target =>
            target.text
                .toLowerCase()
                .startsWith(
                    target.typed +
                    key
                )
        );


    if (!possible.length) {
        return null;
    }


    possible.sort(
        (a, b) =>
            b.y - a.y
    );


    return possible[0];

}


// ================= KEYBOARD =================

document.addEventListener(
    "keydown",
    event => {

        if (
            !gameStarted ||
            paused
        ) {
            return;
        }


        if (
            event.key.length !== 1
        ) {
            return;
        }


        const key =
            event.key.toLowerCase();


        totalTyped++;


        const target =
            findTargetForKey(key);


        if (!target) {

            wrongInput();

            updateHUD();

            return;

        }


        target.typed += key;

        correctTyped++;

        typedCharacters++;

        updateTargetVisual(target);


        if (
            target.typed ===
            target.text
        ) {

            completeTarget(target);

        }


        updateHUD();

    }
);


// ================= COMPLETE =================

function completeTarget(target) {

    const rect =
        target.element.getBoundingClientRect();

    const areaRect =
        gameArea.getBoundingClientRect();


    const x =
        rect.left -
        areaRect.left +
        rect.width / 2;


    const y =
        rect.top -
        areaRect.top +
        rect.height / 2;


    createBurst(
        target.text,
        x,
        y
    );


    target.element.classList.add(
        "correct"
    );


    setTimeout(() => {

        target.element.remove();

    }, 250);


    targets =
        targets.filter(
            t => t !== target
        );


    score++;

    combo++;


    if (
        targets.length === 0
    ) {

        createTarget();

    }


    updateHUD();

}


// ================= WRONG =================

function wrongInput() {

    const active =
        targets[targets.length - 1];


    if (!active) {
        return;
    }


    active.element.classList.remove(
        "shake"
    );


    void active.element.offsetWidth;


    active.element.classList.add(
        "shake"
    );


    if (navigator.vibrate) {

        navigator.vibrate(35);

    }


    playWrongSound();

}


// ================= HUD =================

function updateHUD() {

    scoreDisplay.textContent =
        score;


    comboDisplay.textContent =
        combo;


    const level =
        Math.floor(score / 10) + 1;


    levelDisplay.textContent =
        level;


    const elapsed =
        (Date.now() - startTime) /
        60000;


    let wpm = 0;


    if (elapsed > 0) {

        wpm =
            Math.round(
                typedCharacters /
                5 /
                elapsed
            );

    }


    wpmDisplay.textContent =
        wpm;


    let accuracy = 100;


    if (totalTyped > 0) {

        accuracy =
            Math.round(
                (correctTyped /
                    totalTyped) *
                100
            );

    }


    accuracyDisplay.textContent =
        `${accuracy}%`;

}


// ================= BURST =================

function createBurst(text, x, y) {

    const flash =
        document.createElement("div");

    flash.classList.add(
        "burst-flash"
    );


    flash.style.left =
        `${x - 5}px`;

    flash.style.top =
        `${y - 5}px`;


    gameArea.appendChild(flash);


    setTimeout(() => {

        flash.remove();

    }, 500);


    let characters =
        text.split("");


    if (
        characters.length === 1
    ) {

        const extra =
            "abcdefghijklmnopqrstuvwxyz";


        for (
            let i = 0;
            i < 5;
            i++
        ) {

            characters.push(
                extra[
                    Math.floor(
                        Math.random() *
                        extra.length
                    )
                ]
            );

        }

    }


    characters.forEach(
        (character, index) => {

            const particle =
                document.createElement(
                    "span"
                );


            particle.classList.add(
                "burst-letter"
            );


            particle.textContent =
                character;


            particle.style.left =
                `${x}px`;

            particle.style.top =
                `${y}px`;


            const angle =
                Math.random() *
                Math.PI *
                2;


            const distance =
                35 +
                Math.random() *
                80;


            const moveX =
                Math.cos(angle) *
                distance;


            const moveY =
                Math.sin(angle) *
                distance;


            const rotation =
                (Math.random() - 0.5) *
                360;


            particle.style.setProperty(
                "--move-x",
                `${moveX}px`
            );


            particle.style.setProperty(
                "--move-y",
                `${moveY}px`
            );


            particle.style.setProperty(
                "--rotate",
                `${rotation}deg`
            );


            particle.style.fontSize =
                `${12 + Math.random() * 8}px`;


            particle.style.animationDelay =
                `${index * 15}ms`;


            gameArea.appendChild(
                particle
            );


            setTimeout(() => {

                particle.remove();

            }, 900);

        }
    );


    playCorrectSound();

}


// ================= PAUSE =================

function pauseGame() {

    if (
        !gameStarted ||
        paused
    ) {
        return;
    }


    paused = true;

    pauseScreen.style.display =
        "flex";

}


function resumeGame() {

    if (!gameStarted) {
        return;
    }


    paused = false;

    pauseScreen.style.display =
        "none";


    lastFrameTime =
        performance.now();

}


// ================= RESTART =================

function restartGame() {

    clearInterval(spawnTimer);


    startGame();

}


// ================= RESULTS =================

function showResults() {

    clearInterval(spawnTimer);

    gameStarted = false;


    const elapsed =
        Math.max(
            1,
            (Date.now() - startTime) /
            60000
        );


    const wpm =
        Math.round(
            typedCharacters /
            5 /
            elapsed
        );


    const accuracy =
        totalTyped === 0
            ? 100
            : Math.round(
                (correctTyped /
                    totalTyped) *
                100
            );


    finalScore.textContent =
        score;

    finalWpm.textContent =
        wpm;

    finalAccuracy.textContent =
        `${accuracy}%`;


    gameControls.style.display =
        "none";


    resultsScreen.style.display =
        "flex";

}


// ================= AUDIO =================

function initAudio() {

    if (!audioContext) {

        audioContext =
            new (
                window.AudioContext ||
                window.webkitAudioContext
            )();

    }


    if (
        audioContext.state ===
        "suspended"
    ) {

        audioContext.resume();

    }

}


function playTone(
    frequency,
    duration,
    type = "sine",
    volume = 0.035
) {

    if (!audioContext) {
        return;
    }


    const oscillator =
        audioContext.createOscillator();


    const gain =
        audioContext.createGain();


    oscillator.type =
        type;

    oscillator.frequency.value =
        frequency;


    gain.gain.setValueAtTime(
        volume,
        audioContext.currentTime
    );


    gain.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.currentTime +
        duration
    );


    oscillator.connect(gain);

    gain.connect(
        audioContext.destination
    );


    oscillator.start();

    oscillator.stop(
        audioContext.currentTime +
        duration
    );

}


function playCorrectSound() {

    if (!musicPlaying) {
        return;
    }


    playTone(
        620,
        0.08,
        "sine",
        0.025
    );

}


function playWrongSound() {

    if (!musicPlaying) {
        return;
    }


    playTone(
        140,
        0.10,
        "sine",
        0.025
    );

}


// ================= MUSIC =================

function toggleMusic() {

    initAudio();


    if (!music) {

        music =
            new Audio("music.mp3");

        music.loop = true;

        music.volume = 0.28;

    }


    if (musicPlaying) {

        music.pause();

        musicPlaying = false;

        musicToggle.classList.remove(
            "active"
        );

        musicToggle.textContent =
            "🎵";

    } else {

        music.play()
            .then(() => {

                musicPlaying = true;

                musicToggle.classList.add(
                    "active"
                );

                musicToggle.textContent =
                    "🔊";

            })
            .catch(error => {

                console.log(
                    "Music could not start:",
                    error
                );

            });

    }

}


// ================= BUTTON EVENTS =================

startButton.addEventListener(
    "click",
    () => {

        initAudio();

        startGame();

    }
);


musicToggle.addEventListener(
    "click",
    toggleMusic
);


pauseButton.addEventListener(
    "click",
    pauseGame
);


resumeButton.addEventListener(
    "click",
    resumeGame
);


restartButton.addEventListener(
    "click",
    restartGame
);


playAgainButton.addEventListener(
    "click",
    startGame
);


// ================= KEYBOARD SHORTCUTS =================

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape" &&
            gameStarted
        ) {

            if (paused) {

                resumeGame();

            } else {

                pauseGame();

            }

        }

    }
);
