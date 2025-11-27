import { useEffect, useRef, useState } from 'react';

export default function PingPong() {
  const canvasRef = useRef(null);
  const ballImageRef = useRef(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState({ player: 0, computer: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const paddleHitCount = useRef(2);
  const keyState = useRef({ ArrowUp: false, ArrowDown: false });
  
  // Game constants
  const PADDLE_SPEED = 4;  // Speed of paddle movement


  // Sound effects
  const sounds = ['/sounds/hit3.mp3'];

  const playRandomSound = () => {
    const audio = new Audio(sounds[0]);
    audio.play().catch(error => console.error('Error playing sound:', error));
  };

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Game objects - dimensions will be set based on canvas size
  const [dimensions, setDimensions] = useState({
    paddleHeight: 80,
    paddleWidth: 10,
    ballSize: 40,
    canvasWidth: 640,
    canvasHeight: 400
  });

  // Matrix rain effect
  const [matrixRain, setMatrixRain] = useState([]);
  const matrixCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$@#&%".split("");

  // Initialize matrix rain
  useEffect(() => {
    const initMatrixRain = () => {
      const drops = [];
      const density = Math.floor(dimensions.canvasWidth / 20); // One drop every 20px
      for (let i = 0; i < density; i++) {
        drops.push({
          x: Math.random() * dimensions.canvasWidth,
          y: Math.random() * dimensions.canvasHeight,
          speed: 1 + Math.random() * 2,
          char: matrixCharacters[Math.floor(Math.random() * matrixCharacters.length)]
        });
      }
      setMatrixRain(drops);
    };

    initMatrixRain();
  }, [dimensions.canvasWidth, dimensions.canvasHeight]);

  // Update matrix rain
  const updateMatrixRain = (ctx) => {
    const updatedRain = matrixRain.map(drop => {
      // Draw the character
      ctx.fillStyle = 'rgba(0, 255, 0, 0.15)';
      ctx.font = '12px monospace';
      ctx.fillText(drop.char, drop.x, drop.y);

      // Update position
      drop.y += drop.speed;
      
      // Reset if it goes off screen
      if (drop.y > dimensions.canvasHeight) {
        drop.y = 0;
        drop.x = Math.random() * dimensions.canvasWidth;
        drop.char = matrixCharacters[Math.floor(Math.random() * matrixCharacters.length)];
      }

      return drop;
    });

    setMatrixRain(updatedRain);
  };

  const gameState = useRef({
    playerY: 160,
    computerY: 160,
    ballX: 320,
    ballY: 200,
    rotation: 0
  });

  // Update dimensions based on screen size
  useEffect(() => {
    const updateDimensions = () => {
      if (isMobile) {
        // Vertical layout - optimized for mobile
        const width = Math.min(window.innerWidth - 32, 300); // Narrower width
        const height = Math.min(window.innerHeight - 250, 450); // Taller height, but leave space for UI
        setDimensions({
          paddleHeight: 15, // Increased from 10 to be more visible
          paddleWidth: width / 3, // Slightly smaller than before for better gameplay
          ballSize: width / 8, // Adjusted ball size
          canvasWidth: width,
          canvasHeight: height
        });
      } else {
        // Horizontal layout
        setDimensions({
          paddleHeight: 80,
          paddleWidth: 10,
          ballSize: 40,
          canvasWidth: 640,
          canvasHeight: 400
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [isMobile]);

  // Load ball image
  useEffect(() => {
    const loadImage = async () => {
      try {
        const response = await fetch('/1waylogo.png');
        const blob = await response.blob();
        const dataUrl = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        });

        const ballImage = new Image();
        ballImage.src = dataUrl;
        
        ballImage.onload = () => {
          ballImageRef.current = ballImage;
          setImageLoaded(true);
        };
      } catch (error) {
        console.error('Error loading ball image:', error);
        setImageLoaded(true);
      }
    };

    loadImage();
  }, []);

  useEffect(() => {
    if (!imageLoaded) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Reset game state with new dimensions
    const resetGameState = () => {
      if (isMobile) {
        gameState.current = {
          playerY: dimensions.canvasWidth / 2,
          computerY: dimensions.canvasWidth / 2,
          ballX: dimensions.canvasWidth / 2,
          ballY: dimensions.canvasHeight / 2,
          ballSpeedX: (Math.random() * 4 - 2), // Reduced horizontal speed for mobile
          ballSpeedY: 3 * (Math.random() > 0.5 ? 1 : -1), // Reduced vertical speed for mobile
          rotation: 0
        };
      } else {
        gameState.current = {
          playerY: dimensions.canvasHeight / 2,
          computerY: dimensions.canvasHeight / 2,
          ballX: dimensions.canvasWidth / 2,
          ballY: dimensions.canvasHeight / 2,
          ballSpeedX: 5,
          ballSpeedY: 5,
          rotation: 0
        };
      }
    };

    resetGameState();

    // Handle keyboard controls
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault(); // Prevent page scrolling
        keyState.current[e.key] = true;
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        keyState.current[e.key] = false;
      }
    };

    // Add keyboard event listeners
    if (!isMobile) {
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);
    }

    const handleInput = (e) => {
      if (isMobile) {
        const rect = canvas.getBoundingClientRect();
        const position = e.type.includes('touch') 
          ? e.touches[0].clientX - rect.left 
          : e.clientX - rect.left;
        gameState.current.playerY = Math.min(
          Math.max(position - dimensions.paddleWidth / 2, 0),
          canvas.width - dimensions.paddleWidth
        );
      }
    };

    const updatePlayerPosition = () => {
      if (!isMobile && gameStarted) {
        if (keyState.current.ArrowUp) {
          gameState.current.playerY = Math.max(0, gameState.current.playerY - PADDLE_SPEED);
        }
        if (keyState.current.ArrowDown) {
          gameState.current.playerY = Math.min(
            canvas.height - dimensions.paddleHeight,
            gameState.current.playerY + PADDLE_SPEED
          );
        }
      }
    };

    const updateGame = () => {
      if (!gameStarted) return;

      // Update player paddle position based on keyboard input
      updatePlayerPosition();

      // Calculate visual dimensions based on aspect ratio
      const visualBallHeight = dimensions.ballSize * 1.5;
      const visualBallWidth = visualBallHeight * (578 / 432);

      // Define effective collision size (adjust factor for perceived hit box)
      const collisionAdjustmentFactor = 0.85; // Hitbox is 85% of visual size
      const collisionBallWidth = visualBallWidth * collisionAdjustmentFactor;
      const collisionBallHeight = visualBallHeight * collisionAdjustmentFactor;

      // Calculate ball's collision edges based on its current center (gameState.current.ballX/Y)
      const ballLeft = gameState.current.ballX - collisionBallWidth / 2;
      const ballRight = gameState.current.ballX + collisionBallWidth / 2;
      const ballTop = gameState.current.ballY - collisionBallHeight / 2;
      const ballBottom = gameState.current.ballY + collisionBallHeight / 2;

      // --- Move Ball --- (Do this *before* collision checks for current frame)
      let nextBallX = gameState.current.ballX + gameState.current.ballSpeedX;
      let nextBallY = gameState.current.ballY + gameState.current.ballSpeedY;

      // Calculate next position's collision edges
      let nextBallLeft = nextBallX - collisionBallWidth / 2;
      let nextBallRight = nextBallX + collisionBallWidth / 2;
      let nextBallTop = nextBallY - collisionBallHeight / 2;
      let nextBallBottom = nextBallY + collisionBallHeight / 2;


      if (isMobile) {
        // --- Mobile Collision & Update Logic ---

        // Check Side Wall Collision
        if (nextBallLeft <= 0) {
          gameState.current.ballSpeedX = Math.abs(gameState.current.ballSpeedX); // Bounce right
          nextBallX = collisionBallWidth / 2; // Correct position
        } else if (nextBallRight >= canvas.width) {
          gameState.current.ballSpeedX = -Math.abs(gameState.current.ballSpeedX); // Bounce left
          nextBallX = canvas.width - collisionBallWidth / 2; // Correct position
        }

        // Check Player Paddle Collision (Top)
        if (gameState.current.ballSpeedY < 0 && // Moving Up
            nextBallTop <= dimensions.paddleHeight * 2 &&
            ballTop > dimensions.paddleHeight * 2 && // Check previous frame was below paddle
            nextBallRight >= gameState.current.playerY &&
            nextBallLeft <= gameState.current.playerY + dimensions.paddleWidth) {
          gameState.current.ballSpeedY = Math.abs(gameState.current.ballSpeedY); // Bounce Down
          nextBallY = dimensions.paddleHeight * 2 + collisionBallHeight / 2; // Correct position
          playRandomSound();
        }

        // Check Computer Paddle Collision (Bottom)
        if (gameState.current.ballSpeedY > 0 && // Moving Down
            nextBallBottom >= canvas.height - dimensions.paddleHeight * 2 &&
            ballBottom < canvas.height - dimensions.paddleHeight * 2 && // Check previous frame was above paddle
            nextBallRight >= gameState.current.computerY &&
            nextBallLeft <= gameState.current.computerY + dimensions.paddleWidth) {
          gameState.current.ballSpeedY = -Math.abs(gameState.current.ballSpeedY); // Bounce Up
          nextBallY = canvas.height - dimensions.paddleHeight * 2 - collisionBallHeight / 2; // Correct position
          playRandomSound();
        }

        // Check for Scoring
        if (nextBallBottom <= 0) { // Went past top
          const newScore = { ...score, computer: score.computer + 1 };
          setScore(newScore);
          if (newScore.computer >= 5) {
            setGameOver(true); setWinner('Computer'); setGameStarted(false);
            return; // End update early
          } else { resetBall(); return; }
        } else if (nextBallTop >= canvas.height) { // Went past bottom
          const newScore = { ...score, player: score.player + 1 };
          setScore(newScore);
          if (newScore.player >= 5) {
            setGameOver(true); setWinner('Player'); setGameStarted(false);
            return; // End update early
          } else { resetBall(); return; }
        }

        // Update Ball Position
        gameState.current.ballX = nextBallX;
        gameState.current.ballY = nextBallY;

        // Computer AI
        const computerSpeed = 1;
        const computerCenter = gameState.current.computerY + dimensions.paddleWidth / 2;
        const targetX = gameState.current.ballX; // Target the ball's X position
        if (computerCenter < targetX - 10) { // Add some tolerance
          gameState.current.computerY = Math.min(gameState.current.computerY + computerSpeed, canvas.width - dimensions.paddleWidth);
        } else if (computerCenter > targetX + 10) {
          gameState.current.computerY = Math.max(gameState.current.computerY - computerSpeed, 0);
        }

      } else {
        // --- Desktop Collision & Update Logic ---

        // Check Top/Bottom Wall Collision
        if (nextBallTop <= 0) {
          gameState.current.ballSpeedY = Math.abs(gameState.current.ballSpeedY); // Bounce down
          nextBallY = collisionBallHeight / 2; // Correct position
        } else if (nextBallBottom >= canvas.height) {
          gameState.current.ballSpeedY = -Math.abs(gameState.current.ballSpeedY); // Bounce up
          nextBallY = canvas.height - collisionBallHeight / 2; // Correct position
        }

        // Check Player Paddle Collision (Left)
        if (gameState.current.ballSpeedX < 0 && // Moving Left
            nextBallLeft <= dimensions.paddleWidth * 2 &&
            ballLeft > dimensions.paddleWidth * 2 && // Check previous frame was to the right
            nextBallBottom >= gameState.current.playerY &&
            nextBallTop <= gameState.current.playerY + dimensions.paddleHeight) {
          gameState.current.ballSpeedX = Math.abs(gameState.current.ballSpeedX); // Bounce Right
          nextBallX = dimensions.paddleWidth * 2 + collisionBallWidth / 2; // Correct position
          playRandomSound();
        }

        // Check Computer Paddle Collision (Right)
        if (gameState.current.ballSpeedX > 0 && // Moving Right
            nextBallRight >= canvas.width - dimensions.paddleWidth * 2 &&
            ballRight < canvas.width - dimensions.paddleWidth * 2 && // Check previous frame was to the left
            nextBallBottom >= gameState.current.computerY &&
            nextBallTop <= gameState.current.computerY + dimensions.paddleHeight) {
          gameState.current.ballSpeedX = -Math.abs(gameState.current.ballSpeedX); // Bounce Left
          nextBallX = canvas.width - dimensions.paddleWidth * 2 - collisionBallWidth / 2; // Correct position
          playRandomSound();
        }

        // Check for Scoring
        if (nextBallRight <= 0) { // Went past left edge
          const newScore = { ...score, computer: score.computer + 1 };
          setScore(newScore);
          if (newScore.computer >= 5) {
            setGameOver(true); setWinner('Computer'); setGameStarted(false);
            return; // End update early
          } else { resetBall(); return; }
        } else if (nextBallLeft >= canvas.width) { // Went past right edge
          const newScore = { ...score, player: score.player + 1 };
          setScore(newScore);
          if (newScore.player >= 5) {
            setGameOver(true); setWinner('Player'); setGameStarted(false);
            return; // End update early
          } else { resetBall(); return; }
        }

        // Update Ball Position
        gameState.current.ballX = nextBallX;
        gameState.current.ballY = nextBallY;

        // Computer AI
        const computerSpeed = 2;
        const computerCenter = gameState.current.computerY + dimensions.paddleHeight / 2;
        const targetY = gameState.current.ballY; // Target the ball's Y position
        if (computerCenter < targetY - 15) { // Add some tolerance
          gameState.current.computerY = Math.min(gameState.current.computerY + computerSpeed, canvas.height - dimensions.paddleHeight);
        } else if (computerCenter > targetY + 15) {
          gameState.current.computerY = Math.max(gameState.current.computerY - computerSpeed, 0);
        }
      }
    };

    const resetBall = () => {
      if (isMobile) {
        gameState.current.ballX = canvas.width / 2;
        gameState.current.ballY = canvas.height / 2;
        // More dynamic ball reset
        gameState.current.ballSpeedX = (Math.random() * 12 - 6); // Doubled from -3 to 3 to -6 to 6
        gameState.current.ballSpeedY = (Math.random() > 0.5 ? 10 : -10); // Doubled from 5 to 10
      } else {
        gameState.current.ballX = canvas.width / 2;
        gameState.current.ballY = canvas.height / 2;
        gameState.current.ballSpeedX = 10 * (Math.random() > 0.5 ? 1 : -1);  // Doubled from 5 to 10
        gameState.current.ballSpeedY = 10 * (Math.random() > 0.5 ? 1 : -1);  // Doubled from 5 to 10
      }
    };

    const draw = () => {
      // Clear canvas with semi-transparent black for trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';  // Changed from 0.6 to 0.4 for slightly more motion blur
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw matrix rain
      updateMatrixRain(ctx);

      // Draw center line
      ctx.setLineDash([5, 15]);
      ctx.beginPath();
      if (isMobile) {
        ctx.moveTo(0, canvas.height / 2);
        ctx.lineTo(canvas.width, canvas.height / 2);
      } else {
        ctx.moveTo(canvas.width / 2, 0);
        ctx.lineTo(canvas.width / 2, canvas.height);
      }
      ctx.strokeStyle = '#00ff00';
      ctx.stroke();

      // Draw game explanation box if game hasn't started
      if (!gameStarted && !gameOver) {
        // Draw semi-transparent background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw explanation box with adjusted width for mobile
        const boxWidth = isMobile ? Math.min(280, canvas.width - 20) : Math.min(400, canvas.width - 40);
        const boxHeight = isMobile ? 240 : 220; // Increased height for mobile
        const boxX = (canvas.width - boxWidth) / 2;
        const boxY = (canvas.height - boxHeight) / 2;

        // Draw box background
        ctx.fillStyle = '#000000';
        ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
        
        // Draw box border with matrix green glow
        ctx.strokeStyle = '#00ff00';
        ctx.shadowColor = '#00ff00';
        ctx.shadowBlur = 10;
        ctx.lineWidth = 2;
        ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);
        
        // Reset shadow for text
        ctx.shadowBlur = 0;

        // Draw text
        ctx.fillStyle = '#00ff00';
        ctx.textAlign = 'center';
        
        // Title - smaller on mobile
        ctx.font = isMobile ? 'bold 18px monospace' : 'bold 20px monospace';
        ctx.fillText('MATRIX PONG', canvas.width / 2, boxY + (isMobile ? 45 : 50));
        
        // Instructions with more spacing and smaller text on mobile
        ctx.font = isMobile ? '14px monospace' : '16px monospace';
        
        // Update instructions text for desktop
        if (isMobile) {
          ctx.fillText('SLIDE LEFT AND RIGHT', canvas.width / 2, boxY + 85);
          ctx.fillText('TO MOVE YOUR PADDLE', canvas.width / 2, boxY + 110);
        } else {
          ctx.fillText('USE UP AND DOWN ARROWS', canvas.width / 2, boxY + 85);
          ctx.fillText('TO CONTROL THE PADDLE', canvas.width / 2, boxY + 110);
        }
        
        ctx.fillText('FIRST TO SCORE 5 POINTS WINS', canvas.width / 2, boxY + (isMobile ? 150 : 130));
        
        // Start instruction with pulsing effect
        ctx.font = isMobile ? 'bold 14px monospace' : 'bold 16px monospace';
        const startText = isMobile ? 'TAP TO START' : 'CLICK TO START';
        const pulseIntensity = (Math.sin(Date.now() / 500) + 1) / 2;
        ctx.fillStyle = `rgba(0, 255, 0, ${0.5 + pulseIntensity * 0.5})`;
        ctx.fillText(startText, canvas.width / 2, boxY + (isMobile ? 190 : 170));

        return;
      }

      // Draw paddles with matrix green color and glow effect
      ctx.shadowColor = '#00ff00';
      ctx.shadowBlur = 10;
      ctx.fillStyle = '#00ff00';
      if (isMobile) {
        // Player paddle at top - moved down slightly
        ctx.fillRect(gameState.current.playerY, dimensions.paddleHeight, dimensions.paddleWidth, dimensions.paddleHeight);
        // Computer paddle at bottom - moved up slightly
        ctx.fillRect(
          gameState.current.computerY,
          canvas.height - dimensions.paddleHeight * 2,
          dimensions.paddleWidth,
          dimensions.paddleHeight
        );
      } else {
        // Horizontal layout paddles
        ctx.fillRect(dimensions.paddleWidth, gameState.current.playerY, dimensions.paddleWidth, dimensions.paddleHeight);
        ctx.fillRect(
          canvas.width - dimensions.paddleWidth * 2,
          gameState.current.computerY,
          dimensions.paddleWidth,
          dimensions.paddleHeight
        );
      }

      // Reset shadow blur for other elements
      ctx.shadowBlur = 0;

      // Draw ball with matrix green color
      if (ballImageRef.current) {
        try {
          ctx.save();
          // Tint the ball green
          ctx.globalCompositeOperation = 'source-over';
          ctx.fillStyle = '#00ff00';
          
          // Calculate aspect ratio based on original dimensions
          const originalWidth = 578;
          const originalHeight = 432;
          const aspectRatio = originalWidth / originalHeight;
          
          // Base the size on the ball size dimension but maintain aspect ratio
          const drawHeight = dimensions.ballSize * 1.5;
          const drawWidth = drawHeight * aspectRatio;
          
          // Draw the ball with a matrix green tint
          ctx.globalAlpha = 0.8;
          ctx.drawImage(
            ballImageRef.current,
            gameState.current.ballX - drawWidth / 2,
            gameState.current.ballY - drawHeight / 2,
            drawWidth,
            drawHeight
          );
          ctx.restore();
        } catch (error) {
          console.error('Error drawing ball image:', error);
          // Fallback to a simple green circle
          ctx.beginPath();
          ctx.arc(
            gameState.current.ballX,
            gameState.current.ballY,
            dimensions.ballSize / 2,
            0,
            Math.PI * 2
          );
          ctx.fillStyle = '#00ff00';
          ctx.fill();
        }
      }

      // Draw score with matrix style
      ctx.font = '32px monospace';
      ctx.fillStyle = '#00ff00';
      if (isMobile) {
        ctx.fillText(score.player, 30, canvas.height / 4);
        ctx.fillText(score.computer, 30, (3 * canvas.height) / 4);
      } else {
        ctx.fillText(score.player, canvas.width / 4, 50);
        ctx.fillText(score.computer, (3 * canvas.width) / 4, 50);
      }

      // Draw game over message with matrix style
      if (!gameStarted) {
        ctx.font = '16px monospace';
        ctx.fillStyle = '#00ff00';
        if (gameOver) {
          const gameOverText = `${winner} WINS`;
          const restartText = 'CLICK TO PLAY AGAIN';
          // Add glow effect to game over text
          ctx.shadowColor = '#00ff00';
          ctx.shadowBlur = 10;
          ctx.fillText(
            gameOverText,
            canvas.width / 2 - ctx.measureText(gameOverText).width / 2,
            canvas.height / 2 - 20
          );
          ctx.fillText(
            restartText,
            canvas.width / 2 - ctx.measureText(restartText).width / 2,
            canvas.height / 2 + 20
          );
          ctx.shadowBlur = 0;
        }
      }

      updateGame();
      animationFrameId = requestAnimationFrame(draw);
    };

    // Event listeners for both mouse and touch
    canvas.addEventListener('mousemove', handleInput);
    canvas.addEventListener('touchmove', handleInput, { passive: false });
    canvas.addEventListener('touchstart', handleInput, { passive: false });
    
    canvas.addEventListener('click', () => {
      if (gameOver) {
        setScore({ player: 0, computer: 0 });
        setGameOver(false);
        setWinner(null);
        resetBall();
      }
      setGameStarted(true);
    });

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (!isMobile) {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
      }
      canvas.removeEventListener('mousemove', handleInput);
      canvas.removeEventListener('touchmove', handleInput);
      canvas.removeEventListener('touchstart', handleInput);
    };
  }, [gameStarted, score, imageLoaded, gameOver, winner, dimensions, isMobile]);

  if (!imageLoaded) {
    return (
      <div className="flex flex-col items-center w-full h-full bg-black p-4 text-[#00ff00] select-none font-mono">
        LOADING...
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full h-full bg-black p-4 select-none">
      <div className={`${isMobile ? 'mt-2' : 'mt-4'}`}>
        <canvas
          ref={canvasRef}
          width={dimensions.canvasWidth}
          height={dimensions.canvasHeight}
          className="border-2 border-[#00ff00] shadow-[0_0_10px_#00ff00]"
        />
      </div>
      <div className={`${isMobile ? 'mt-2' : 'mt-4'} text-[#00ff00] text-sm text-center px-2 font-mono flex items-center justify-center gap-4`}>
        {isMobile ? (
          'SLIDE LEFT AND RIGHT TO MOVE THE PADDLE'
        ) : (
          <>
            USE UP AND DOWN ARROW KEYS TO CONTROL THE PADDLE
            <div className="flex flex-col gap-1">
              <div className="w-8 h-8 border border-[#00ff00] rounded-sm flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 4L4 12H9V20H15V12H20L12 4Z" fill="#00ff00" transform="rotate(180 12 12)"/>
                </svg>
              </div>
              <div className="w-8 h-8 border border-[#00ff00] rounded-sm flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 4L4 12H9V20H15V12H20L12 4Z" fill="#00ff00"/>
                </svg>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 