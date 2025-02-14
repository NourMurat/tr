// #ft_transcendence/services/game/pong/static/pong/js/game.js

let scene, camera, renderer;
let table, ball, paddle1, paddle2, net;
let ballVelocity = new THREE.Vector3(0.06, 0, 0.03);
let score = {player1: 0, player2: 0};
let maxScore = 1; // Максимальный счёт для завершения игры
let gameStarted = false;
let game_id = window.location.href.split('match/').reverse()[0].slice(0, 2);
let player1, player2, score_player1, score_player2, winner, is_complete, tournamentStatus;
console.log(game_id);
async function fetchMatchDetails() {
    try {
      const response = await fetch(`http://localhost:5000/tournaments/${game_id}/details`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      // Assign fetched data to global variables
      player1 = data.player1;
      player2 = data.player2;
      score_player1 = data.score_player1;
      score_player2 = data.score_player2;
      winner = data.winner;
      is_complete = data.is_complete;
  
      updateGameUI();
    } catch (error) {
      console.error('Async fetch error:', error);
    }
  }
  
  // Call the async function
  fetchMatchDetails();
  
  
  function updateGameUI() {
    // Use the global variables safely here
    console.log('player1:', player1);
    console.log('player2:', player2);
  }
  
function init() {
    
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, 1);
    camera.lookAt(0, 0, 0);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0x333333);
    scene.add(ambientLight);

    const spotLight = new THREE.SpotLight(0xffffff, 0.5);
    spotLight.position.set(0, 10, 0);
    scene.add(spotLight);

    // Create table
    const tableGeometry = new THREE.BoxGeometry(10, 0.2, 6);
    const tableMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x000000,
        specular: 0x111111,
        shininess: 100
    });
    table = new THREE.Mesh(tableGeometry, tableMaterial);
    scene.add(table);

    // Create table border
    const borderGeometry = new THREE.EdgesGeometry(tableGeometry);
    const borderMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00, linewidth: 2 });
    const border = new THREE.LineSegments(borderGeometry, borderMaterial);
    table.add(border);

    // Create ball
    const ballGeometry = new THREE.SphereGeometry(0.2, 32, 32);
    const ballMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xff00aa,
        emissive: 0xff00aa,
        emissiveIntensity: 0.5
    });
    ball = new THREE.Mesh(ballGeometry, ballMaterial);
    ball.position.set(0, 0.5, 0);
    scene.add(ball);

    // Create paddles
    const paddleGeometry = new THREE.BoxGeometry(0.2, 0.4, 1.4);
    const paddleMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x00ccff,
        emissive: 0x00ccff,
        emissiveIntensity: 0.5
    });
    
    paddle1 = new THREE.Mesh(paddleGeometry, paddleMaterial);
    paddle1.position.set(-4.9, 0.5, 0);
    scene.add(paddle1);

    paddle2 = new THREE.Mesh(paddleGeometry, paddleMaterial);
    paddle2.position.set(4.9, 0.5, 0);
    scene.add(paddle2);

    // Create net
    const netGeometry = new THREE.BoxGeometry(0.05, 0.4, 6);
    const netMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x444444,
        emissive: 0x444444,
        emissiveIntensity: 0.2
    });
    net = new THREE.Mesh(netGeometry, netMaterial);
    net.position.set(0, 0.3, 0);
    scene.add(net);

    // Add event listeners
    window.addEventListener('resize', onWindowResize, false);
    document.addEventListener('keydown', onKeyDown, false);
    document.getElementById('startButton').addEventListener('click', startGame);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onKeyDown(event) {
    if (!gameStarted) return;
    const speed = 0.2;
    switch(event.key) {
        case 's':
            if (paddle1.position.z < 2.5) paddle1.position.z += speed;
            break;
        case 'w':
            if (paddle1.position.z > -2.5) paddle1.position.z -= speed;
            break;
        case 'ArrowDown':
            if (paddle2.position.z < 2.5) paddle2.position.z += speed;
            break;
        case 'ArrowUp':
            if (paddle2.position.z > -2.5) paddle2.position.z -= speed;
            break;
    }
}

function startGame() {
    gameStarted = true;
    document.getElementById('startButton').style.display = 'none';
    resetBall();
}

function updateScore() {
    document.getElementById('score').textContent = `${score.player1.toString().padStart(2, '0')} - ${score.player2.toString().padStart(2, '0')}`;
    document.getElementById('score').style.transform = 'translateX(-50%) scale(1.2)';
    setTimeout(() => {
        document.getElementById('score').style.transform = 'translateX(-50%) scale(1)';
    }, 200);
    checkGameOver(); // Добавляем вызов проверки окончания игры
}

function checkGameOver() {
    if (score.player1 >= maxScore || score.player2 >= maxScore) {
        gameStarted = false;
        displayWinner();
    }
}

function displayWinner() {
    const winner = score.player1 >= maxScore ? "Player 1" : "Player 2";
    const winnerMessage = document.createElement('div');
    winnerMessage.id = 'winnerMessage';
    winnerMessage.style.position = 'absolute';
    winnerMessage.style.top = '40%'; // Смещение выше центра экрана
    winnerMessage.style.left = '50%';
    winnerMessage.style.transform = 'translate(-50%, -50%)';
    winnerMessage.style.fontSize = '48px';
    winnerMessage.style.color = '#ff00aa';
    winnerMessage.style.textAlign = 'center';
    winnerMessage.style.textShadow = '0 0 10px #ff00aa66';
    winnerMessage.textContent = `${winner} Wins!`;
    console.log(tournamentStatus);

    if (tournamentStatus) {
        const redirectButton = document.createElement('button');
        redirectButton.textContent = 'Go to tournament';
        redirectButton.id = 'redirectButton';
        redirectButton.style.position = 'absolute';
        redirectButton.style.top = '55%'; // Кнопка ниже надписи
        redirectButton.style.left = '50%';
        redirectButton.style.transform = 'translate(-50%, -50%)';
        redirectButton.style.fontSize = '24px';
        redirectButton.style.color = '#00ccff';
        redirectButton.style.background = 'transparent';
        redirectButton.style.border = '2px solid #00ccff';
        redirectButton.style.padding = '10px 20px';
        redirectButton.style.cursor = 'pointer';
        redirectButton.style.transition = 'all 0.3s ease';
        redirectButton.style.fontFamily = 'Orbitron, sans-serif';
        redirectButton.style.textTransform = 'uppercase';
        redirectButton.style.letterSpacing = '2px';
        redirectButton.style.boxShadow = '0 0 10px #00ccff66';
        document.body.appendChild(redirectButton);
        // fetch post request to update tournament status with details using game id
        // fetch(`/tournaments/${game_id}/update`, {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({
        //         status: 'completed',
        //         winner: winner,
        //         score: score,
        //         player1: player1,
        //         player2: player2,
        //         score_player1
        //         score_player2
        //         winner
        //         is_complete
        //     })
        // })
        // .then(response => response.json())
        // .then(data => {
        //     console.log('Success:', data);
        // })
        // .catch((error) => {
        //     console.error('Error:', error);
        // }
        // );
        redirectButton.addEventListener('click', () => {
            window.location.href = `http://localhost:5000/tournaments/9`;
        });

    }else{
       
        const restartButton = document.createElement('button');
        restartButton.textContent = 'Restart Game';
        restartButton.id = 'restartButton';
        restartButton.style.position = 'absolute';
        restartButton.style.top = '55%'; // Кнопка ниже надписи
        restartButton.style.left = '50%';
        restartButton.style.transform = 'translate(-50%, -50%)';
        restartButton.style.fontSize = '24px';
        restartButton.style.color = '#00ccff';
        restartButton.style.background = 'transparent';
        restartButton.style.border = '2px solid #00ccff';
        restartButton.style.padding = '10px 20px';
        restartButton.style.cursor = 'pointer';
        restartButton.style.transition = 'all 0.3s ease';
        restartButton.style.fontFamily = 'Orbitron, sans-serif';
        restartButton.style.textTransform = 'uppercase';
        restartButton.style.letterSpacing = '2px';
        restartButton.style.boxShadow = '0 0 10px #00ccff66';

        restartButton.addEventListener('click', () => {
        score.player1 = 0;
        score.player2 = 0;
        updateScore();
        winnerMessage.remove();
        restartButton.remove(); // Удаляем кнопку из DOM
        gameStarted = true; // Запускаем игру
        resetBall(); // Перезапускаем мяч
        });
        document.body.appendChild(restartButton);

    }
    document.body.appendChild(winnerMessage);
}

function animate() {
    requestAnimationFrame(animate);

    if (gameStarted) {
        // Move the ball
        ball.position.add(ballVelocity);

        // Check for collisions with table edges
        if (ball.position.z > 2.9 || ball.position.z < -2.9) {
            ballVelocity.z = -ballVelocity.z;
        }

        // Check for collisions with paddles
        if (ball.position.x < -4.7 && ball.position.z > paddle1.position.z - 0.7 && ball.position.z < paddle1.position.z + 0.7) {
            ballVelocity.x = -ballVelocity.x * 1.05;
            ballVelocity.z += (ball.position.z - paddle1.position.z) * 0.1;
        }
        if (ball.position.x > 4.7 && ball.position.z > paddle2.position.z - 0.7 && ball.position.z < paddle2.position.z + 0.7) {
            ballVelocity.x = -ballVelocity.x * 1.05;
            ballVelocity.z += (ball.position.z - paddle2.position.z) * 0.1;
        }

        // Check for scoring
        if (ball.position.x < -5) {
            score.player2++;
            updateScore();
            resetBall();
        } else if (ball.position.x > 5) {
            score.player1++;
            updateScore();
            resetBall();
        }

        // Rotate the ball
        ball.rotation.x += ballVelocity.z * 0.2;
        ball.rotation.z -= ballVelocity.x * 0.2;
    }

    renderer.render(scene, camera);
}

function resetBall() {
    ball.position.set(0, 0.5, 0);
    ballVelocity = new THREE.Vector3(
        (Math.random() > 0.5 ? 0.06 : -0.06),
        0,
        (Math.random() - 0.5) * 0.04
    );

    // Возвращаем ракетки в стартовые позиции
    paddle1.position.set(-4.9, 0.5, 0);
    paddle2.position.set(4.9, 0.5, 0);
}

init();
animate();