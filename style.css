* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

:root {
    --background: #0c0f14;
    --text: #eef1f7;
    --muted: #777f91;
    --accent: #9ba8ff;
    --accent-soft: rgba(155, 168, 255, 0.12);
    --correct: #a5e8ba;
}

body {
    min-height: 100vh;

    background:
        radial-gradient(
            circle at 50% 30%,
            #171c28 0%,
            #0c0f14 60%
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


/* GAME */

.game {
    height: 100vh;

    display: flex;
    flex-direction: column;
}


/* TOP BAR */

.top-bar {
    height: 75px;

    padding: 0 35px;

    display: flex;

    align-items: center;

    justify-content: space-between;

    border-bottom: 1px solid rgba(255,255,255,0.05);

    background: rgba(12,15,20,0.65);

    backdrop-filter: blur(15px);

    z-index: 10;
}

.logo {
    font-size: 21px;

    font-weight: 700;
}

.logo span {
    color: var(--accent);

    margin-right: 7px;
}

.level {
    position: absolute;

    left: 50%;

    transform: translateX(-50%);

    font-size: 13px;

    color: var(--muted);

    letter-spacing: 1px;

    text-transform: uppercase;
}

.score {
    display: flex;

    align-items: center;

    gap: 10px;
}

.score span {
    font-size: 12px;

    color: var(--muted);
}

.score strong {
    font-size: 18px;

    font-weight: 500;
}


/* GAME AREA */

#gameArea {
    position: relative;

    flex: 1;

    overflow: hidden;
}


/* WELCOME */

.welcome {
    position: absolute;

    top: 50%;
    left: 50%;

    transform: translate(-50%, -50%);

    text-align: center;

    width: 90%;

    max-width: 500px;
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
}

.welcome h1 {
    font-size: 48px;

    letter-spacing: -2px;

    margin-bottom: 15px;
}

.welcome p {
    color: var(--muted);

    line-height: 1.7;

    font-size: 15px;
}

.welcome button {
    margin-top: 30px;

    border: 1px solid rgba(155,168,255,0.35);

    background: var(--accent-soft);

    color: var(--text);

    padding: 13px 23px;

    border-radius: 12px;

    font-size: 14px;

    cursor: pointer;

    transition: 0.25s ease;
}

.welcome button:hover {
    background: rgba(155,168,255,0.2);

    transform: translateY(-2px);
}


/* GAME ITEM */

.game-item {
    position: absolute;

    font-size: 25px;

    font-weight: 500;

    color: #aeb5c5;

    letter-spacing: 0.5px;

    cursor: default;

    user-select: none;

    animation: appear 0.25s ease;

    transition:
        opacity 0.2s ease,
        transform 0.2s ease,
        color 0.2s ease;
}


/* Single letters are slightly larger */

.game-item.single-letter {
    font-size: 34px;

    color: #c2c8d6;
}


/* Current target */

.game-item.target {
    color: var(--text);

    text-shadow:
        0 0 20px rgba(155,168,255,0.15);
}


/* Correct */

.game-item.correct {
    opacity: 0;

    transform: scale(1.5);

    color: var(--correct);
}


/* APPEAR */

@keyframes appear {

    from {
        opacity: 0;

        transform: scale(0.85);
    }

    to {
        opacity: 1;

        transform: scale(1);
    }

}


/* FOOTER */

footer {
    height: 45px;

    display: flex;

    align-items: center;

    justify-content: center;

    color: #505765;

    font-size: 12px;

    border-top: 1px solid rgba(255,255,255,0.03);
}


/* MOBILE */

@media (max-width: 600px) {

    .top-bar {
        padding: 0 18px;
    }

    .welcome h1 {
        font-size: 38px;
    }

    .game-item {
        font-size: 21px;
    }

    .game-item.single-letter {
        font-size: 30px;
    }

}
