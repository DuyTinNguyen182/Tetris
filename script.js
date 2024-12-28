const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;
const COLOR_PALETTE = [
  '#0000A0', '#FF7F32', '#00CC00', '#9B4D9B', '#FF3232', '#3399FF', '#FFFF00', '#F0F0F0',
];

const BRICK_LAYOUT = [
  [
    [
      [7, 1, 7],
      [1, 1, 7],
      [1, 7, 7],
    ],
    [
      [1, 1, 7],
      [7, 1, 1],
      [7, 7, 7],
    ],
    [
      [7, 7, 1],
      [7, 1, 1],
      [7, 1, 7],
    ],
    [
      [7, 7, 7],
      [1, 1, 7],
      [7, 1, 1],
    ],
  ],
  [
    [
      [7, 1, 7],
      [7, 1, 7],
      [7, 1, 1],
    ],
    [
      [7, 7, 7],
      [1, 1, 1],
      [1, 7, 7],
    ],
    [
      [1, 1, 7],
      [7, 1, 7],
      [7, 1, 7],
    ],
    [
      [7, 7, 1],
      [1, 1, 1],
      [7, 7, 7],
    ],
  ],
  [
    [
      [7, 1, 7],
      [1, 1, 1],
      [7, 7, 7],
    ],
    [
      [7, 1, 7],
      [7, 1, 1],
      [7, 1, 7],
    ],
    [
      [7, 7, 7],
      [1, 1, 1],
      [7, 1, 7],
    ],
    [
      [7, 1, 7],
      [1, 1, 7],
      [7, 1, 7],
    ],
  ],
  [
    [
      [1, 7, 7],
      [1, 1, 7],
      [7, 1, 7],
    ],
    [
      [7, 1, 1],
      [1, 1, 7],
      [7, 7, 7],
    ],
    [
      [7, 1, 7],
      [7, 1, 1],
      [7, 7, 1],
    ],
    [
      [7, 7, 7],
      [7, 1, 1],
      [1, 1, 7],
    ],
  ],
  [
    [
      [7, 7, 7, 7],
      [1, 1, 1, 1],
      [7, 7, 7, 7],
      [7, 7, 7, 7],
    ],
    [
      [7, 7, 1, 7],
      [7, 7, 1, 7],
      [7, 7, 1, 7],
      [7, 7, 1, 7],
    ],
    [
      [7, 7, 7, 7],
      [7, 7, 7, 7],
      [1, 1, 1, 1],
      [7, 7, 7, 7],
    ],
    [
      [7, 1, 7, 7],
      [7, 1, 7, 7],
      [7, 1, 7, 7],
      [7, 1, 7, 7],
    ],
  ],
  [
    [
      [1, 7, 7],
      [1, 1, 1],
      [7, 7, 7],
    ],
    [
      [7, 1, 1],
      [7, 1, 7],
      [7, 1, 7],
    ],
    [
      [7, 7, 7],
      [1, 1, 1],
      [7, 7, 1],
    ],
    [
      [7, 1, 7],
      [7, 1, 7],
      [1, 1, 7],
    ],
  ],
  [
    [
      [7, 7, 7, 7],
      [7, 1, 1, 7],
      [7, 1, 1, 7],
      [7, 7, 7, 7],
    ],
    [
      [7, 7, 7, 7],
      [7, 1, 1, 7],
      [7, 1, 1, 7],
      [7, 7, 7, 7],
    ],
    [
      [7, 7, 7, 7],
      [7, 1, 1, 7],
      [7, 1, 1, 7],
      [7, 7, 7, 7],
    ],
    [
      [7, 7, 7, 7],
      [7, 1, 1, 7],
      [7, 1, 1, 7],
      [7, 7, 7, 7],
    ],
  ],
];

//Lưu hướng của phím

const KEY_CODES = {
  LEFT: 'ArrowLeft',
  RIGHT: 'ArrowRight',
  UP: 'ArrowUp',
  DOWN: 'ArrowDown',
};

const WHITE_ID = 7;
// Lấy đối tượng canvas và context cho bảng chính và khối gạch sắp tới
const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');
const nextBrickCanvas = document.getElementById('next-brick');
const nextCtx = nextBrickCanvas.getContext('2d');
const audioBg = document.getElementById('bgmusic');
const audioCplRows = document.getElementById('cpl-rows-music');
const audioGameOver = document.getElementById('game-over-music');

// Khởi tạo các biến
let nextBrick;
let brick;
let isPaused = false;
let refresh; // Lưu trạng thái setInterval
let pauseButton = document.getElementById('pause');
let resetButton = document.getElementById('reset');
import * as fb from "./test.js";
// Hiển thị điểm cao nhất từ localStorage
// let highScore = 0;
let curr_point_db = localStorage.getItem('highScore') || 0;
document.getElementById('high-score').innerText = curr_point_db;

const startScreen = document.getElementById('startScreen');
let playGameButton = document.getElementById('start-game');
let playerName = '';
const MPipe = document.getElementById('media-pipe');
const instruct = document.getElementById('instruct');
const ranking = document.getElementById('ranking');
document.getElementById("high-score").innerHTML = curr_point_db;
// 
// startScreen.style.display = 'none';
// MPipe.style.display = 'block';
// instruct.style.display = 'block';
// ranking.style.display = 'block';
// 
playGameButton.addEventListener('click', () => {
    const playerNameInput = document.getElementById('player-name').value.trim();
    if (!playerNameInput) {
        alert('Vui lòng nhập tên người chơi!');
        return;
    }
    playerName = playerNameInput;
    fb.writeUserData(playerName, curr_point_db);
    fb.getUserData();
    // highScore = fb.get_Point_ByName(playerName);
    // console.log(`Player name is: ${playerName}`);
    // updateLeaderboardImmediate(playerName);
    startScreen.style.display = 'none';
    MPipe.style.display = 'block';
    instruct.style.display = 'block';
    ranking.style.display = 'block';
});


// Thiết lập kích thước cho canvas theo số hàng và cột
ctx.canvas.width = COLS * BLOCK_SIZE;
ctx.canvas.height = ROWS * BLOCK_SIZE;

// Lớp điều khiển bảng chính
class Board {
  constructor(ctx) {
    this.ctx = ctx;
    this.grid = this.generateWhiteBoard();
    this.score = 0;
    this.gameOver = false;
    this.isPlaying = false;    
  }

  // Reset lại bảng và điểm số khi trò chơi bắt đầu lại
  reset() {
    this.score = 0;
    document.getElementById('score').innerText = 0; // Reset điểm số về 0
    this.grid = this.generateWhiteBoard();
    this.gameOver = false;
    this.drawBoard();
  }

  // Tạo bảng trắng (chưa có gạch)
  generateWhiteBoard() {
    return Array.from({ length: ROWS }, () => Array(COLS).fill(WHITE_ID));
  }

  drawCell(xAxis, yAxis, colorId) {

    const color = COLOR_PALETTE[colorId] || COLOR_PALETTE[WHITE_ID];

    // Đổ nền màu cơ bản
    this.ctx.fillStyle = color;
    this.ctx.fillRect(
      xAxis * BLOCK_SIZE,
      yAxis * BLOCK_SIZE,
      BLOCK_SIZE,
      BLOCK_SIZE
    );
    
    // Đổ bóng ở dưới và bên phải để tạo chiều sâu
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    this.ctx.fillRect(
      xAxis * BLOCK_SIZE + BLOCK_SIZE * 0.9,
      yAxis * BLOCK_SIZE + BLOCK_SIZE * 0.1,
      BLOCK_SIZE * 0.1,
      BLOCK_SIZE * 0.8
    );
    this.ctx.fillRect(
      xAxis * BLOCK_SIZE + BLOCK_SIZE * 0.1,
      yAxis * BLOCK_SIZE + BLOCK_SIZE * 0.9,
      BLOCK_SIZE * 0.8,
      BLOCK_SIZE * 0.1
    );

    // Vẽ đường viền xung quanh ô
    this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
    this.ctx.strokeRect(
      xAxis * BLOCK_SIZE,
      yAxis * BLOCK_SIZE,
      BLOCK_SIZE,
      BLOCK_SIZE
    );    
  }

  // Vẽ lại toàn bộ bảng sau mỗi lần thay đổi
  drawBoard() {
    for (let row = 0; row < this.grid.length; row++) {
      for (let col = 0; col < this.grid[0].length; col++) {
        this.drawCell(col, row, this.grid[row][col]);
      }
    }
  }

  handleCompleteRows() {
    const completedRows = []; // Danh sách các hàng hoàn thành
    for (let row = 0; row < this.grid.length; row++) {
      if (this.grid[row].every(cell => cell !== WHITE_ID)) {
        completedRows.push(row);
      }
    }
  
    if (completedRows.length > 0) {
      // Tạo hiệu ứng tan biến
      this.fadeOutRows(completedRows).then(() => {
        // Xóa các hàng đã hoàn thành sau hiệu ứng
        const newRows = Array.from({ length: completedRows.length }, () => Array(COLS).fill(WHITE_ID));
        const remainingRows = this.grid.filter((_, row) => !completedRows.includes(row));
        this.grid = [...newRows, ...remainingRows];
        if(completedRows.length ==1){
          this.handleScore(completedRows.length * 10); // Cập nhật điểm số          
        }
        else if(completedRows.length == 2){
          this.handleScore(completedRows.length * 10 + 5);
          showBonus("+5 Bonus!");  
        }
        else if(completedRows.length == 3){
          this.handleScore(completedRows.length * 10 + 7);
          showBonus("+7 Bonus!");
        }
        else{
          this.handleScore(completedRows.length * 10 + 10);
          showBonus("+10 Bonus!");
        }
        
        audioCplRows.play(); // Phát âm thanh hoàn thành hàng
        this.drawBoard(); // Vẽ lại bảng
        
      });
    }
  }
  
  // Hàm tạo hiệu ứng tan biến từ trái qua
  fadeOutRows(rows) {
    return new Promise(resolve => {
      let col = 0; // Bắt đầu từ cột đầu tiên
      const fadeInterval = setInterval(() => {
        rows.forEach(row => {
          if (col < COLS) {
            this.grid[row][col] = WHITE_ID; // Làm "biến mất" từng ô từ trái qua
          }
        });
        this.drawBoard();
  
        col++;
        if (col === COLS) { // Kết thúc khi tất cả các cột đã tan biến
          clearInterval(fadeInterval);
          resolve();
        }
      }, 38); // Mỗi lần làm mờ 1 cột cách nhau 100ms
    });
  }
  

  // Cập nhật điểm số
  handleScore(newScore) {
    this.score += newScore;
    document.getElementById('score').innerHTML = this.score;
    fb.get_Point_ByName(playerName).then((point) => {
      curr_point_db = point;
    });
    if (board.score > curr_point_db) {
      fb.writeUserData(playerName, board.score); 
      fb.getUserData();
      document.getElementById("high-score").innerHTML = board.score;
      localStorage.setItem("highScore", board.score);
    }
    
    // updateHighScore();
    // updateLeaderboardImmediate(playerName);
    console.log(`Player name is: ${playerName}`);
  }

  // Xử lý khi trò chơi kết thúc
  handleGameOver() {
    this.gameOver = true;
    this.isPlaying = false;
    showGameOverMessage();
    audioGameOver.play();
  }
}

// Lớp điều khiển các khối gạch
class Brick {
  constructor(id) {
    this.id = id;
    this.layout = BRICK_LAYOUT[id];
    this.activeIndex = 0;//Hướng
    this.colPos = 3;
    this.rowPos = -2;
  }

  // Vẽ khối gạch lên bảng
  draw() {
    for (let row = 0; row < this.layout[this.activeIndex].length; row++) {
      for (let col = 0; col < this.layout[this.activeIndex][0].length; col++) {
        if (this.layout[this.activeIndex][row][col] !== WHITE_ID) {
          board.drawCell(col + this.colPos, row + this.rowPos, this.id);
        }
      }
    }
  }

  // Xóa khối gạch khi nó di chuyển
  clear() {
    for (let row = 0; row < this.layout[this.activeIndex].length; row++) {
      for (let col = 0; col < this.layout[this.activeIndex][0].length; col++) {
        if (this.layout[this.activeIndex][row][col] !== WHITE_ID) {
          board.drawCell(col + this.colPos, row + this.rowPos, WHITE_ID);
        }
      }
    }
  }

  // Di chuyển khối gạch sang trái
  moveLeft() {
    if (!this.checkCollision(this.rowPos, this.colPos - 1, this.layout[this.activeIndex])) {
      this.clear();
      this.colPos--;
      this.draw();
    }
  }

  // Di chuyển khối gạch sang phải
  moveRight() {
    if (!this.checkCollision(this.rowPos, this.colPos + 1, this.layout[this.activeIndex])) {
      this.clear();
      this.colPos++;
      this.draw();
    }
  }

  // Di chuyển khối gạch xuống dưới
  moveDown() {
    if (!this.checkCollision(this.rowPos + 1, this.colPos, this.layout[this.activeIndex])) {
      this.clear();
      this.rowPos++;
      this.draw();
      return;
    }

    this.handleLanded(); // Xử lý khi khối gạch đáp xuống
    generateNewBrick();
  }

  // Xoay khối gạch
  rotate() {
    if (!this.checkCollision(this.rowPos, this.colPos, this.layout[(this.activeIndex + 1) % 4])) {
      this.clear();
      this.activeIndex = (this.activeIndex + 1) % 4;
      this.draw();
    }
  }

  // Kiểm tra va chạm của khối gạch
  checkCollision(nextRow, nextCol, nextLayout) {
    for (let row = 0; row < nextLayout.length; row++) {
      for (let col = 0; col < nextLayout[row].length; col++) {
        if (nextLayout[row][col] !== WHITE_ID) { // Chỉ kiểm tra các ô thực sự
          if (
                col + nextCol < 0 || // Vượt biên trái
                col + nextCol >= COLS || // Vượt biên phải
                row + nextRow >= ROWS || // Vượt biên dưới
                (row + nextRow >= 0 && board.grid[row + nextRow][col + nextCol] !== WHITE_ID) // Đụng gạch khác
              ) {
                return true; // Có va chạm
              }
        }
      }
    }
    return false; // Không có va chạm
  }

  // Xử lý khi khối gạch đáp xuống
  handleLanded() {
    if (this.rowPos <= 0) {
      board.handleGameOver();
      return;
    }

    for (let row = 0; row < this.layout[this.activeIndex].length; row++) {
      for (let col = 0; col < this.layout[this.activeIndex][0].length; col++) {
        if (this.layout[this.activeIndex][row][col] !== WHITE_ID) {
          board.grid[row + this.rowPos][col + this.colPos] = this.id;
        }
      }
    }

    board.handleCompleteRows();
    board.drawBoard();
  }
}

// Cập nhật điểm cao nhất
// function updateHighScore() {
//   lib.get_Point_ByName(playerName).then((point) => {
//     curr_point_db = point;
//   });
//   if (board.score > curr_point_db) {
//     fb.writeUserData(playerName, board.score);
//     fb.getUserData();
//   }
// }

// Hàm tạo và hiển thị khối gạch mới
function generateNewBrick() {
  brick = nextBrick || new Brick(Math.floor(Math.random() * BRICK_LAYOUT.length));
  nextBrick = new Brick(Math.floor(Math.random() * BRICK_LAYOUT.length));
  drawNextBrick();
}

// Hàm hiển thị khối gạch tiếp theo
function drawNextBrick() {
  nextCtx.clearRect(0, 0, nextBrickCanvas.width, nextBrickCanvas.height);
  for (let row = 0; row < nextBrick.layout[0].length; row++) {
    for (let col = 0; col < nextBrick.layout[0][0].length; col++) {
      if (nextBrick.layout[0][row][col] !== WHITE_ID) {
        nextCtx.fillStyle = COLOR_PALETTE[nextBrick.id];
        nextCtx.fillRect(
          col * (BLOCK_SIZE / 2),
          row * (BLOCK_SIZE / 2),
          BLOCK_SIZE / 2,
          BLOCK_SIZE / 2
        );
        nextCtx.strokeRect(
          col * (BLOCK_SIZE / 2),
          row * (BLOCK_SIZE / 2),
          BLOCK_SIZE / 2,
          BLOCK_SIZE / 2
        );
      }
    }
  }
}

//Hàm hiển thị thông báo Game Over
function showGameOverMessage() {
  const gameOverOverlay = document.getElementById('game-over');
  gameOverOverlay.style.display = 'flex'; // Hiển thị phần tử thông báo
  audioBg.pause();
  audioBg.currentTime = 0;

  // Xử lý sự kiện khi nhấn nút OK
  document.getElementById('game-over-btn').onclick = () => {
    gameOverOverlay.style.display = 'none'; // Ẩn thông báo
    board.reset(); // Reset trò chơi
    document.getElementById('play').innerText = 'Chơi';
  };
}

// Xử lý sự kiện khi nhấn nút "Play" để bắt đầu hoặc reset trò chơi
document.getElementById('play').addEventListener('click', () => {
  // Reset điểm số mỗi khi nhấn nút Reset
  if (board.isPlaying) {
    clearInterval(refresh); // Dừng setInterval trước đó
    board.reset();    
    board.isPlaying = true;
    isPaused = false;
    pauseButton.innerText = 'Dừng';
    document.getElementById('play').innerText = 'Chơi lại';
    audioBg.currentTime = 0;
    audioBg.play();

    generateNewBrick();
    
    refresh = setInterval(() => {
      if (!board.gameOver && !isPaused) {
        brick.moveDown();
      } else {
        clearInterval(refresh);
      }
    }, 1000);
  } else {
    // Khi trò chơi chưa bắt đầu
    board.reset();
    board.isPlaying = true;
    isPaused = false;    
    document.getElementById('play').innerText = 'Chơi lại';
    audioBg.play();

    generateNewBrick();

    refresh = setInterval(() => {
      if (!board.gameOver && !isPaused) {
        brick.moveDown();
      } else {
        clearInterval(refresh);
      }
    }, 1000);
  }
});

// Xử lý sự kiện tạm dừng trò chơi
pauseButton.addEventListener('click', () => {
  if (board.isPlaying && !board.gameOver) {
    if (isPaused) {
      isPaused = false;
      pauseButton.innerText = 'Dừng';
      audioBg.play();

      refresh = setInterval(() => {
        if (!board.gameOver && !isPaused) {
          brick.moveDown();
        } else {
          clearInterval(refresh);
        }
      }, 1000);

    } else {
      isPaused = true;
      audioBg.pause();
      pauseButton.innerText = 'Tiếp tục';
      clearInterval(refresh);
    }
  }
});

function showBonus(bonusText) {
  const bonusMessage = document.getElementById("bonus-message");

  // Hiển thị điểm bonus
  bonusMessage.textContent = bonusText;
  bonusMessage.style.opacity = "1";
  bonusMessage.style.bottom = "45%";

  // Ẩn sau 1 giây
  setTimeout(() => {
    bonusMessage.style.opacity = "0";
    bonusMessage.style.bottom = "-50px";
  }, 1000);
}
export function getName(){
  return document.getElementById('player-name').value;
}
// Xử lý sự kiện nhấn phím điều khiển khối gạch
document.addEventListener('keydown', (e) => {
  if (!board.gameOver && board.isPlaying && !isPaused) {
    switch (e.code) {
      case KEY_CODES.LEFT:
        brick.moveLeft();
        break;
      case KEY_CODES.RIGHT:
        brick.moveRight();
        break;
      case KEY_CODES.DOWN:
        brick.moveDown();
        break;
      case KEY_CODES.UP:
        brick.rotate();
        break;
      default:
        break;
    }
  }
});

// let leaderboard = [
//   { name: "Player1", score: 100 },
//   { name: "Player2", score: 90 },
//   { name: "Player3", score: 80 },
//   { name: "Player4", score: 70 },
//   { name: "Player5", score: 60 },
//   { name: "Player6", score: 50 },
//   { name: "Player7", score: 40 },
//   { name: "Player8", score: 30 },
//   { name: "Player9", score: 20 },
//   // { name: "Player10", score: 10 }
// ];


// function displayLeaderboard() {
//   const leaderboardElement = document.getElementById("leaderboard");
//   leaderboardElement.innerHTML = "";
//   leaderboard.forEach((player, index) => {
//     leaderboardElement.innerHTML += `<li>${index + 1}. ${player.name} - ${player.score}</li>`;
//   });
// }

// function updateLeaderboardImmediate(playername) {
//     // Kiểm tra xem người chơi đã có trong bảng xếp hạng hay chưa
//     let youIndex = leaderboard.findIndex(player => player.name === playername);
//     if (youIndex !== -1){
//         // Nếu người chơi đã có, cập nhật điểm số nếu cao hơn
//         leaderboard[youIndex].score = Math.max(leaderboard[youIndex].score, highScore);
//     }
//     else {
//         // for (let i = 0; i < leaderboard.length; i++) {
//         //     if (highScore > leaderboard[i].score) {
//         //     leaderboard.splice(i, 0, { name: playername, score: highScore});
//         //     youIndex = true;
//         //     break;
//         //     }
//         // }
//         leaderboard.splice(11, 0, { name: playername, score: highScore});
//     }
    
//     // leaderboard = leaderboard.slice(0, 10);
//     leaderboard.sort((a, b) => b.score - a.score);
//     displayLeaderboard();
// }

// Khởi tạo bảng
let board = new Board(ctx);
board.drawBoard();

// Hiển thị bảng xếp hạng ban đầu
// updateLeaderboardImmediate(playerName);
// displayLeaderboard();
console.log(`Player name is: ${playerName}`);
// showBonus("+5 Bonus!");
// Khi trang được tải, reset lại điểm cao nhất
// window.onload = function() {
//   localStorage.setItem('highScore', 0); // Reset điểm cao nhất về 0
// }
console.table(board.grid);

// MediaPipe
const videoElement = document.querySelector('.input_video');
const canvasElement = document.querySelector('.output_canvas');
const canvasCtx = canvasElement.getContext('2d');

const message2Hand = document.getElementById('message-2hand');

let finger_id = [4, 8, 12, 16, 20];

let previousMoveTime = 0; // Thời gian thực thi trước đó

function detect_gesture(fingers) {
  if (JSON.stringify(fingers) === JSON.stringify([1, 1, 1, 1, 1])) {
    return "ROTATE";
  } else if(JSON.stringify(fingers) === JSON.stringify([0, 1, 1, 0, 0])){
    return "DOWN";
  } else if (JSON.stringify(fingers) === JSON.stringify([1, 0, 0, 0, 0])) {
    return "LEFT";
  } else if (JSON.stringify(fingers) === JSON.stringify([0, 0, 0, 0, 1])) {
    return "RIGHT";
  }
  return null;  // Trả về null nếu không khớp
}

const hands = new Hands({
  locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
});

hands.setOptions({
  maxNumHands: 2,
  modelComplexity: 1,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
});

hands.onResults((results) => {

  const currentTime = performance.now(); // Thời gian hiện tại

  canvasElement.width = videoElement.videoWidth;
  canvasElement.height = videoElement.videoHeight;

  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.translate(canvasElement.width, 0); // Dịch chuyển toàn bộ canvas sang phải
  canvasCtx.scale(-1, 1); // Lật khung hình theo trục dọc
  canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

  if (results.multiHandLandmarks) {
    results.multiHandLandmarks.forEach((landmarks, index) => {
      const handedness = results.multiHandedness[index].label; // 'Left' hoặc 'Right'
      // console.log(`Hand ${index + 1}: ${handedness}`);

      if (results.multiHandLandmarks.length >= 2 && MPipe.style.display == 'block') {
        // console.log('Chi su dung 1 ban tay');
        message2Hand.style.display = 'block';
        return;
      } else {
        let fingers = [0, 0, 0, 0, 0];
        if (handedness === 'Left') { // Do lật khung hình nên Left sẽ là bàn tay phải và ngược lại
          // Xử lí cho ngón cái - khối gạch qua trái
          // console.log(`Toa do X: ${landmarks[finger_id[0]].x}`);
          // console.log(`Toa do X -2: ${landmarks[finger_id[0] - 2].x}`);
          if (landmarks[finger_id[0]].x > (landmarks[finger_id[0] - 2].x + 0.015))
            fingers[0] = 1;

          // Xử lí cho ngón út - khối gạch qua phải
          if (landmarks[finger_id[4]].y < landmarks[finger_id[4] - 2].y)
            fingers[4] = 1;
        }
        else{ // Bàn tay trái
          // Xử lí cho ngón cái - khối gạch qua phải
          // console.log(`Toa do X: ${landmarks[finger_id[0]].x}`);
          // console.log(`Toa do X -2: ${landmarks[finger_id[0] - 2].x}`);
          if (landmarks[finger_id[0]].x < (landmarks[finger_id[0] - 2].x - 0.015))
            fingers[4] = 1;

          // Xử lí cho ngón út - khối gạch qua trái
          if (landmarks[finger_id[4]].y < landmarks[finger_id[4] - 2].y)
            fingers[0] = 1;
        }
        // Xử lí cho các ngón còn lại
        for(let i = 1; i < 4; i++){
          if(landmarks[finger_id[i]].y < landmarks[finger_id[i] - 2].y)
            fingers[i]=1;
        }
                    

        console.log(`Fingers: ${fingers}`);
        const command = detect_gesture(fingers);
        console.log(`Command: ${command}`);
        if (!board.gameOver && board.isPlaying && !isPaused && (currentTime - previousMoveTime > 400)) {
          switch (command) {
            case 'LEFT':
              brick.moveLeft();
              break;
            case 'RIGHT':
              brick.moveRight();
              break;
            case 'DOWN':
              brick.moveDown();
              break;
            case 'ROTATE':
              brick.rotate();
              break;
            // default:
            //   break;
          }
          previousMoveTime = currentTime;
        }
        message2Hand.style.display = 'none';
      }
    });

    for (const landmarks of results.multiHandLandmarks) {
      drawConnectors(canvasCtx, landmarks, Hands.HAND_CONNECTIONS, { color: '#00FF00', lineWidth: 5 });
      drawLandmarks(canvasCtx, landmarks, { color: '#FF0000', lineWidth: 2 });
    }
  }

  canvasCtx.restore();
});

const camera = new Camera(videoElement, {
  onFrame: async () => {
    await hands.send({ image: videoElement });
  },
  width: 1280,
  height: 720
});

camera.start();
