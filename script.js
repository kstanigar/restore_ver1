// game.js
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;

const player = {
    x: canvas.width / 2,
    y: canvas.height - 50,
    width: 50,
    height: 50,
    speed: 5,
    bullets: [],
};

const levels = [
    { word: "DO MORE", letters: [], barriers: [], enemies: [] },
    { word: "RESTORE", letters: [], barriers: [], enemies: [] },
    { word: "FINAL", letters: [], barriers: [], enemies: [] }
];

let currentLevel = 0;
let wordIndex = 0;

function initLevel() {
    wordIndex = 0;
    const level = levels[currentLevel];
    level.letters = level.word.split('').map((char, index) => ({
        char,
        x: Math.random() * (canvas.width - 50),
        y: -50 * (index + 1),
        width: 30,
        height: 30,
        barrier: currentLevel > 0 ? 8 : 0,
        hitPoints: currentLevel > 0 ? 8 : 1
    }));
}

function drawPlayer() {
    ctx.fillStyle = 'white';
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawLetters() {
    const level = levels[currentLevel];
    level.letters.forEach(letter => {
        ctx.fillStyle = 'yellow';
        ctx.fillRect(letter.x, letter.y, letter.width, letter.height);
        ctx.fillStyle = 'black';
        ctx.fillText(letter.char, letter.x + 10, letter.y + 20);
        if (letter.barrier > 0) {
            ctx.strokeStyle = 'red';
            ctx.strokeRect(letter.x, letter.y, letter.width, letter.height);
        }
    });
}

function drawBullets() {
    ctx.fillStyle = 'red';
    player.bullets.forEach(bullet => {
        ctx.fillRect(bullet.x, bullet.y, 5, 10);
    });
}

function updatePlayer() {
    document.addEventListener('keydown', e => {
        if (e.code === 'ArrowLeft' && player.x > 0) player.x -= player.speed;
        if (e.code === 'ArrowRight' && player.x < canvas.width - player.width) player.x += player.speed; if (e.code === 'Space')
            player.bullets.push({ x: player.x + player.width / 2 - 2.5, y: player.y });
    }); player.bullets.forEach((bullet,
        index) => {
        bullet.y -= 10;
        if (bullet.y < 0) player.bullets.splice(index, 1);
    });
} function updateLetters() {
    const
    level = levels[currentLevel]; level.letters.forEach(letter => {
        letter.y += 2;
        if (letter.y > canvas.height) letter.y = -50;
    });
}

function handleCollisions() {
    const level = levels[currentLevel];
    player.bullets.forEach((bullet, bulletIndex) => {
        level.letters.forEach((letter, letterIndex) => {
            if (bullet.x < letter.x + letter.width && bullet.x + 5 > letter.x &&
                bullet.y < letter.y + letter.height && bullet.y + 10 > letter.y) {
                player.bullets.splice(bulletIndex, 1);
                letter.hitPoints -= 1;
                if (letter.hitPoints <= 0 && letter.char === level.word[wordIndex]) {
                    level.letters.splice(letterIndex,
                        1); wordIndex += 1; if (wordIndex === level.word.length) {
                            currentLevel += 1; if (currentLevel <
                                levels.length) { initLevel(); } else { alert('You Win!'); }
                        }
                }
            }
        });
    });
} function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); drawPlayer(); drawLetters(); drawBullets();
    updatePlayer(); updateLetters(); handleCollisions(); requestAnimationFrame(gameLoop);
} initLevel();
gameLoop();