// =====================================================
// ELEMENTS
// =====================================================

const gameArea =
    document.getElementById("gameArea");

const welcome =
    document.getElementById("welcome");

const startButton =
    document.getElementById("startButton");

const scoreDisplay =
    document.getElementById("score");

const speedButtons =
    document.querySelectorAll(".speed-option");


// =====================================================
// WORD BANK
// =====================================================

const words = [

    // Short & Easy
    "cat",
    "dog",
    "sun",
    "sky",
    "moon",
    "star",
    "rain",
    "tree",
    "book",
    "pen",
    "cup",
    "car",
    "bus",
    "box",
    "ball",
    "fish",
    "bird",
    "door",
    "road",
    "home",
    "room",
    "food",
    "milk",
    "cake",
    "rice",
    "water",
    "fire",
    "wind",
    "snow",
    "sand",

    // Everyday Words
    "house",
    "school",
    "friend",
    "family",
    "phone",
    "table",
    "chair",
    "window",
    "garden",
    "flower",
    "coffee",
    "music",
    "movie",
    "game",
    "world",
    "night",
    "morning",
    "evening",
    "summer",
    "winter",
    "spring",
    "autumn",
    "street",
    "market",
    "store",
    "office",
    "camera",
    "screen",
    "light",
    "cloud",

    // Fun Words
    "happy",
    "smile",
    "dream",
    "magic",
    "power",
    "energy",
    "speed",
    "focus",
    "brain",
    "smart",
    "quick",
    "strong",
    "brave",
    "funny",
    "laugh",
    "dance",
    "party",
    "music",
    "story",
    "movie",
    "anime",
    "gaming",
    "player",
    "level",
    "score",
    "quest",
    "hero",
    "battle",
    "pixel",
    "dragon",

    // Nature
    "ocean",
    "river",
    "mountain",
    "forest",
    "island",
    "beach",
    "earth",
    "planet",
    "flower",
    "garden",
    "grass",
    "leaf",
    "stone",
    "wood",
    "tree",
    "rain",
    "storm",
    "thunder",
    "sunshine",
    "sunset",
    "sunrise",
    "moonlight",
    "starlight",
    "rainbow",
    "breeze",

    // Technology
    "computer",
    "keyboard",
    "mouse",
    "laptop",
    "mobile",
    "internet",
    "website",
    "browser",
    "coding",
    "program",
    "screen",
    "server",
    "network",
    "digital",
    "online",
    "system",
    "window",
    "folder",
    "file",
    "data",
    "robot",
    "future",
    "technology",
    "software",
    "hardware",

    // Medium Words
    "adventure",
    "beautiful",
    "creative",
    "peaceful",
    "freedom",
    "journey",
    "discover",
    "explore",
    "imagine",
    "inspire",
    "perfect",
    "amazing",
    "awesome",
    "wonderful",
    "fantastic",
    "positive",
    "simple",
    "natural",
    "special",
    "different",
    "favorite",
    "together",
    "remember",
    "believe",
    "success",
    "challenge",
    "practice",
    "progress",
    "future",
    "dreamer",

    // More Variety
    "apple",
    "banana",
    "orange",
    "mango",
    "pizza",
    "burger",
    "noodle",
    "bread",
    "sugar",
    "honey",
    "water",
    "juice",
    "breakfast",
    "lunch",
    "dinner",
    "kitchen",
    "school",
    "teacher",
    "student",
    "college",
    "library",
    "notebook",
    "pencil",
    "paper",
    "lesson",
    "question",
    "answer",
    "learn",
    "study",
    "knowledge"

];


// =====================================================
// LETTER BANK
// =====================================================

const letters =
    "abcdefghijklmnopqrstuvwxyz";


// =====================================================
// SPEED SETTINGS
// =====================================================

const speedSettings = {

    slow: {

        fallTime: 9500,

        spawnTime: 1500

    },

    easy: {

        fallTime: 7500,

        spawnTime: 1200

    },

    normal: {

        fallTime: 6000,

        spawnTime: 950

    },

    fast: {

        fallTime: 4500,

        spawnTime: 750

    },

    "very-fast": {

        fallTime: 3200,

        spawnTime: 600

    }

};


// =====================================================
// GAME VARIABLES
// =====================================================

let selectedSpeed = "slow";

let gameStarted = false;

let score = 0;

let spawnTimer = null;

let targets = [];


// =====================================================
// RANDOM LETTER
// =====================================================

function getRandomLetter() {

    return letters[
        Math.floor(
            Math.random() *
            letters.length
        )
    ];

}


// =====================================================
// RANDOM WORD
// =====================================================

function getRandomWord() {

    return words[
        Math.floor(
            Math.random() *
            words.length
        )
    ];

}


// =====================================================
// RANDOM TARGET
// =====================================================

function getRandomTarget() {

    /*
        60% letter
        40% word
    */

    if (Math.random() < 0.60) {

        return {

            text: getRandomLetter(),

            isLetter: true

        };

    }


    return {

        text: getRandomWord(),

        isLetter: false

    };

}


// =====================================================
// SPEED BUTTONS
// =====================================================

speedButtons.forEach(button => {

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

});


// =====================================================
// CREATE FALLING TARGET
// =====================================================

function createTarget() {

    const target =
        getRandomTarget();


    const element =
        document.createElement("div");


    element.classList.add(
        "falling-item"
    );


    if (target.isLetter) {

        element.classList.add(
            "single-letter"
        );

    }


    /*
        Create individual characters
        for words.
    */

    if (!target.isLetter) {

        target.text
            .split("")
            .forEach(
                (character, index) => {

                    const span =
                        document.createElement(
                            "span"
                        );


                    span.classList.add(
                        "character"
                    );


                    span.textContent =
                        character;


                    /*
                        First character
                        starts highlighted.
                    */

                    if (index === 0) {

                        span.classList.add(
                            "current"
                        );

                    }


                    element.appendChild(
                        span
                    );

                }
            );

    }

    else {

        element.textContent =
            target.text;

    }


    // =================================================
    // RANDOM HORIZONTAL POSITION
    // =================================================

    const areaWidth =
        gameArea.clientWidth;


    const maxWidth =
        Math.max(
            50,
            areaWidth - 120
        );


    const x =
        30 +
        Math.random() *
        Math.max(
            1,
            maxWidth - 30
        );


    element.style.left =
        `${x}px`;


    // =================================================
    // FALL SPEED
    // =================================================

    const settings =
        speedSettings[selectedSpeed];


    element.style.animationDuration =
        `${settings.fallTime}ms`;


    /*
        Add target to game area.
    */

    gameArea.appendChild(
        element
    );


    /*
        Store target.
    */

    targets.push({

        element: element,

        text: target.text,

        typed: "",

        isLetter: target.isLetter,

        createdAt: Date.now()

    });


    /*
        Clean target when animation ends.
    */

    setTimeout(() => {

        removeTarget(
            element
        );

    }, settings.fallTime + 300);

}


// =====================================================
// REMOVE TARGET
// =====================================================

function removeTarget(element) {

    const index =
        targets.findIndex(
            target =>
                target.element === element
        );


    if (index !== -1) {

        targets.splice(
            index,
            1
        );

    }


    if (
        element &&
        element.parentNode
    ) {

        element.remove();

    }

}


// =====================================================
// SPAWN LOOP
// =====================================================

function startSpawning() {

    stopSpawning();


    const settings =
        speedSettings[selectedSpeed];


    createTarget();


    spawnTimer =
        setInterval(() => {

            createTarget();

        }, settings.spawnTime);

}


// =====================================================
// STOP SPAWNING
// =====================================================

function stopSpawning() {

    if (spawnTimer) {

        clearInterval(
            spawnTimer
        );

        spawnTimer = null;

    }

}


// =====================================================
// START GAME
// =====================================================

function startGame() {

    gameStarted = true;

    score = 0;

    scoreDisplay.textContent =
        score;


    welcome.style.display =
        "none";


    startSpawning();

}


// =====================================================
// KEYBOARD INPUT
// =====================================================

document.addEventListener(
    "keydown",
    event => {

        if (!gameStarted) {
            return;
        }


        /*
            Ignore special keys.
        */

        if (event.key.length !== 1) {
            return;
        }


        const key =
            event.key.toLowerCase();


        /*
            Find a target that can accept
            this character.

            This means the user can type
            whichever visible target they want.
        */

        const matchingTarget =
            findMatchingTarget(key);


        if (matchingTarget) {

            handleCorrectInput(
                matchingTarget,
                key
            );

        }

        else {

            handleWrongInput();

        }

    }
);


// =====================================================
// FIND MATCHING TARGET
// =====================================================

function findMatchingTarget(key) {

    /*
        Look for a target where the typed
        key is the next expected character.
    */

    for (
        const target of targets
    ) {

        const nextCharacter =
            target.text[
                target.typed.length
            ];


        if (
            nextCharacter === key
        ) {

            return target;

        }

    }


    return null;

}


// =====================================================
// CORRECT INPUT
// =====================================================

function handleCorrectInput(
    target,
    key
) {

    target.typed += key;


    /*
        SINGLE LETTER
    */

    if (target.isLetter) {

        target.element.classList.add(
            "correct"
        );


        createBurst(
            target.element,
            target.text
        );


        score++;

        scoreDisplay.textContent =
            score;


        removeTarget(
            target.element
        );


        return;

    }


    /*
        WORD
    */

    updateTargetVisual(
        target
    );


    /*
        WORD COMPLETED
    */

    if (
        target.typed === target.text
    ) {

        createBurst(
            target.element,
            target.text
        );


        score++;

        scoreDisplay.textContent =
            score;


        removeTarget(
            target.element
        );

    }

}


// =====================================================
// UPDATE WORD VISUAL
// =====================================================

function updateTargetVisual(target) {

    const characters =
        target.element.querySelectorAll(
            ".character"
        );


    characters.forEach(
        (character, index) => {

            character.classList.remove(
                "correct"
            );

            character.classList.remove(
                "current"
            );


            /*
                Already typed
            */

            if (
                index <
                target.typed.length
            ) {

                character.classList.add(
                    "correct"
                );

            }


            /*
                Current character
            */

            else if (
                index ===
                target.typed.length
            ) {

                character.classList.add(
                    "current"
                );

            }

        }
    );

}


// =====================================================
// WRONG INPUT
// =====================================================

function handleWrongInput() {

    /*
        If there are targets on screen,
        shake the nearest/current one.
    */

    if (targets.length === 0) {
        return;
    }


    /*
        Pick the lowest visible target
        as the feedback target.
    */

    let target =
        targets[0];


    for (
        const item of targets
    ) {

        if (
            item.element.offsetTop >
            target.element.offsetTop
        ) {

            target = item;

        }

    }


    const element =
        target.element;


    /*
        Restart animation.
    */

    element.classList.remove(
        "wrong"
    );


    void element.offsetWidth;


    element.classList.add(
        "wrong"
    );


    /*
        Mobile haptic feedback.
    */

    if (
        navigator.vibrate
    ) {

        navigator.vibrate(35);

    }


    setTimeout(() => {

        if (
            element &&
            element.parentNode
        ) {

            element.classList.remove(
                "wrong"
            );

        }

    }, 220);

}


// =====================================================
// BURST EFFECT
// =====================================================

function createBurst(
    element,
    text
) {

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
        Central flash.
    */

    const flash =
        document.createElement("div");


    flash.classList.add(
        "burst-flash"
    );


    flash.style.left =
        `${centerX - 5}px`;


    flash.style.top =
        `${centerY - 5}px`;


    gameArea.appendChild(
        flash
    );


    setTimeout(() => {

        flash.remove();

    }, 500);


    /*
        Convert the target into
        flying letters.
    */

    let characters =
        text.split("");


    /*
        Single letters create
        extra random letters.
    */

    if (
        characters.length === 1
    ) {

        const randomLetters =
            "abcdefghijklmnopqrstuvwxyz";


        for (
            let i = 0;
            i < 5;
            i++
        ) {

            characters.push(
                randomLetters[
                    Math.floor(
                        Math.random() *
                        randomLetters.length
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
                `${centerX}px`;


            particle.style.top =
                `${centerY}px`;


            /*
                Random direction.
            */

            const angle =
                Math.random() *
                Math.PI *
                2;


            const distance =
                30 +
                Math.random() *
                90;


            const moveX =
                Math.cos(angle) *
                distance;


            const moveY =
                Math.sin(angle) *
                distance;


            const rotation =
                (
                    Math.random() -
                    0.5
                ) * 360;


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


            particle.style.animationDelay =
                `${index * 15}ms`;


            gameArea.appendChild(
                particle
            );


            setTimeout(() => {

                particle.remove();

            }, 850);

        }
    );

}


// =====================================================
// START BUTTON
// =====================================================

startButton.addEventListener(
    "click",
    startGame
);
