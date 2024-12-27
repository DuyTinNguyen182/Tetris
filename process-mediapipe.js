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
        // console.log(`Command: ${command}`);
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
