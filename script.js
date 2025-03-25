const gameContainer = document.getElementById('game-container');
const startScreen = document.getElementById('start-screen');
const categoryScreen = document.getElementById('category-screen');
const gameScreen = document.getElementById('game-screen');
const playerNameInput = document.getElementById('player-name');
const newGameButton = document.getElementById('new-game');
const lettersButton = document.getElementById('letters-button');
const numbersButton = document.getElementById('numbers-button');
const shapesButton = document.getElementById('shapes-button');
const allButton = document.getElementById('all-button');
const scoreBoard = document.getElementById('score-board');
const wrongPopsBoard = document.getElementById('wrong-pops-board');
const leaderboardButton = document.getElementById('leaderboard-button');
const leaderboardPopup = document.getElementById('leaderboard-popup');
const closeLeaderboardButton = document.getElementById('close-leaderboard');
const howToPlayButton = document.getElementById('how-to-play');
const howToPlayPopup = document.getElementById('how-to-play-popup');
const closeHowToPlayButton = document.getElementById('close-how-to-play');
const gameOverDiv = document.getElementById('game-over');
const restartGameButton = document.getElementById('restart-game');
const bottomLine = document.getElementById('bottom-line');
const leaderboardList = document.getElementById('leaderboard-list');
const levelUpPopup = document.getElementById('level-up-popup');
const currentLevelSpan = document.getElementById('current-level');
const finalScoreSpan = document.getElementById('final-score');
const backgroundMusic = document.getElementById('background-music');
const soundToggle = document.getElementById('sound-toggle');
const themeScreen = document.getElementById('theme-screen');
const forestThemeButton = document.getElementById('forest-theme');
const aquaticThemeButton = document.getElementById('aquatic-theme');
const forestBackground = document.getElementById('forest-background');
const movingAnimals = document.getElementById('moving-animals');
const aquaticBackground = document.getElementById('aquatic-background');
const movingFish = document.getElementById('moving-fish');
const backButton = document.getElementById('back-button');
const pauseButton = document.getElementById('pause-button');
const pausePopup = document.getElementById('pause-popup');
const resumeButton = document.getElementById('resume-button');
// Add to your existing event listeners
const aboutButton = document.getElementById('about-button');
const aboutPopup = document.getElementById('about-popup');
const closeAbout = document.getElementById('close-about');
// Add to event listeners
const disclaimerButton = document.getElementById('disclaimer-button');
const disclaimerPopup = document.getElementById('disclaimer-popup');
const closeDisclaimer = document.getElementById('close-disclaimer');

disclaimerButton.addEventListener('click', () => disclaimerPopup.style.display = 'block');
closeDisclaimer.addEventListener('click', () => disclaimerPopup.style.display = 'none');
aboutButton.addEventListener('click', () => aboutPopup.style.display = 'block');
closeAbout.addEventListener('click', () => aboutPopup.style.display = 'none');

// Track game state
let playerName = '';
let score = 0;
let wrongPops = 0;
let gameSpeed = 5;
let level = 1;
let balloonInterval;
let currentCategory = 'all';
let isSoundOn = true;
let isPaused = false;
let currentTheme = 'forest'; // Tracks current theme
let animationsPaused = false;

// Leaderboard data
let leaderboardData = JSON.parse(localStorage.getItem('leaderboard')) || [];

// Function to show/hide the affiliate banner
function toggleAffiliateBanner(show) {
  const affiliateBanner = document.getElementById('affiliate-banner');
  if (affiliateBanner) {
    affiliateBanner.style.display = show ? 'flex' : 'none';
  }
}

// Show banner on the start screen and category screen
function showBannerOnHomeAndCategoryPages() {
  const affiliateBanner = document.getElementById('affiliate-banner');
  if (!affiliateBanner) return;

  // Show only on start, theme, and category screens
  if (startScreen.style.display !== 'none' || 
      themeScreen.style.display !== 'none' || 
      categoryScreen.style.display !== 'none') {
    affiliateBanner.style.display = 'flex';
  } else {
    // Hide on all other screens (game and game over)
    affiliateBanner.style.display = 'none';
  }
}

// Pause all animations
function pauseAllAnimations() {
  animationsPaused = true;
  document.querySelectorAll('.balloon').forEach(balloon => {
    balloon.style.animationPlayState = 'paused';
  });
  
  if (currentTheme === 'aquatic') {
    document.querySelectorAll('.fish').forEach(fish => {
      fish.style.animationPlayState = 'paused';
    });
  } else {
    document.querySelectorAll('.animal').forEach(animal => {
      animal.style.animationPlayState = 'paused';
    });
  }
}

// Resume all animations
function resumeAllAnimations() {
  animationsPaused = false;
  document.querySelectorAll('.balloon, .fish, .animal').forEach(el => {
    if (el.style.display !== 'none') {
      el.style.animationPlayState = 'running';
    }  
    });
}

// Pause game
function pauseGame() {
  if (!isPaused) {
    isPaused = true;
    pauseButton.textContent = "▶ Resume";
    pausePopup.style.display = 'block';
    clearInterval(balloonInterval);
    backgroundMusic.pause();
    pauseAllAnimations();
  }
}

// Resume game
function resumeGame() {
  if (isPaused) {
    isPaused = false;
    pauseButton.textContent = "⏸ Pause";
    pausePopup.style.display = 'none';
    balloonInterval = setInterval(createBalloon, 1500);
    if (isSoundOn) backgroundMusic.play();
    resumeAllAnimations();
  }
}

// Update leaderboard
// Update your updateLeaderboard function to this:
function updateLeaderboard() {
  // Filter out any undefined/null entries
  leaderboardData = leaderboardData.filter(entry => entry && entry.name && entry.score !== undefined);
  
  // Add current player only if they have a score
  if (playerName && score > 0) {
    leaderboardData.push({ name: playerName, score: score });
  }

  // Sort and keep top 5
  leaderboardData.sort((a, b) => b.score - a.score);
  leaderboardData = leaderboardData.slice(0, 10);
  localStorage.setItem('leaderboard', JSON.stringify(leaderboardData));

  // Update display - only show existing entries
  leaderboardList.innerHTML = leaderboardData
    .map((entry, index) => `<li>${index + 1}. ${entry.name}: ${entry.score}</li>`)
    .join('');
}

// Initialize with clean data
function initializeLeaderboard() {
  leaderboardData = JSON.parse(localStorage.getItem('leaderboard')) || [];
  // Clean existing data
  leaderboardData = leaderboardData.filter(entry => entry && entry.name && !isNaN(entry.score));
  updateLeaderboard();
}

// Replace your current initialization at the bottom of script.js:
initializeLeaderboard(); // Instead of updateLeaderboard()
pauseButton.style.display = 'none';

function updateAnimalsForLevel(level) {
  const elephant = document.querySelector('.elephant');
  const ostrich = document.querySelector('.ostrich');
  const cheetah = document.querySelector('.cheetah');
  const horse = document.querySelector('.horse');
  
  if (level >= 3) {
    // Hide level 1-2 animals
    if (elephant) {
      elephant.style.display = 'none';
      elephant.style.animationPlayState = 'paused';
    }
    if (ostrich) {
      ostrich.style.display = 'none';
      ostrich.style.animationPlayState = 'paused';
    }
    
    // Show and animate level 3+ animals
    if (cheetah) {
      cheetah.style.display = 'block';
      cheetah.style.animationPlayState = animationsPaused ? 'paused' : 'running';
      // Reset animation to ensure it starts from beginning
      cheetah.style.animation = 'none';
      cheetah.offsetHeight; // Trigger reflow
      cheetah.style.animation = 'moveAnimals linear infinite';
      cheetah.style.animationDuration = '25s';
    }
    if (horse) {
      horse.style.display = 'block';
      horse.style.animationPlayState = animationsPaused ? 'paused' : 'running';
      // Reset animation
      horse.style.animation = 'none';
      horse.offsetHeight;
      horse.style.animation = 'moveAnimals linear infinite';
      horse.style.animationDuration = '35s';
    }
  } else {
    // Similar logic for level 1-2 animals
    if (elephant) {
      elephant.style.display = 'block';
      elephant.style.animationPlayState = animationsPaused ? 'paused' : 'running';
    }
    if (ostrich) {
      ostrich.style.display = 'block';
      ostrich.style.animationPlayState = animationsPaused ? 'paused' : 'running';
    }
    
    // Hide level 3+ animals
    if (cheetah) {
      cheetah.style.display = 'none';
      cheetah.style.animationPlayState = 'paused';
    }
    if (horse) {
      horse.style.display = 'none';
      horse.style.animationPlayState = 'paused';
    }
  }
  
  // Bird remains visible always
  const bird = document.querySelector('.bird');
  if (bird) {
    bird.style.display = 'block';
    bird.style.animationPlayState = animationsPaused ? 'paused' : 'running';
  }
}


/* function handleBalloonClick(e) {
  e.preventDefault(); // Prevent default touch behavior
  if (isPaused) return;
  
  const balloonRect = this.getBoundingClientRect();
  createExplosion(balloonRect.left, balloonRect.top);
  this.remove();
 
  balloon.addEventListener('click', () => {
    if (isPaused) return;
    
    const balloonRect = balloon.getBoundingClientRect();
    createExplosion(balloonRect.left, balloonRect.top);
    balloon.remove();

    if (currentCategory === 'letters' && !isNaN(content)) {
      wrongPops++;
      wrongPopsBoard.textContent = `Wrong Pops: ${wrongPops}/5`;
      if (wrongPops >= 5) endGame();
    } else if (currentCategory === 'numbers' && isNaN(content)) {
      wrongPops++;
      wrongPopsBoard.textContent = `Wrong Pops: ${wrongPops}/5`;
      if (wrongPops >= 5) endGame();
    } else {
      score++;
      scoreBoard.textContent = `Score: ${score}`;
      checkLevelUp();
    }
  });
  */

  function handleBalloonPop(balloonElement, content) {
    if (isPaused) return;
    
    const balloonRect = balloonElement.getBoundingClientRect();
    createExplosion(balloonRect.left, balloonRect.top);
    balloonElement.remove();
  
    if (currentCategory === 'letters' && !isNaN(content)) {
      wrongPops++;
      wrongPopsBoard.textContent = `Wrong Pops: ${wrongPops}/5`;
      if (wrongPops >= 5) endGame();
    } else if (currentCategory === 'numbers' && isNaN(content)) {
      wrongPops++;
      wrongPopsBoard.textContent = `Wrong Pops: ${wrongPops}/5`;
      if (wrongPops >= 5) endGame();
    } else {
      score++;
      scoreBoard.textContent = `Score: ${score}`;
      checkLevelUp();
    }
  }


// Create balloon
function createBalloon() {
  if (isPaused) return;

  const balloon = document.createElement('div');
  balloon.classList.add('balloon');

  let content;
  switch (currentCategory) {
    case 'letters':
      content = Math.random() < 0.7 ? getRandomLetter() : getRandomNumber();
      break;
    case 'numbers':
      content = Math.random() < 0.7 ? getRandomNumber() : getRandomLetter();
      break;
    case 'shapes':
      content = getRandomShape();
      break;
    case 'all':
      content = getRandomContent();
      break;
  }
  balloon.textContent = content;

  const colors = ['#ff6f61', '#6b5b95', '#88b04b', '#f7cac9', '#92a8d1', '#955251'];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  balloon.style.backgroundColor = randomColor;

  balloon.style.left = `${Math.random() * (gameContainer.offsetWidth - 80)}px`;
  balloon.style.animationDuration = `${gameSpeed}s`;

  if (animationsPaused) {
    balloon.style.animationPlayState = 'paused';
  }

  // Add event listeners
  balloon.addEventListener('click', function(e) {
    handleBalloonPop(this, content);
  });
  balloon.addEventListener('touchend', function(e) {
    e.preventDefault();
    handleBalloonPop(this, content);
  });

  const checkCollision = setInterval(() => {
    if (isPaused) return;
    const balloonRect = balloon.getBoundingClientRect();
    const bottomLineRect = bottomLine.getBoundingClientRect();

    if (balloonRect.bottom >= bottomLineRect.top) {
      clearInterval(checkCollision);
      balloon.remove();
      if (currentCategory === 'shapes' || currentCategory === 'all') {
        wrongPops++;
        wrongPopsBoard.textContent = `Wrong Pops: ${wrongPops}/5`;
        if (wrongPops >= 5) endGame();
      }
    }
  }, 10);

  gameContainer.appendChild(balloon);
}


// Helper functions for balloon content
function getRandomLetter() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  return letters[Math.floor(Math.random() * letters.length)];
}

function getRandomNumber() {
  return Math.floor(Math.random() * 10);
}

function getRandomShape() {
  const shapes = ['▲', '●', '■', '★', '🍎', '🍌','😊','😁','🌞','🍍','🍧'];
  return shapes[Math.floor(Math.random() * shapes.length)];
}

function getRandomContent() {
  const options = [getRandomLetter(), getRandomNumber(), getRandomShape()];
  return options[Math.floor(Math.random() * options.length)];
}

// Check for level up
function checkLevelUp() {
  if (score % 20 === 0) {
    level++;
    gameSpeed = Math.max(1, gameSpeed - 0.5);
    showLevelUpPopup(level);
    updateAnimalsForLevel(level);
  }
}

// Show level-up popup
function showLevelUpPopup(level) {
  currentLevelSpan.textContent = level;
  levelUpPopup.style.display = 'block';
  setTimeout(() => {
    levelUpPopup.style.display = 'none';
  }, 2000);
}

// Create explosion effect
function createExplosion(left, top) {
  const explosion = document.createElement('div');
  explosion.classList.add('explosion');
  explosion.style.left = `${left}px`;
  explosion.style.top = `${top}px`;
  gameContainer.appendChild(explosion);
  setTimeout(() => explosion.remove(), 500);
}

// Toggle sound
function toggleSound() {
  isSoundOn = !isSoundOn;
  if (isSoundOn) {
    backgroundMusic.play();
    soundToggle.textContent = 'Sound: On';
  } else {
    backgroundMusic.pause();
    soundToggle.textContent = 'Sound: Off';
  }
}

// Start game
function startGame() {
  playerName = playerNameInput.value.trim();
  if (!playerName) {
    alert('Please enter your name!');
    return;
  }
  startScreen.style.display = 'none';
  themeScreen.style.display = 'block';
  showBannerOnHomeAndCategoryPages();
}

// Select forest theme
function selectForestTheme() {
  currentTheme = 'forest';
  forestBackground.style.display = 'block';
  movingAnimals.style.display = 'block';
  aquaticBackground.style.display = 'none';
  movingFish.style.display = 'none';

  if (isPaused) {
    document.querySelectorAll('.animal').forEach(animal => {
      animal.style.animationPlayState = 'paused';
    });
  }

  themeScreen.style.display = 'none';
  categoryScreen.style.display = 'block';
}

// Select aquatic theme
function selectAquaticTheme() {
  currentTheme = 'aquatic';
  aquaticBackground.style.display = 'block';
  movingFish.style.display = 'block';
  forestBackground.style.display = 'none';
  movingAnimals.style.display = 'none';

  if (isPaused) {
    document.querySelectorAll('.fish').forEach(fish => {
      fish.style.animationPlayState = 'paused';
    });
  }

  themeScreen.style.display = 'none';
  categoryScreen.style.display = 'block';
}

// Start game with selected category
function startGameWithCategory(category) {
  currentCategory = category;
  categoryScreen.style.display = 'none';
  gameScreen.style.display = 'block';
  pauseButton.style.display = 'block';

  score = 0;
  wrongPops = 0;
  level = 1;
  gameSpeed = 5;
  scoreBoard.textContent = `Score: ${score}`;
  wrongPopsBoard.textContent = `Wrong Pops: ${wrongPops}/5`;
  gameOverDiv.style.display = 'none';

  document.querySelectorAll('.balloon, .explosion').forEach(el => el.remove());

  const shapesHint = document.getElementById('shapes-hint');
  const allHint = document.getElementById('all-hint');
  const lettersHint = document.getElementById('letters-hint');
  const numbersHint = document.getElementById('numbers-hint');

  shapesHint.style.display = 'none';
  allHint.style.display = 'none';
  lettersHint.style.display = 'none';
  numbersHint.style.display = 'none';

  if (currentCategory === 'shapes') {
    shapesHint.style.display = 'block';
    setTimeout(() => shapesHint.style.display = 'none', 5000);
  } else if (currentCategory === 'all') {
    allHint.style.display = 'block';
    setTimeout(() => allHint.style.display = 'none', 5000);
  } else if (currentCategory === 'letters') {
    lettersHint.style.display = 'block';
    setTimeout(() => lettersHint.style.display = 'none', 5000);
  } else if (currentCategory === 'numbers') {
    numbersHint.style.display = 'block';
    setTimeout(() => numbersHint.style.display = 'none', 5000);
  }

  if (isSoundOn) backgroundMusic.play();
  balloonInterval = setInterval(createBalloon, 1500);
}

// End game
function endGame() {
  clearInterval(balloonInterval);
  isPaused = true;
  finalScoreSpan.textContent = score;
  if (score > 0) { 
    updateLeaderboard();
  }
  gameOverDiv.style.display = 'block';
  pauseButton.style.display = 'none';
}

// Restart game
function restartGame() {
  isPaused = false;
  clearInterval(balloonInterval);
  gameScreen.style.display = 'none';
  gameOverDiv.style.display = 'none';
  themeScreen.style.display = 'block';
  pauseButton.style.display = 'none';

  score = 0;
  wrongPops = 0;
  level = 1;
  gameSpeed = 5;
  scoreBoard.textContent = `Score: ${score}`;
  wrongPopsBoard.textContent = `Wrong Pops: ${wrongPops}/5`;

  document.querySelectorAll('.balloon, .explosion').forEach(el => el.remove());
  updateAnimalsForLevel(1);
}

// Event listeners
newGameButton.addEventListener('click', startGame);
forestThemeButton.addEventListener('click', selectForestTheme);
aquaticThemeButton.addEventListener('click', selectAquaticTheme);
lettersButton.addEventListener('click', () => startGameWithCategory('letters'));
numbersButton.addEventListener('click', () => startGameWithCategory('numbers'));
shapesButton.addEventListener('click', () => startGameWithCategory('shapes'));
allButton.addEventListener('click', () => startGameWithCategory('all'));
restartGameButton.addEventListener('click', restartGame);
leaderboardButton.addEventListener('click', () => leaderboardPopup.style.display = 'block');
closeLeaderboardButton.addEventListener('click', () => leaderboardPopup.style.display = 'none');
howToPlayButton.addEventListener('click', () => howToPlayPopup.style.display = 'block');
closeHowToPlayButton.addEventListener('click', () => howToPlayPopup.style.display = 'none');
soundToggle.addEventListener('click', toggleSound);
pauseButton.addEventListener('click', pauseGame);
resumeButton.addEventListener('click', resumeGame);

// Close affiliate banner
const closeAffiliateButton = document.getElementById('close-affiliate');
closeAffiliateButton.addEventListener('click', () => {
  const affiliateBanner = document.getElementById('affiliate-banner');
  affiliateBanner.style.display = 'none';
});

// Keyboard shortcut for pause
document.addEventListener('keydown', function(e) {
  if (gameScreen.style.display !== 'block') return;
  if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') {
    if (isPaused) resumeGame();
    else pauseGame();
  }
});

// Initialize
updateLeaderboard();
pauseButton.style.display = 'none'; // Hide pause button initially

// Add to your script.js
function handleOrientationChange() {
  if (window.innerHeight > window.innerWidth) {
    // Portrait mode
    document.body.classList.add('portrait');
    document.body.classList.remove('landscape');
  } else {
    // Landscape mode
    document.body.classList.add('landscape');
    document.body.classList.remove('portrait');
  }
}

// Initialize and add event listener
handleOrientationChange();
window.addEventListener('resize', handleOrientationChange);
window.addEventListener('orientationchange', handleOrientationChange);

/* Portrait specific adjustments 
body.portrait #game-screen {
  /* Special portrait mode styles 
}

/* Landscape specific adjustments 
body.landscape #game-screen {
  /* Special landscape mode styles 
} */

  // Initialize the game
initializeLeaderboard();
pauseButton.style.display = 'none';

// Start with forest theme by default
forestBackground.style.display = 'block';
movingAnimals.style.display = 'block';
aquaticBackground.style.display = 'none';
movingFish.style.display = 'none';