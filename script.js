function startGame(){
    var ctx = canvas.getContext("2d");
    let distanceToMaxHeight = maxHeight - ball.radius - ball.yVelocity;
    ball.hitEdges();
    ball.hitPaddle();
    ball.hitConnerOfPaddle();
    for (r = 0; r < blocks.length; r++) {
        for (c = 0; c < blocks[r].length; c++) {
            ball.hitEdgesOfBlocks();
            ball.hitConnerOfBlocks();
        }
    }
    ball.x += ball.xVelocity;
    ball.y += ball.yVelocity;
    checkGameOver();
    ctx.clearRect(0,0,maxWidth,maxHeight);
    ctx.beginPath();
    drawPaddle();
    drawBall();
    drawBlocks();
    ctx.stroke();
    ctx.closePath();
    function drawPaddle() {
        ctx.fillStyle = paddle.color;
        ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    }
    function drawBall() {
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = ball.color;
        ctx.fill();
    }
    function drawBlocks() {
        for (r = 0; r < blocks.length; r++) {
            for (c = 0; c < blocks[r].length; c++) {
                if (blocks[r][c].status) {
                    ctx.fillStyle = blocks[r][c].color;
                    ctx.fillRect(blocks[r][c].x+1, blocks[r][c].y+1, blocks[r][c].width-1, blocks[r][c].height-1);
                }
            }
        }
    }

    function checkGameOver() {
        if (ball.y >= distanceToMaxHeight) {
            runGame.stop();
            setLevelUp.stop();
            gameState = 3;
        }
        for (r = 0; r < blocks.length; r++) {
            for (c = 0; c < blocks[r].length; c++) {
                if (blocks[r][c].status && ((blocks[r][c].y + blockHeight) >= (paddle.y -ball.radius*2))){
                    runGame.stop();
                    setLevelUp.stop();
                    gameState = 3;
                }
            }
        }
    }
}
function docReady() {
    window.addEventListener('keydown', moveSelection);
}
function moveSelection(event) {
    switch (event.code) {
        case 'Space':
            switch (gameState) {
                case 0:
                    startBall();
                    gameState = 1;
                    break;
                case 1:
                    pauseGame();
                    gameState = 2;
                    break;
                case 2:
                    resumeGame();
                    gameState = 1;
                    break;
                case 3:
                    restartGame();
                    break;
            }
            break;
        case 'ArrowLeft':
            paddle.moveToLeft();
            break;
        case 'ArrowRight':
            paddle.moveToRight();
            break;
    }
}

function startBall(){
    ball.updateVelocity(ball.directionAngle,ball.velocityMagnitude);
    console.log(ball.directionAngle);
    console.log(Math.atan2(ball.yVelocity,ball.xVelocity));
    ball.onPaddle = false;
    setLevelUp = new IntervalTimer(levelUp,120000);
}
function restartGame() {
    document.location.reload();
}
function pauseGame() {
    runGame.pause();
    setLevelUp.pause();
}
function resumeGame() {
    runGame.resume();
    setLevelUp.resume();
}

function levelUp(){
    numberOfBlockRows++;
    blocks[blocks.length] = [];
    for (r = 0; r < blocks.length; r++) {
        for (c = 0; c < blocks[r].length; c++) {
            blocks[r][c].y +=blockHeight
        }
    }
    for (c = 0; c<blocks[numberOfBlockRows-2].length;c++){
        blocks[numberOfBlockRows-1][c] = new Block(numberOfBlockRows-1,c)
    }
}
let runGame = new IntervalTimer(startGame,1);
let setLevelUp;




// function Game() {
//     this.state = 0; // 0: means idle 1: means running 2: means paused 3: means over
//     this.startBall=function(){
//         ball.updateVelocity(ball.directionAngle,ball.velocityMagnitude);
//         ball.onPaddle = false;
//         this.setLevelUp = new IntervalTimer(this.levelUp,120000);
//     };
//     this.restart=function () {
//         document.location.reload();
//     };
//     this.pause=function () {
//         run.pause();
//         this.setLevelUp.pause();
//     };
//     this.resume=function () {
//         run.resume();
//         this.setLevelUp.resume();
//     };
//     this.over = function () {
//         run.stop();
//         this.setLevelUp.stop();
//     };
//     this.checkOver = function() {
//         let distanceToMaxHeight = maxHeight - ball.radius - ball.yVelocity;
//         if (ball.y >= distanceToMaxHeight) {
//             this.over();
//             this.state = 3;
//         }
//         for (r = 0; r < blocks.length; r++) {
//             for (c = 0; c < blocks[r].length; c++) {
//                 if (blocks[r][c].status && ((blocks[r][c].y + blockHeight) >= (paddle.y -ball.radius*2))){
//                     this.over();
//                     this.state = 3;
//                 }
//             }
//         }
//     };
//     this.start =function (){
//         var ctx = canvas.getContext("2d");
//         ctx.clearRect(0,0,maxWidth,maxHeight);
//         ctx.beginPath();
//         drawPaddle();
//         drawBall();
//         drawBlocks();
//         ctx.stroke();
//         ctx.closePath();
//         ball.hitEdges();
//         ball.hitConnerOfPaddle();
//         for (r = 0; r < blocks.length; r++) {
//             for (c = 0; c < blocks[r].length; c++) {
//                 ball.hitEdgesOfBlocks();
//                 ball.hitConnerOfBlocks();
//             }
//         }
//         ball.x += ball.xVelocity;
//         ball.y += ball.yVelocity;
//         this.checkOver();
//         function drawPaddle() {
//             ctx.fillStyle = paddle.color;
//             ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
//         }
//         function drawBall() {
//             ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
//             ctx.fillStyle = ball.color;
//             ctx.fill();
//         }
//         function drawBlocks() {
//             for (r = 0; r < blocks.length; r++) {
//                 for (c = 0; c < blocks[r].length; c++) {
//                     if (blocks[r][c].status) {
//                         ctx.fillStyle = blocks[r][c].color;
//                         ctx.fillRect(blocks[r][c].x+1, blocks[r][c].y+1, blocks[r][c].width-1, blocks[r][c].height-1);
//                     }
//                 }
//             }
//         }
//         this.docReady();
//     };
//     this.docReady = function() {
//         window.addEventListener('keydown', this.moveSelection);
//     };
//     this.moveSelection=function(event) {
//         switch (event.code) {
//             case 'Space':
//                 switch (this.state) {
//                     case 0:
//                         this.startBall();
//                         this.state = 1;
//                         break;
//                     case 1:
//                         this.pause();
//                         this.state = 2;
//                         break;
//                     case 2:
//                         this.resume();
//                         this.state = 1;
//                         break;
//                     case 3:
//                         this.restart();
//                         break;
//                 }
//                 break;
//             case 'ArrowLeft':
//                 paddle.moveToLeft();
//                 break;
//             case 'ArrowRight':
//                 paddle.moveToRight();
//                 break;
//         }
//     };
//
//     this.levelUp=function (){
//         numberOfBlockRows++;
//         blocks[blocks.length] = [];
//         for (r = 0; r < blocks.length; r++) {
//             for (c = 0; c < blocks[r].length; c++) {
//                 blocks[r][c].y +=blockHeight
//             }
//         }
//         for (c = 0; c<blocks[numberOfBlockRows-2].length;c++){
//             blocks[numberOfBlockRows-1][c] = new Block(numberOfBlockRows-1,c)
//         }
//     }
// }
// let game = new Game();
// let run = new IntervalTimer(game.start,1);