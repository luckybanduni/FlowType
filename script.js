/* ==================================================
   FLOWTYPE V2
   Falling Target Engine
   ================================================== */


/* ==================================================
   DOM
   ================================================== */

const gameArea = document.getElementById("gameArea");

const welcome = document.getElementById("welcome");
const startButton = document.getElementById("startButton");

const scoreDisplay = document.getElementById("score");
const wpmDisplay = document.getElementById("wpm");
const accuracyDisplay = document.getElementById("accuracy");
const comboDisplay = document.getElementById("combo");
const levelDisplay = document.getElementById("level");

const gameControls = document.getElementById("gameControls");

const pauseButton = document.getElementById("pauseButton");
const restartButton = document.getElementById("restartButton");
const soundButton = document.getElementById("soundButton");

const pauseOverlay = document.getElementById("pauseOverlay");
const resumeButton = document.getElementById("resumeButton");

const resultsOverlay = document.getElementById("resultsOverlay");
const playAgainButton = document.getElementById("playAgainButton");

const finalWpm = document.getElementById("finalWpm");
const finalAccuracy = document.getElementById("finalAccuracy");
const finalTyped = document.getElementById("finalTyped");
const finalCombo = document.getElementById("finalCombo");


/* ==================================================
   WORD BANK
   ================================================== */

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


/* ==================================================
   LETTER BANK
   ================================================== */

const letters = "abcdefghijklmnopqrstuvwxyz";


/* ==================================================
   DIFFICULTY
   ==================================================

   speed = falling pixels per second
   spawn = milliseconds between targets
   max = maximum targets on screen
   */

const difficulties = {

    slow: {
        speed: 42,
        spawn: 1450,
        max: 3
    },

    easy: {
        speed: 55,
        spawn: 1250,
        max: 3
    },

    normal: {
        speed: 70,
        spawn: 1050,
        max: 4
    },

    fast: {
        speed: 90,
        spawn: 850,
        max: 5
    },

    "very-fast": {
        speed: 115,
        spawn: 650,
        max: 6
    }

};


/* ==================================================
   GAME STATE
   ================================================== */

let selectedSpeed = "slow";

let gameStarted = false;
let gamePaused = false;

let score = 0;

let totalKeystrokes = 0;
let correctKeystrokes = 0;

let combo = 0;
let bestCombo = 0;

let level = 1;

let startTime = 0;

let spawnTimer = null;
let animationFrame = null;

let targets = [];

let typedTarget = null;

let soundEnabled = true;


/* ==================================================
   AUDIO
   ================================================== */

let audioContext = null;


function initAudio() {

    if (!soundEnabled) {
        return;
    }

    if (!audioContext) {
        audioContext =
            new (
                window.AudioContext ||
                window.webkitAudioContext
            )();
    }

    if (audioContext.state === "suspended") {
        audioContext.resume();
    }

}


function playTone(type = "correct") {

    if (!soundEnabled) {
        return;
    }

    initAudio();

    if (!audioContext) {
        return;
    }

    const oscillator =
        audioContext.createOscillator();

    const gain =
        audioContext.createGain();

    oscillator.connect(gain);

    gain.connect(audioContext.destination);

    if (type === "correct") {

        oscillator.frequency.value = 520;

        gain.gain.setValueAtTime(
            0.045,
            audioContext.currentTime
        );

        gain.gain.exponentialRampToValueAtTime(
            0.001,
            audioContext.currentTime + 0.08
        );

    } else {

        oscillator.frequency.value = 170;

        gain.gain.setValueAtTime(
            0.035,
            audioContext.currentTime
        );

        gain.gain.exponentialRampToValueAtTime(
            0.001,
            audioContext.currentTime + 0.08
        );

    }

    oscillator.start();

    oscillator.stop(
        audioContext.currentTime + 0.09
    );

}


/* ==================================================
   RANDOM HELPERS
   ================================================== */

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
    ].toLowerCase();

}


/* ==================================================
   CREATE TARGET TEXT
   ================================================== */

function createTargetText() {

    const isLetter = Math.random() < 0.38;

    return {
        text: isLetter
            ? randomLetter()
            : randomWord(),

        isLetter
    };

}


/* ==================================================
   POSITION CHECK
   ==================================================

   Prevents new targets from spawning
   directly on top of existing targets.
   */

function positionIsSafe(x, width) {

    const minimumGap = 55;

    for (const target of targets) {

        const left = target.x;

        const right =
            target.x + target.width;

        const newRight =
            x + width;

        const horizontalOverlap =
            x < right + minimumGap &&
            newRight > left - minimumGap;

        if (horizontalOverlap) {
            return false;
        }

    }

    return true;

}


/* ==================================================
   FIND SAFE X
   ================================================== */

function findSafeX(width) {

    const areaWidth =
        gameArea.clientWidth;

    const padding = 35;

    const maxX =
        Math.max(
            padding,
            areaWidth - width - padding
        );

    for (let attempt = 0; attempt < 25; attempt++) {

        const x =
            padding +
            Math.random() *
            Math.max(1, maxX - padding);

        if (positionIsSafe(x, width)) {
            return x;
        }

    }

    return Math.max(
        padding,
        Math.random() *
        Math.max(1, maxX)
    );

}


/* ==================================================
   CREATE TARGET
   ================================================== */

function createTarget() {

    if (!gameStarted || gamePaused) {
        return;
    }

    const settings =
        difficulties[selectedSpeed];

    if (targets.length >= settings.max) {
        return;
    }


    const data =
        createTargetText();


    const element =
        document.createElement("div");

    element.classList.add("game-item");

    if (data.isLetter) {
        element.classList.add("single-letter");
    }

    element.dataset.text =
        data.text;

    element.textContent =
        data.text;


    gameArea.appendChild(element);


    const width =
        element.offsetWidth;

    const x =
        findSafeX(width);


    const target = {

        element,

        text: data.text,

        isLetter: data.isLetter,

        x,

        y: -45,

        width,

        height: element.offsetHeight,

        speed: settings.speed *
            (0.9 + Math.random() * 0.2),

        typed: "",

        active: true

    };


    element.style.left =
        `${x}px`;

    element.style.top =
        `${target.y}px`;


    requestAnimationFrame(() => {

        element.classList.add("visible");

    });


    targets.push(target);

}


/* ==================================================
   REMOVE TARGET
   ================================================== */

function removeTarget(target) {

    if (!target) {
        return;
    }

    target.active = false;

    const index =
        targets.indexOf(target);

    if (index !== -1) {
        targets.splice(index, 1);
    }

    if (
        typedTarget === target
    ) {
        typedTarget = null;
    }

    if (target.element) {
        target.element.remove();
    }

}


/* ==================================================
   MISS TARGET
   ================================================== */

function missTarget(target) {

    if (!target || !target.active) {
        return;
    }

    target.active = false;

    target.element.classList.add("missed");

    combo = 0;

    updateHUD();

    playTone("wrong");


    setTimeout(() => {

        removeTarget(target);

    }, 250);

}


/* ==================================================
   GAME LOOP
   ================================================== */

function gameLoop(timestamp) {

    if (!gameStarted || gamePaused) {
        return;
    }


    const delta =
        Math.min(
            40,
            timestamp -
            (gameLoop.lastTime || timestamp)
        );

    gameLoop.lastTime =
        timestamp;


    const pixels =
        delta / 1000;


    const areaHeight =
        gameArea.clientHeight;


    for (
        let i = targets.length - 1;
        i >= 0;
        i--
    ) {

        const target =
            targets[i];


        if (!target.active) {
            continue;
        }


        target.y +=
            target.speed * pixels;


        target.element.style.top =
            `${target.y}px`;


        /*
         * Bottom of target reaches
         * the game area bottom.
         */

        if (
            target.y +
            target.height >=
            areaHeight
        ) {

            missTarget(target);

        }

    }


    animationFrame =
        requestAnimationFrame(gameLoop);

}


/* ==================================================
   SPAWN SYSTEM
   ================================================== */

function startSpawner() {

    stopSpawner();


    createTarget();


    spawnTimer =
        setInterval(() => {

            if (
                gameStarted &&
                !gamePaused
            ) {

                createTarget();

            }

        },
        difficulties[selectedSpeed].spawn
    );

}


function stopSpawner() {

    if (spawnTimer) {

        clearInterval(spawnTimer);

        spawnTimer = null;

    }

}


/* ==================================================
   RENDER TARGET TEXT
   ================================================== */

function renderTarget(target) {

    if (!target || !target.element) {
        return;
    }


    const typed =
        target.typed;

    const remaining =
        target.text.slice(
            typed.length
        );


    target.element.innerHTML = "";


    if (typed.length > 0) {

        const typedSpan =
            document.createElement("span");

        typedSpan.className =
            "typed-part";

        typedSpan.textContent =
            typed;

        target.element.appendChild(
            typedSpan
        );

    }


    const remainingSpan =
        document.createElement("span");

    remainingSpan.className =
        "remaining-part";

    remainingSpan.textContent =
        remaining;

    target.element.appendChild(
        remainingSpan
    );


    target.element.classList.add(
        "typing"
    );

}


/* ==================================================
   FIND TARGET FOR KEY
   ================================================== */

function findTargetForKey(key) {

    /*
     * If we're already typing a word,
     * continue that target first.
     */

    if (
        typedTarget &&
        typedTarget.active
    ) {

        return typedTarget;

    }


    /*
     * Find a target whose first
     * character matches.
     */

    const matches =
        targets.filter(
            target =>
                target.active &&
                target.text[0] === key
        );


    if (matches.length === 0) {
        return null;
    }


    /*
     * Prioritize the lowest target.
     */

    matches.sort(
        (a, b) =>
            b.y - a.y
    );


    return matches[0];

}


/* ==================================================
   KEYBOARD INPUT
   ================================================== */

document.addEventListener(
    "keydown",
    event => {

        if (!gameStarted) {
            return;
        }


        /*
         * Pause shortcut
         */

        if (
            event.key === "Escape" ||
            event.key === " "
        ) {

            if (
                event.target.tagName !==
                "BUTTON"
            ) {

                event.preventDefault();

                togglePause();

                return;

            }

        }


        if (gamePaused) {
            return;
        }


        /*
         * Ignore special keys.
         */

        if (event.key.length !== 1) {
            return;
        }


        const key =
            event.key.toLowerCase();


        totalKeystrokes++;


        const target =
            findTargetForKey(key);


        /*
         * No matching target.
         */

        if (!target) {

            wrongInput();

            updateHUD();

            return;

        }


        /*
         * Continue target.
         */

        const expected =
            target.text[
                target.typed.length
            ];


        if (key === expected) {

            target.typed += key;

            correctKeystrokes++;

            typedTarget = target;


            if (
                target.typed.length ===
                target.text.length
            ) {

                targetCompleted(
                    target
                );

            } else {

                renderTarget(target);

            }

        } else {

            wrongInput(target);

            /*
             * Reset word progress
             * after a wrong character.
             */

            target.typed = "";

            typedTarget = null;

            renderTarget(target);

        }


        updateHUD();

    }
);


/* ==================================================
   WRONG INPUT
   ================================================== */

function wrongInput(target = null) {

    const element =
        target?.element;


    if (element) {

        element.classList.remove(
            "shake"
        );

        void element.offsetWidth;

        element.classList.add(
            "shake"
        );

    }


    combo = 0;

    playTone("wrong");


    if (
        navigator.vibrate
    ) {

        navigator.vibrate(30);

    }

}


/* ==================================================
   TARGET COMPLETED
   ================================================== */

function targetCompleted(target) {

    if (
        !target ||
        !target.active
    ) {
        return;
    }


    target.active = false;

    typedTarget = null;


    const rect =
        target.element.getBoundingClientRect();

    const areaRect =
        gameArea.getBoundingClientRect();


    const centerX =
        rect.left -
        areaRect.left +
        rect.width / 2;


    const centerY =
        rect.top -
        areaRect.top +
        rect.height / 2;


    createBurst(
        target.text,
        centerX,
        centerY
    );


    target.element.classList.add(
        "correct"
    );


    score++;

    combo++;

    bestCombo =
        Math.max(
            bestCombo,
            combo
        );


    /*
     * Level every 10 successful targets.
     */

    level =
        Math.floor(score / 10) + 1;


    playTone("correct");


    if (
        navigator.vibrate
    ) {

        navigator.vibrate(12);

    }


    setTimeout(() => {

        removeTarget(target);

    }, 350);


    updateHUD();

}


/* ==================================================
   BURST EFFECT
   ================================================== */

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


    const characters =
        text.split("");


    if (characters.length === 1) {

        const randomCharacters =
            "abcdefghijklmnopqrstuvwxyz";


        for (let i = 0; i < 5; i++) {

            characters.push(
                randomCharacters[
                    Math.floor(
                        Math.random() *
                        randomCharacters.length
                    )
                ]
            );

        }

    }


    characters.forEach(
        (character, index) => {

            const particle =
                document.createElement("span");


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
                Math.random() * 80;


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

            }, 800);

        }
    );

}


/* ==================================================
   HUD
   ================================================== */

function updateHUD() {

    scoreDisplay.textContent =
        score;


    comboDisplay.textContent =
        combo;


    levelDisplay.textContent =
        level;


    const accuracy =
        totalKeystrokes === 0
            ? 100
            : Math.round(
                (
                    correctKeystrokes /
                    totalKeystrokes
                ) * 100
            );


    accuracyDisplay.textContent =
        `${accuracy}%`;


    /*
     * WPM:
     *
     * Standard:
     * 5 characters = 1 word
     */

    let wpm = 0;


    if (startTime > 0) {

        const minutes =
            (
                Date.now() -
                startTime
            ) / 60000;


        if (minutes > 0) {

            wpm =
                Math.round(
                    (
                        correctKeystrokes / 5
                    ) / minutes
                );

        }

    }


    wpmDisplay.textContent =
        wpm;

}


/* ==================================================
   START GAME
   ================================================== */

function startGame() {

    stopGameLoops();

    clearTargets();


    gameStarted = true;

    gamePaused = false;


    score = 0;

    totalKeystrokes = 0;

    correctKeystrokes = 0;

    combo = 0;

    bestCombo = 0;

    level = 1;

    typedTarget = null;


    startTime =
        Date.now();


    welcome.style.display =
        "none";


    resultsOverlay.classList.remove(
        "visible"
    );


    pauseOverlay.classList.remove(
        "visible"
    );


    gameControls.classList.add(
        "visible"
    );


    soundButton.textContent =
        soundEnabled
            ? "🔊"
            : "🔇";


    initAudio();


    updateHUD();


    startSpawner();


    gameLoop.lastTime =
        performance.now();


    animationFrame =
        requestAnimationFrame(
            gameLoop
        );

}


/* ==================================================
   CLEAR TARGETS
   ================================================== */

function clearTargets() {

    targets.forEach(
        target => {

            if (target.element) {
                target.element.remove();
            }

        }
    );


    targets = [];

    typedTarget = null;

}


/* ==================================================
   STOP LOOPS
   ================================================== */

function stopGameLoops() {

    stopSpawner();


    if (animationFrame) {

        cancelAnimationFrame(
            animationFrame
        );

        animationFrame = null;

    }

}


/* ==================================================
   PAUSE
   ================================================== */

function togglePause() {

    if (!gameStarted) {
        return;
    }


    if (gamePaused) {

        resumeGame();

    } else {

        pauseGame();

    }

}


function pauseGame() {

    gamePaused = true;

    pauseOverlay.classList.add(
        "visible"
    );


    pauseButton.textContent =
        "▶";


    /*
     * Reset animation timing
     * to prevent a huge jump after pause.
     */

    gameLoop.lastTime =
        performance.now();

}


function resumeGame() {

    gamePaused = false;

    pauseOverlay.classList.remove(
        "visible"
    );


    pauseButton.textContent =
        "⏸";


    gameLoop.lastTime =
        performance.now();


    animationFrame =
        requestAnimationFrame(
            gameLoop
        );

}


/* ==================================================
   END GAME
   ================================================== */

function endGame() {

    gameStarted = false;

    gamePaused = false;


    stopGameLoops();


    const accuracy =
        totalKeystrokes === 0
            ? 100
            : Math.round(
                (
                    correctKeystrokes /
                    totalKeystrokes
                ) * 100
            );


    let wpm = 0;


    if (startTime > 0) {

        const minutes =
            (
                Date.now() -
                startTime
            ) / 60000;


        if (minutes > 0) {

            wpm =
                Math.round(
                    (
                        correctKeystrokes / 5
                    ) / minutes
                );

        }

    }


    finalWpm.textContent =
        wpm;


    finalAccuracy.textContent =
        `${accuracy}%`;


    finalTyped.textContent =
        score;


    finalCombo.textContent =
        bestCombo;


    let title =
        "Nice flow.";


    if (wpm >= 60) {
        title = "You're flying.";
    } else if (wpm >= 40) {
        title = "Great flow.";
    } else if (wpm >= 20) {
        title = "Smooth typing.";
    }


    document.getElementById(
        "resultsTitle"
    ).textContent = title;


    clearTargets();


    gameControls.classList.remove(
        "visible"
    );


    pauseOverlay.classList.remove(
        "visible"
    );


    resultsOverlay.classList.add(
        "visible"
    );

}


/* ==================================================
   RESTART
   ================================================== */

function restartGame() {

    startGame();

}


/* ==================================================
   SPEED SELECTION
   ================================================== */

const speedButtons =
    document.querySelectorAll(
        ".speed-option"
    );


speedButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                speedButtons.forEach(
                    item => {

                        item.classList.remove(
                            "active"
                        );

                    }
                );


                button.classList.add(
                    "active"
                );


                selectedSpeed =
                    button.dataset.speed;

            }
        );

    }
);


/* ==================================================
   BUTTONS
   ================================================== */

startButton.addEventListener(
    "click",
    startGame
);


pauseButton.addEventListener(
    "click",
    togglePause
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


soundButton.addEventListener(
    "click",
    () => {

        soundEnabled =
            !soundEnabled;


        soundButton.textContent =
            soundEnabled
                ? "🔊"
                : "🔇";


        if (soundEnabled) {
            initAudio();
        }

    }
);


/* ==================================================
   WINDOW RESIZE
   ================================================== */

window.addEventListener(
    "resize",
    () => {

        /*
         * Keep targets inside the
         * new screen width.
         */

        const width =
            gameArea.clientWidth;


        targets.forEach(
            target => {

                const maxX =
                    Math.max(
                        10,
                        width -
                        target.width -
                        10
                    );


                target.x =
                    Math.min(
                        target.x,
                        maxX
                    );


                target.element.style.left =
                    `${target.x}px`;

            }
        );

    }
);


/* ==================================================
   INITIAL HUD
   ================================================== */

updateHUD();
```
/* ==================================================
   FLOWTYPE V2
   ================================================== */

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

:root {
    --background: #0c0f14;
    --background-soft: #11151d;

    --text: #eef1f7;
    --muted: #777f91;
    --muted-dark: #505765;

    --accent: #9ba8ff;
    --accent-bright: #b8c1ff;
    --accent-soft: rgba(155, 168, 255, 0.12);

    --correct: #a5e8ba;
    --wrong: #ff8f9b;

    --border: rgba(255, 255, 255, 0.06);
}


/* ==================================================
   BODY
   ================================================== */

body {
    min-height: 100vh;

    background:
        radial-gradient(
            circle at 50% 25%,
            #171c28 0%,
            #0c0f14 62%
        );

    color: var(--text);

    font-family:
        Inter,
        system-ui,
        -apple-system,
        BlinkMacSystemFont,
        "Segoe UI",
        sans-serif;

    overflow: hidden;
}


/* ==================================================
   GAME
   ================================================== */

.game {
    height: 100vh;

    display: flex;
    flex-direction: column;
}


/* ==================================================
   TOP BAR
   ================================================== */

.top-bar {
    height: 75px;

    padding: 0 35px;

    display: flex;
    align-items: center;
    justify-content: space-between;

    border-bottom: 1px solid var(--border);

    background: rgba(12, 15, 20, 0.68);

    backdrop-filter: blur(15px);

    z-index: 20;
}


/* LOGO */

.logo {
    font-size: 21px;
    font-weight: 700;

    white-space: nowrap;
}

.logo span {
    color: var(--accent);

    margin-right: 7px;
}


/* LEVEL */

.level {
    position: absolute;

    left: 50%;

    transform: translateX(-50%);

    display: flex;
    align-items: center;
    gap: 8px;

    font-size: 12px;

    color: var(--muted);

    letter-spacing: 1.5px;
}

.level strong {
    color: var(--accent-bright);

    font-size: 13px;
}


/* STATS */

.stats {
    display: flex;
    align-items: center;
    gap: 25px;
}

.stat {
    display: flex;
    align-items: center;
    gap: 7px;
}

.stat span {
    font-size: 10px;

    color: var(--muted);

    letter-spacing: 1px;
}

.stat strong {
    font-size: 15px;

    font-weight: 500;

    min-width: 25px;
}


/* ==================================================
   GAME AREA
   ================================================== */

#gameArea {
    position: relative;

    flex: 1;

    overflow: hidden;

    isolation: isolate;
}


/* Subtle game atmosphere */

#gameArea::before {
    content: "";

    position: absolute;

    inset: 0;

    pointer-events: none;

    background:
        radial-gradient(
            circle at 50% 45%,
            rgba(155, 168, 255, 0.035),
            transparent 55%
        );

    z-index: -1;
}


/* ==================================================
   WELCOME
   ================================================== */

.welcome {
    position: absolute;

    top: 50%;
    left: 50%;

    transform: translate(-50%, -50%);

    text-align: center;

    width: 92%;

    max-width: 560px;

    z-index: 5;
}


.welcome-icon {
    width: 70px;
    height: 70px;

    display: flex;

    align-items: center;
    justify-content: center;

    margin: 0 auto 25px;

    border-radius: 20px;

    background: var(--accent-soft);

    color: var(--accent);

    font-size: 30px;

    box-shadow:
        0 0 35px rgba(155, 168, 255, 0.08);
}


.welcome h1 {
    font-size: 48px;

    letter-spacing: -2px;

    margin-bottom: 15px;
}


.welcome > p {
    color: var(--muted);

    line-height: 1.7;

    font-size: 15px;
}


/* ==================================================
   SPEED
   ================================================== */

.speed-section {
    margin-top: 28px;
}


.speed-title {
    color: var(--muted-dark);

    font-size: 11px;

    text-transform: uppercase;

    letter-spacing: 1.5px;

    margin-bottom: 12px;
}


.speed-options {
    display: flex;

    justify-content: center;

    flex-wrap: wrap;

    gap: 8px;
}


.speed-option {
    border: 1px solid var(--border);

    background: rgba(255,255,255,0.025);

    color: var(--muted);

    padding: 10px 13px;

    border-radius: 10px;

    font-size: 11px;

    cursor: pointer;

    display: flex;
    align-items: center;
    gap: 6px;

    transition:
        transform 0.2s ease,
        background 0.2s ease,
        border-color 0.2s ease,
        color 0.2s ease;
}


.speed-option:hover {
    transform: translateY(-2px);

    color: var(--text);

    background: rgba(255,255,255,0.05);
}


.speed-option.active {
    color: var(--text);

    border-color: rgba(155,168,255,0.38);

    background: var(--accent-soft);

    box-shadow:
        0 0 18px rgba(155,168,255,0.06);
}


.speed-icon {
    font-size: 14px;
}


/* ==================================================
   BUTTON
   ================================================== */

.start-button {
    margin-top: 28px;

    border: 1px solid rgba(155,168,255,0.35);

    background: var(--accent-soft);

    color: var(--text);

    padding: 13px 24px;

    border-radius: 12px;

    font-size: 14px;

    cursor: pointer;

    transition:
        0.25s ease;

    box-shadow:
        0 0 20px rgba(155,168,255,0.04);
}


.start-button:hover {
    background: rgba(155,168,255,0.2);

    border-color: rgba(155,168,255,0.55);

    transform: translateY(-2px);

    box-shadow:
        0 8px 30px rgba(155,168,255,0.08);
}


.start-button:active {
    transform: translateY(0);
}


/* ==================================================
   FALLING TARGET
   ================================================== */

.game-item {
    position: absolute;

    top: -60px;

    font-size: 24px;

    font-weight: 500;

    color: #aeb5c5;

    letter-spacing: 0.5px;

    user-select: none;

    pointer-events: none;

    white-space: nowrap;

    z-index: 3;

    opacity: 0;

    transform: translateY(0);

    transition:
        color 0.15s ease,
        text-shadow 0.15s ease,
        opacity 0.15s ease;
}


.game-item.visible {
    opacity: 1;
}


.game-item.single-letter {
    font-size: 34px;

    color: #c2c8d6;
}


.game-item.typing {
    color: var(--text);

    text-shadow:
        0 0 20px rgba(155,168,255,0.18);
}


.game-item .typed-part {
    color: var(--accent-bright);

    text-shadow:
        0 0 14px rgba(155,168,255,0.25);
}


.game-item .remaining-part {
    color: #aeb5c5;
}


/* ==================================================
   CORRECT
   ================================================== */

.game-item.correct {
    color: var(--correct);

    text-shadow:
        0 0 25px rgba(165,232,186,0.3);

    animation:
        targetCorrect 0.35s ease forwards;
}


/* ==================================================
   WRONG
   ================================================== */

.game-item.shake {
    color: var(--wrong);

    animation:
        shake 0.25s ease;
}


/* ==================================================
   MISSED
   ================================================== */

.game-item.missed {
    color: rgba(255, 143, 155, 0.5);

    animation:
        missed 0.3s ease forwards;
}


/* ==================================================
   ANIMATIONS
   ================================================== */

@keyframes targetCorrect {

    0% {
        opacity: 1;
        transform: scale(1);
    }

    50% {
        opacity: 1;
        transform: scale(1.3);
    }

    100% {
        opacity: 0;
        transform: scale(1.6);
    }
}


@keyframes shake {

    0%,
    100% {
        transform: translateX(0);
    }

    25% {
        transform: translateX(-7px);
    }

    50% {
        transform: translateX(7px);
    }

    75% {
        transform: translateX(-4px);
    }
}


@keyframes missed {

    from {
        opacity: 1;
        transform: scale(1);
    }

    to {
        opacity: 0;
        transform: scale(0.8);
    }
}


/* ==================================================
   GAME CONTROLS
   ================================================== */

.game-controls {
    position: absolute;

    top: 20px;
    right: 25px;

    display: flex;

    gap: 7px;

    z-index: 15;

    opacity: 0;

    pointer-events: none;

    transition: opacity 0.25s ease;
}


.game-controls.visible {
    opacity: 1;

    pointer-events: auto;
}


.control-button {
    width: 36px;
    height: 36px;

    display: flex;

    align-items: center;
    justify-content: center;

    border: 1px solid var(--border);

    border-radius: 10px;

    background: rgba(12,15,20,0.65);

    backdrop-filter: blur(10px);

    color: var(--muted);

    cursor: pointer;

    transition: 0.2s ease;
}


.control-button:hover {
    color: var(--text);

    border-color: rgba(155,168,255,0.3);

    background: var(--accent-soft);

    transform: translateY(-1px);
}


/* ==================================================
   PAUSE
   ================================================== */

.pause-overlay,
.results-overlay {
    position: absolute;

    inset: 0;

    display: flex;

    align-items: center;
    justify-content: center;

    background: rgba(7,9,13,0.68);

    backdrop-filter: blur(8px);

    z-index: 12;

    opacity: 0;

    pointer-events: none;

    transition: opacity 0.25s ease;
}


.pause-overlay.visible,
.results-overlay.visible {
    opacity: 1;

    pointer-events: auto;
}


.pause-card,
.results-card {
    width: min(90%, 430px);

    text-align: center;

    padding: 38px;

    border: 1px solid var(--border);

    border-radius: 22px;

    background: rgba(17,21,29,0.9);

    box-shadow:
        0 20px 80px rgba(0,0,0,0.35);

    animation: cardIn 0.25s ease;
}


.pause-icon,
.results-icon {
    font-size: 25px;

    color: var(--accent);

    margin-bottom: 16px;
}


.pause-card h2,
.results-card h2 {
    font-size: 30px;

    letter-spacing: -1px;

    margin-bottom: 10px;
}


.pause-card p {
    color: var(--muted);

    font-size: 14px;

    line-height: 1.6;
}


@keyframes cardIn {

    from {
        opacity: 0;
        transform: translateY(10px) scale(0.97);
    }

    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}


/* ==================================================
   RESULTS
   ================================================== */

.results-label {
    color: var(--muted);

    font-size: 10px;

    letter-spacing: 2px;

    margin-bottom: 8px;
}


.results-grid {
    display: grid;

    grid-template-columns: 1fr 1fr;

    gap: 10px;

    margin-top: 25px;
}


.results-grid > div {
    padding: 17px;

    border: 1px solid var(--border);

    border-radius: 14px;

    background: rgba(255,255,255,0.025);
}


.results-grid span {
    display: block;

    color: var(--muted);

    font-size: 10px;

    text-transform: uppercase;

    letter-spacing: 1px;

    margin-bottom: 7px;
}


.results-grid strong {
    font-size: 22px;

    font-weight: 500;
}


.results-card .start-button {
    margin-top: 24px;
}


/* ==================================================
   BURST
   ================================================== */

.burst-flash {
    position: absolute;

    width: 10px;
    height: 10px;

    border-radius: 50%;

    background: var(--correct);

    box-shadow:
        0 0 25px var(--correct);

    pointer-events: none;

    animation: flash 0.45s ease forwards;

    z-index: 8;
}


.burst-letter {
    position: absolute;

    pointer-events: none;

    color: var(--correct);

    font-weight: 500;

    animation: burstLetter 0.75s ease forwards;

    z-index: 9;
}


@keyframes flash {

    0% {
        opacity: 0.9;
        transform: scale(0.5);
    }

    100% {
        opacity: 0;
        transform: scale(5);
    }
}


@keyframes burstLetter {

    0% {
        opacity: 1;

        transform:
            translate(-50%, -50%)
            scale(1)
            rotate(0);
    }

    100% {
        opacity: 0;

        transform:
            translate(
                calc(-50% + var(--move-x)),
                calc(-50% + var(--move-y))
            )
            scale(0.5)
            rotate(var(--rotate));
    }
}


/* ==================================================
   FOOTER
   ================================================== */

footer {
    height: 45px;

    display: flex;

    align-items: center;
    justify-content: center;

    gap: 10px;

    color: var(--muted-dark);

    font-size: 12px;

    border-top: 1px solid rgba(255,255,255,0.03);
}


footer a {
    color: var(--muted);

    text-decoration: none;

    transition: color 0.2s ease;
}


footer a:hover {
    color: var(--accent);
}


/* ==================================================
   MOBILE
   ================================================== */

@media (max-width: 700px) {

    .top-bar {
        height: 68px;

        padding: 0 15px;
    }


    .logo {
        font-size: 18px;
    }


    .level {
        display: none;
    }


    .stats {
        gap: 10px;
    }


    .stat {
        display: block;

        text-align: center;
    }


    .stat span {
        display: block;

        font-size: 8px;

        margin-bottom: 2px;
    }


    .stat strong {
        font-size: 13px;
    }


    .typed-stat {
        display: none;
    }


    .welcome h1 {
        font-size: 40px;
    }


    .welcome > p {
        font-size: 13px;
    }


    .speed-options {
        gap: 6px;
    }


    .speed-option {
        padding: 8px 9px;

        font-size: 10px;
    }


    .game-item {
        font-size: 21px;
    }


    .game-item.single-letter {
        font-size: 30px;
    }


    .game-controls {
        top: 12px;
        right: 12px;
    }


    .pause-card,
    .results-card {
        padding: 28px 20px;
    }


    footer {
        font-size: 10px;
    }
}


@media (max-width: 430px) {

    .stats {
        gap: 6px;
    }


    .stat strong {
        font-size: 12px;
    }


    .speed-option {
        min-width: 85px;

        justify-content: center;
    }


    .speed-icon {
        display: none;
    }
}
