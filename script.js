let movesCount = 0;
let startTime = 0;
let timerInterval;

const getShuffledArray = () => {
  const array = [1, 5, 9, 13, 2, 6, 10, 14, 3, 7, 11, 15, 4, 8, 12];
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
};

const generateNewField = () => {
  const values = getShuffledArray();
  const tableEl = document.createElement('table');

  for (let i = 0; i < 4; i += 1) {
    const row = tableEl.insertRow();
    for (let j = 0; j < 4; j += 1) {
      const cell = row.insertCell();
      cell.className = 'cell';
      if (i === 3 && j === 3) {
        cell.classList.add('empty-cell');
      } else {
        cell.textContent = values[i + (j * 4)];
      }
    }
  }
  return tableEl;
};

const refreshField = () => {
  const heading = document.querySelector('.heading');
  const subheading = document.querySelector('.subheading');
  const table = document.querySelector('.table-container');
  const result = document.querySelector('.result-container');
  heading.innerHTML = 'Game of Fifteen';
  subheading.innerHTML = '';
  result.innerHTML = '';
  heading.classList.remove('rainbow');
  table.innerHTML = '';
  startTime = new Date();
  movesCount = 0; // Reset moves count
  const moveCounter = document.querySelector('.move-counter');
  moveCounter.innerHTML = `Moves: ${movesCount}`;
  console.log('timeCount: ', startTime);
  table.append(generateNewField());
};

const isPuzzleSolved = () => {
  const cells = document.querySelectorAll('.cell');
  const cellsValues = [...cells].map((cell) => +cell.textContent);
  for (let i = 0; i < cellsValues.length - 1; i += 1) {
    if (cellsValues[i] !== i + 1) return false;
  }
  return true;
};

const playWinnerSound = () => {
  const audio = document.getElementById('winner-sound');
  audio.play();
};

const restartGame = () => {
  if (isPuzzleSolved()) {
    clearInterval(timerInterval);
    const heading = document.querySelector('.heading');
    const subheading = document.querySelector('.subheading');
    const result = document.querySelector('.result-container');
    const endTime = new Date();
    const gameTime = Math.floor((endTime - startTime) / 1000);
    heading.innerHTML = 'You win!';
    subheading.innerHTML = 'auto-restart in 5 sec...';
    result.innerHTML = `Your result is ${movesCount} steps and ${gameTime} seconds`;
    heading.classList.add('rainbow');
    playWinnerSound(); 
    setTimeout(refreshField, 5000);
  }
};

const playClickSound = () => {
  const audio = document.getElementById('click-sound');
  audio.play();
};

const makeMove = (emptyCell, targetCell) => {
  emptyCell.classList.remove('empty-cell');
  emptyCell.textContent = targetCell.textContent;

  targetCell.classList.add('empty-cell');
  targetCell.textContent = '';
  playClickSound();

  restartGame();
};

const handleClick = (event) => {
  const clickedCell = event.target;

  if (!clickedCell.classList.contains('cell')) {
    return;
  }

  const emptyCell = document.querySelector('.empty-cell');
  const clickedCellX = clickedCell.cellIndex;
  const clickedCellY = clickedCell.parentNode.rowIndex;
  const emptyCellX = emptyCell.cellIndex;
  const emptyCellY = emptyCell.parentNode.rowIndex;

  const distance = Math.abs(clickedCellX - emptyCellX) + Math.abs(clickedCellY - emptyCellY);

  if (distance === 1) {
    makeMove(emptyCell, clickedCell);
    movesCount += 1;
    const moveCounter = document.querySelector('.move-counter');
    moveCounter.innerHTML = `Moves: ${movesCount}`;
  }
};

const handleKey = (event) => {
  const pressedKey = event.key;
  const emptyCell = document.querySelector('.empty-cell');

  const emptyCellX = emptyCell.cellIndex;
  const emptyCellY = emptyCell.parentNode.rowIndex;
  let targetCellX = emptyCellX;
  let targetCellY = emptyCellY;

  if (pressedKey === 'ArrowUp') targetCellY += 1;
  if (pressedKey === 'ArrowDown') targetCellY -= 1;
  if (pressedKey === 'ArrowLeft') targetCellX += 1;
  if (pressedKey === 'ArrowRight') targetCellX -= 1;
  if (pressedKey === 'KeyR') {
    refreshField();
    return;
  }

  if (targetCellX < 4 && targetCellX >= 0 && targetCellY < 4 && targetCellY >= 0) {
    const targetCell = document.querySelector('table').rows[targetCellY].cells[targetCellX];

    if (!targetCell.classList.contains('empty-cell')) {
      makeMove(emptyCell, targetCell);
      movesCount += 1;
      const moveCounter = document.querySelector('.move-counter');
      moveCounter.innerHTML = `Moves: ${movesCount}`;
    }
  }
};

const showGameScreen = () => {
  document.getElementById('instructions-screen').style.display = 'none';
  document.getElementById('game-screen').style.display = 'flex';
  refreshField();
  startTime = new Date();  
  startTimer();
};

const showInstructionsScreen = () => {
  document.getElementById('start-screen').style.display = 'none';
  document.getElementById('instructions-screen').style.display = 'flex';
};

const showStartScreen = () => {
  document.getElementById('start-screen').style.display = 'flex';
  document.getElementById('instructions-screen').style.display = 'none';
  document.getElementById('game-screen').style.display = 'none';
  clearInterval(timerInterval);
};

const startTimer = () => {
  const timerEl = document.querySelector('.subheading');
  clearInterval(timerInterval);
  let elapsedTime = 0;
  timerInterval = setInterval(() => {
    elapsedTime += 1;
    timerEl.innerHTML = `Time: ${elapsedTime} seconds`;
  }, 1000);
};

const handleVolumeChange = (event) => {
  const clickSound = document.getElementById('click-sound');
  const winnerSound = document.getElementById('winner-sound');
  
  if (event.target.id === 'click-sound-volume') {
    clickSound.volume = event.target.value;
  } else if (event.target.id === 'winner-sound-volume') {
    winnerSound.volume = event.target.value;
  }
};

const run = () => {
  document.getElementById('how-to-play-button').addEventListener('click', showInstructionsScreen);
  document.getElementById('start-game-button').addEventListener('click', showGameScreen);
  document.getElementById('reset-game-button').addEventListener('click', showStartScreen);
  document.querySelector('.table-container').addEventListener('click', handleClick);
  document.addEventListener('keydown', handleKey);
  document.getElementById('click-sound-volume').addEventListener('input', handleVolumeChange);
  document.getElementById('winner-sound-volume').addEventListener('input', handleVolumeChange);
};

run();


