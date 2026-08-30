const gameArea = document.getElementById("gameArea");
const welcome = document.getElementById("welcome");
const startButton = document.getElementById("startButton");
const scoreDisplay = document.getElementById("score");


// ==================================================
// WORD BANK
// ==================================================

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
    "Bicycle",
    "Library",
    "Diamond",
    "Theater",
    "Rainbow",
    "Machine",
    "Vehicle",
    "Sunrise",
    "Freedom",
    "Harmony",
    "Kitchen",
"Country",
"Network",
"Journey",
"Mystery",
"Curtain",
"Promise",
"Handbag",
"Balloon",
"Weather",
"Cottage",
"Blanket",
"Plumage",
"Biscuit",
"Iceberg",
"Cupcake",
"Earring",
"Desktop",
"Company",
"Example",
"Council",
"Service",
"Problem",
"Control",
"Society",
"Process",
"Support",
"Morning",
"Century",
"History",
"Section",
"Subject",
"Quality",
"Project",
"Chapter",
"Manager",
"Account",
"Success",
"Capital",
"Defense",
"Product",
"Village",
"Husband",
"Science",
"Economy",
"Picture",
"College",
"Station",
"Species",
"Concern",
"Purpose",
"Ability",

];


// ==================================================
// LETTER BANK
// ==================================================

const letters = "abcdefghijklmnopqrstuvwxyz";


// ==================================================
// GAME VARIABLES
// ==================================================

let currentTarget = "";

let currentElement = null;

let score = 0;

let gameStarted = false;

let typedWord = "";

let acceptingInput = true;


// ==================================================
// RANDOM LETTER
// ==================================================

function randomLetter() {

    return letters[
        Math.floor(
            Math.random() * letters.length
        )
    ];

}


// ==================================================
// RANDOM WORD
// ==================================================

function randomWord() {

    return words[
        Math.floor(
            Math.random() * words.length
        )
    ];

}


// ==================================================
// CREATE TARGET
// ==================================================

function createTarget() {

    if (currentElement) {

        currentElement.remove();

    }


    typedWord = "";

    acceptingInput = true;


    /*
        60% single letters
        40% words
    */

    const isLetter = Math.random() < 0.60;


    if (isLetter) {

        currentTarget = randomLetter();

    } else {

        currentTarget = randomWord();

    }


    const element = document.createElement("div");

    element.classList.add("game-item");

    element.textContent = currentTarget;


    if (isLetter) {

        element.classList.add("single-letter");

    }


    /*
        Random position
    */

    const areaWidth = gameArea.clientWidth;

    const areaHeight = gameArea.clientHeight;

    const padding = 80;


    const x =
        Math.random() *
        Math.max(
            1,
            areaWidth - padding * 2
        ) + padding;


    const y =
        Math.random() *
        Math.max(
            1,
            areaHeight - padding * 2
        ) + padding;


    element.style.left = `${x}px`;

    element.style.top = `${y}px`;


    gameArea.appendChild(element);

    currentElement = element;

}


// ==================================================
// START GAME
// ==================================================

function startGame() {

    gameStarted = true;

    score = 0;

    scoreDisplay.textContent = score;

    welcome.style.display = "none";

    createTarget();

}


// ==================================================
// KEYBOARD INPUT
// ==================================================

document.addEventListener("keydown", (event) => {

    if (!gameStarted) {
        return;
    }


    if (!acceptingInput) {
        return;
    }


    /*
        Ignore Shift, Ctrl, Alt, Enter, etc.
    */

    if (event.key.length !== 1) {
        return;
    }


    const key = event.key.toLowerCase();


    // ==================================================
    // SINGLE LETTER
    // ==================================================

    if (currentTarget.length === 1) {

        if (key === currentTarget) {

            targetCompleted();

        } else {

            wrongInput();

        }

        return;
    }


    // ==================================================
    // WORD
    // ==================================================

    handleWordTyping(key);

});


// ==================================================
// WORD TYPING
// ==================================================

function handleWordTyping(key) {

    typedWord += key;


    /*
        Correct so far
    */

    if (
        currentTarget.startsWith(typedWord)
    ) {

        /*
            Word completed
        */

        if (
            typedWord === currentTarget
        ) {

            targetCompleted();

        }

        return;
    }


    /*
        Wrong character
    */

    wrongInput();

    typedWord = "";

}


// ==================================================
// WRONG INPUT
// ==================================================

function wrongInput() {

    if (!currentElement) {
        return;
    }


    /*
        Remove previous animation class
        so the animation can play again.
    */

    currentElement.classList.remove("shake");


    /*
        Force browser to restart animation.
    */

    void currentElement.offsetWidth;


    currentElement.classList.add("shake");


    /*
        Optional tiny haptic feedback
        on supported mobile devices.
    */

    if (
        navigator.vibrate
    ) {

        navigator.vibrate(35);

    }

}


// ==================================================
// CORRECT TARGET
// ==================================================

function targetCompleted() {

    if (
        !currentElement ||
        !acceptingInput
    ) {

        return;

    }


    acceptingInput = false;


    const element = currentElement;


    /*
        Get the target's position
    */

    const rect = element.getBoundingClientRect();

    const areaRect = gameArea.getBoundingClientRect();


    const centerX =
        rect.left -
        areaRect.left +
        rect.width / 2;


    const centerY =
        rect.top -
        areaRect.top +
        rect.height / 2;


    /*
        Create the burst
    */

    createBurst(
        currentTarget,
        centerX,
        centerY
    );


    /*
        Remove original target
    */

    element.remove();

    currentElement = null;


    /*
        Increase progress
    */

    score++;

    scoreDisplay.textContent = score;


    /*
        New target shortly after burst
    */

    setTimeout(() => {

        createTarget();

    }, 420);

}


// ==================================================
// BURST EFFECT
// ==================================================

function createBurst(text, x, y) {

    /*
        Flash in the center
    */

    const flash = document.createElement("div");

    flash.classList.add("burst-flash");

    flash.style.left = `${x - 5}px`;

    flash.style.top = `${y - 5}px`;

    gameArea.appendChild(flash);


    setTimeout(() => {

        flash.remove();

    }, 500);


    /*
        Turn the original text into
        individual letters.
    */

    const characters = text.split("");


    /*
        If it is only one letter,
        create several tiny random letters.
    */

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


    characters.forEach((character, index) => {

        const particle =
            document.createElement("span");


        particle.classList.add(
            "burst-letter"
        );


        particle.textContent = character;


        particle.style.left =
            `${x}px`;


        particle.style.top =
            `${y}px`;


        /*
            Different direction for
            every particle.
        */

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


        /*
            Slight variation in size
        */

        particle.style.fontSize =
            `${12 + Math.random() * 8}px`;


        /*
            Tiny stagger makes the burst
            feel organic.
        */

        particle.style.animationDelay =
            `${index * 15}ms`;


        gameArea.appendChild(particle);


        setTimeout(() => {

            particle.remove();

        }, 800);

    });

}


// ==================================================
// START BUTTON
// ==================================================

startButton.addEventListener(
    "click",
    startGame
);
