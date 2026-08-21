const gameArea = document.getElementById("gameArea");
const welcome = document.getElementById("welcome");
const startButton = document.getElementById("startButton");
const scoreDisplay = document.getElementById("score");


// --------------------------------------------------
// WORD BANK
// --------------------------------------------------

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
    "peaceful"

];


// --------------------------------------------------
// LETTER BANK
// --------------------------------------------------

const letters = "abcdefghijklmnopqrstuvwxyz";


// --------------------------------------------------
// GAME VARIABLES
// --------------------------------------------------

let currentTarget = "";

let currentElement = null;

let score = 0;

let gameStarted = false;


// --------------------------------------------------
// RANDOM LETTER
// --------------------------------------------------

function randomLetter() {

    return letters[
        Math.floor(
            Math.random() * letters.length
        )
    ];

}


// --------------------------------------------------
// RANDOM WORD
// --------------------------------------------------

function randomWord() {

    return words[
        Math.floor(
            Math.random() * words.length
        )
    ];

}


// --------------------------------------------------
// CREATE TARGET
// --------------------------------------------------

function createTarget() {

    // Remove previous target

    if (currentElement) {

        currentElement.remove();

    }


    /*
        60% chance of a single letter
        40% chance of a word
    */

    const isLetter = Math.random() < 0.6;


    if (isLetter) {

        currentTarget = randomLetter();

    } else {

        currentTarget = randomWord();

    }


    // Create element

    const element = document.createElement("div");

    element.classList.add("game-item");

    element.textContent = currentTarget;


    if (isLetter) {

        element.classList.add("single-letter");

    }


    // --------------------------------------------------
    // RANDOM POSITION
    // --------------------------------------------------

    const areaWidth = gameArea.clientWidth;

    const areaHeight = gameArea.clientHeight;


    const padding = 80;


    const maxX = Math.max(
        padding,
        areaWidth - padding
    );


    const maxY = Math.max(
        padding,
        areaHeight - padding
    );


    const x =
        Math.random() *
        (maxX - padding) +
        padding;


    const y =
        Math.random() *
        (maxY - padding) +
        padding;


    element.style.left = `${x}px`;

    element.style.top = `${y}px`;


    // Add to screen

    gameArea.appendChild(element);


    currentElement = element;

}


// --------------------------------------------------
// START GAME
// --------------------------------------------------

function startGame() {

    gameStarted = true;

    score = 0;

    scoreDisplay.textContent = score;


    welcome.style.display = "none";


    createTarget();

}


// --------------------------------------------------
// KEYBOARD INPUT
// --------------------------------------------------

document.addEventListener("keydown", (event) => {

    if (!gameStarted) {
        return;
    }


    /*
        Ignore special keys
        like Shift, Ctrl, Alt, etc.
    */

    if (event.key.length !== 1) {
        return;
    }


    const typedKey = event.key.toLowerCase();


    // --------------------------------------------------
    // SINGLE LETTER
    // --------------------------------------------------

    if (currentTarget.length === 1) {

        if (typedKey === currentTarget) {

            targetCompleted();

        }

        return;
    }


    // --------------------------------------------------
    // WORD
    // --------------------------------------------------

    /*
        For words we keep track of what the user
        has typed so far.
    */

    handleWordTyping(typedKey);

});


// --------------------------------------------------
// WORD TYPING
// --------------------------------------------------

let typedWord = "";


function handleWordTyping(key) {

    /*
        Add typed character
    */

    typedWord += key;


    /*
        Check whether the typed part matches
        the beginning of the target.
    */

    if (
        !currentTarget.startsWith(typedWord)
    ) {

        /*
            Wrong character.

            We don't punish the player.

            Instead, simply reset the current word
            so they can try again.
        */

        typedWord = "";

        return;
    }


    /*
        Word completed
    */

    if (typedWord === currentTarget) {

        typedWord = "";

        targetCompleted();

    }

}


// --------------------------------------------------
// TARGET COMPLETED
// --------------------------------------------------

function targetCompleted() {

    if (!currentElement) {
        return;
    }


    currentElement.classList.add("correct");


    score++;

    scoreDisplay.textContent = score;


    /*
        Small delay makes the disappearance
        feel smoother.
    */

    setTimeout(() => {

        createTarget();

    }, 180);

}


// --------------------------------------------------
// START BUTTON
// --------------------------------------------------

startButton.addEventListener(
    "click",
    startGame
);
