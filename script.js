const gameArea =
    document.getElementById("gameArea");

const welcome =
    document.getElementById("welcome");

const startButton =
    document.getElementById("startButton");

const scoreDisplay =
    document.getElementById("score");


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
    "peaceful"

];


// ==================================================
// LETTER BANK
// ==================================================

const letters =
    "abcdefghijklmnopqrstuvwxyz";


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
        60% letters
        40% words
    */

    const isLetter =
        Math.random() < 0.60;


    if (isLetter) {

        currentTarget =
            randomLetter();

    } else {

        currentTarget =
            randomWord();

    }


    const element =
        document.createElement("div");


    element.classList.add(
        "game-item"
    );


    /*
        WORD
    */

    if (!isLetter) {

        currentTarget
            .split("")
            .forEach((character, index) => {

                const span =
                    document.createElement("span");

                span.classList.add(
                    "target-character"
                );

                span.textContent =
                    character;

                /*
                    First character is the
                    current character.
                */

                if (index === 0) {

                    span.classList.add(
                        "current"
                    );

                }

                element.appendChild(span);

            });

    }


    /*
        SINGLE LETTER
    */

    else {

        element.textContent =
            currentTarget;

        element.classList.add(
            "single-letter"
        );

    }


    /*
        RANDOM POSITION
    */

    const areaWidth =
        gameArea.clientWidth;

    const areaHeight =
        gameArea.clientHeight;

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


    element.style.left =
        `${x}px`;

    element.style.top =
        `${y}px`;


    gameArea.appendChild(
        element
    );


    currentElement =
        element;

}


// ==================================================
// START GAME
// ==================================================

function startGame() {

    gameStarted = true;

    score = 0;

    scoreDisplay.textContent =
        score;

    welcome.style.display =
        "none";

    createTarget();

}


// ==================================================
// KEYBOARD
// ==================================================

document.addEventListener(
    "keydown",
    (event) => {

        if (!gameStarted) {
            return;
        }


        if (!acceptingInput) {
            return;
        }


        /*
            Ignore Shift, Ctrl, Alt,
            Enter, Arrow keys etc.
        */

        if (event.key.length !== 1) {
            return;
        }


        const key =
            event.key.toLowerCase();


        /*
            SINGLE LETTER
        */

        if (
            currentTarget.length === 1
        ) {

            if (
                key === currentTarget
            ) {

                correctSingleLetter();

            } else {

                wrongInput();

            }

            return;

        }


        /*
            WORD
        */

        handleWordTyping(key);

    }
);


// ==================================================
// WORD TYPING
// ==================================================

function handleWordTyping(key) {

    /*
        Character user is currently
        supposed to type.
    */

    const currentIndex =
        typedWord.length;


    const expectedCharacter =
        currentTarget[
            currentIndex
        ];


    /*
        CORRECT
    */

    if (
        key === expectedCharacter
    ) {

        typedWord += key;


        updateWordProgress();


        /*
            Whole word completed
        */

        if (
            typedWord === currentTarget
        ) {

            targetCompleted();

        }

        return;

    }


    /*
        WRONG
    */

    wrongInput();

}


// ==================================================
// UPDATE WORD PROGRESS
// ==================================================

function updateWordProgress() {

    const characters =
        currentElement.querySelectorAll(
            ".target-character"
        );


    characters.forEach(
        (character, index) => {

            character.classList.remove(
                "current"
            );


            if (
                index < typedWord.length
            ) {

                character.classList.add(
                    "correct"
                );

            }

        }
    );


    /*
        Highlight next character
    */

    if (
        typedWord.length <
        characters.length
    ) {

        characters[
            typedWord.length
        ].classList.add(
            "current"
        );

    }

}


// ==================================================
// WRONG INPUT
// ==================================================

function wrongInput() {

    if (!currentElement) {
        return;
    }


    /*
        Remove previous wrong state
        so animation can restart.
    */

    currentElement.classList.remove(
        "wrong"
    );


    void currentElement.offsetWidth;


    currentElement.classList.add(
        "wrong"
    );


    /*
        Mobile vibration
    */

    if (
        navigator.vibrate
    ) {

        navigator.vibrate(35);

    }


    /*
        Remove red state after
        a short moment.
    */

    setTimeout(() => {

        if (currentElement) {

            currentElement.classList.remove(
                "wrong"
            );

        }

    }, 220);

}


// ==================================================
// CORRECT SINGLE LETTER
// ==================================================

function correctSingleLetter() {

    if (!currentElement) {
        return;
    }


    /*
        Green feedback first
    */

    currentElement.classList.add(
        "correct-letter"
    );


    /*
        Small delay before burst
        so user sees the green state.
    */

    setTimeout(() => {

        targetCompleted();

    }, 100);

}


// ==================================================
// TARGET COMPLETED
// ==================================================

function targetCompleted() {

    if (
        !currentElement ||
        !acceptingInput
    ) {

        return;

    }


    acceptingInput = false;


    const element =
        currentElement;


    /*
        Get target position
    */

    const rect =
        element.getBoundingClientRect();

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


    /*
        Create burst
    */

    createBurst(
        currentTarget,
        centerX,
        centerY
    );


    element.remove();

    currentElement =
        null;


    /*
        Progress
    */

    score++;

    scoreDisplay.textContent =
        score;


    /*
        Next target
    */

    setTimeout(() => {

        createTarget();

    }, 420);

}


// ==================================================
// BURST EFFECT
// ==================================================

function createBurst(
    text,
    x,
    y
) {

    /*
        Center flash
    */

    const flash =
        document.createElement("div");


    flash.classList.add(
        "burst-flash"
    );


    flash.style.left =
        `${x - 5}px`;


    flash.style.top =
        `${y - 5}px`;


    gameArea.appendChild(
        flash
    );


    setTimeout(() => {

        flash.remove();

    }, 500);


    /*
        Turn target into particles
    */

    let characters =
        text.split("");


    /*
        Single letters produce
        random mini letters.
    */

    if (
        characters.length === 1
    ) {

        const randomCharacters =
            "abcdefghijklmnopqrstuvwxyz";


        for (
            let i = 0;
            i < 5;
            i++
        ) {

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


    /*
        Create particles
    */

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


            /*
                Random direction
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
                Random particle size
            */

            particle.style.fontSize =
                `${12 + Math.random() * 8}px`;


            /*
                Tiny stagger
            */

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


// ==================================================
// START BUTTON
// ==================================================

startButton.addEventListener(
    "click",
    startGame
);
