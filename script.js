let canvas = document.getElementById('myCanvas');
canvas.height = window.innerHeight -22;
canvas.width = window.innerWidth -10;
const maxWidth = canvas.width;
const maxHeight = canvas.height;
let gameState = 0; // 0: means idle 1: means running 2: means paused 3: means over
function getRandomHex(){
    return Math.floor(Math.random()*255);
}

function getRandomColor(){
    var red = getRandomHex();
    var green = getRandomHex();
    var blue = getRandomHex();
    return "rgb(" + red + "," + blue + "," + green +")";
}
let Paddle = function () {
    this.width = 400;
    this.height= 10;
    this.x=(maxWidth -this.width)/2;
    this.y = maxHeight-this.height;
    this.color = 'saddlebrown';
    this.velocity = maxWidth/30;
    this.moveToLeft=function() {
        if (paddle.x>=0 && (gameState === 1 || gameState===0)) {
            if (ball.onPaddle){
                dx = ball.x - paddle.x;
                paddle.x -= paddle.velocity;
                ball.stickOnPaddle(dx);
            } else paddle.x -= paddle.velocity;
        }
    };
    this.moveToRight=function() {
        if ((paddle.x+paddle.width)<=maxWidth && (gameState === 1 || gameState===0)) {
            if (ball.onPaddle){
                dx = ball.x - paddle.x;
                paddle.x += paddle.velocity;
                ball.stickOnPaddle(dx);
            } else paddle.x += paddle.velocity;
        }
    }
};
let Ball = function () {
    this.radius = 10;
    this.x = maxWidth/2;
    this.y = paddle.y-this.radius;
    this.color = 'gray';
    this.xVelocity = 0;
    this.yVelocity = 0;
    this.onPaddle = true;
    this.velocityMagnitude = 3;
    this.directionAngle = getDirection();
    this.stickOnPaddle = function (dx) {
        this.y = paddle.y - this.radius;
        this.x = paddle.x + dx;
    };
    this.hitEdges = function() {
        let distanceToZeroWidth = ball.radius - ball.xVelocity;
        let distanceToMaxWidth = maxWidth - ball.radius - ball.xVelocity;
        let distanceToZeroHeight = ball.radius - ball.yVelocity;
        if (this.x >= distanceToMaxWidth || this.x <= distanceToZeroWidth) {
            this.xVelocity = -this.xVelocity;
        }
        if (this.y < distanceToZeroHeight || ((this.y > (paddle.y - this.radius - this.yVelocity)) && (this.x >= paddle.x) && (this.x <= paddle.x + paddle.width))) {
            this.yVelocity = -this.yVelocity;
        }
    };
    this.hitConnerOfPaddle = function() {
        let distanceToMaxHeight = maxHeight - ball.radius - ball.yVelocity;
        let distanceToUpLeftConnerOfPaddle = Math.sqrt((paddle.x - this.x) * (paddle.x - this.x) +
            (paddle.y - this.y) * (paddle.y - this.y));
        let distanceToUpRightConnerOfPaddle = Math.sqrt((this.x - (paddle.x + paddle.width)) * (this.x - (paddle.x + paddle.width)) +
            (paddle.y - this.y) * (paddle.y - this.y));
        if ((this.y < distanceToMaxHeight) && ((distanceToUpLeftConnerOfPaddle <= this.radius && this.x<paddle.x) ||
            (distanceToUpRightConnerOfPaddle <= this.radius && this.x>paddle.x +paddle.width))) {
            this.xVelocity = -this.xVelocity;
            this.yVelocity = -this.yVelocity;
        }
    };
    this.hitConnerOfBlocks = function() {
        let distanceToUpLeftConnerOfBlock = Math.sqrt((blocks[r][c].x - this.x) * (blocks[r][c].x - this.x) +
            (blocks[r][c].y - this.y) * (blocks[r][c].y - this.y));
        let distanceToUpRightConnerOfBlock = Math.sqrt((this.x - (blocks[r][c].x + blocks[r][c].width)) *
            (this.x - (blocks[r][c].x + blocks[r][c].width)) + (blocks[r][c].y - this.y) * (blocks[r][c].y - this.y));
        let distanceToBottomLeftConnerOfBlock = Math.sqrt((blocks[r][c].x - this.x) * (blocks[r][c].x - this.x) +
            (blocks[r][c].y + blockHeight - this.y) * (blocks[r][c].y + blockHeight - this.y));
        let distanceToBottomRightConnerOfBlock = Math.sqrt((this.x - (blocks[r][c].x + blocks[r][c].width)) *
            (this.x - (blocks[r][c].x + blocks[r][c].width)) + (blocks[r][c].y + blockHeight - this.y) * (blocks[r][c].y + blockHeight - this.y));
        let ballGoesDownRight = this.xVelocity > 0 && this.yVelocity > 0;
        let ballGoesUpRight = this.xVelocity > 0 && this.yVelocity < 0;
        let ballGoesDownLeft = this.xVelocity < 0 && this.yVelocity > 0;
        let ballGoesUpLeft = this.xVelocity < 0 && this.yVelocity < 0;
        let ballOnUpLeftOfBlock = this.x < blocks[r][c].x && this.y < blocks[r][c].y;
        let ballOnBottomLeftOfBlock = this.x < blocks[r][c].x && this.y > blocks[r][c].y+blockHeight;
        let ballOnUpRightOfBlock = this.x > blocks[r][c].x+blockWidth && this.y < blocks[r][c].y;
        let ballOnBottomRightOfBlock = this.x > blocks[r][c].x+blockWidth && this.y > blocks[r][c].y+blockHeight;
        if (((((ballOnUpLeftOfBlock && ballGoesDownRight && distanceToUpLeftConnerOfBlock <= this.radius) || (ballOnBottomLeftOfBlock && ballGoesUpRight && distanceToBottomLeftConnerOfBlock <= this.radius))
            && (c === 0 || c === numberOfBlockColumn - 1 || blocks[r][c - 1].status === false)) ||
            (((ballOnUpRightOfBlock && ballGoesDownLeft && distanceToUpRightConnerOfBlock <= this.radius) || (ballOnBottomRightOfBlock && ballGoesUpLeft && distanceToBottomRightConnerOfBlock <= this.radius)) &&
                (c === 0 || c === numberOfBlockColumn - 1 || blocks[r][c + 1].status === false))) && blocks[r][c].status) {
            this.xVelocity = -this.xVelocity;
            this.yVelocity = -this.yVelocity;
            blocks[r][c].status = false;
        }
    };

    this.hitEdgesOfBlocks = function() {
        let verticalDistanceFromBottom = blocks[r][c].y + blockHeight + this.radius - this.yVelocity;
        let horizontalDistanceFromRight = blocks[r][c].x + blockWidth + this.radius - this.xVelocity;
        let verticalDistanceFromTop = blocks[r][c].y - this.radius - this.yVelocity;
        let horizontalDistanceFromLeft = blocks[r][c].x - this.radius - this.xVelocity;
        let ballHitBottomOfBlock = (this.y <= verticalDistanceFromBottom && this.y > blocks[r][c].y + blockHeight + this.radius);
        let ballHitTopOfBlock = (this.y >= verticalDistanceFromTop && this.y < blocks[r][c].y - this.radius);
        let ballInBlockWidthScope = this.x >= blocks[r][c].x && this.x <= blocks[r][c].x + blockWidth ;
        if ((ballHitBottomOfBlock || ballHitTopOfBlock) && ballInBlockWidthScope && blocks[r][c].status) {
            this.yVelocity = -this.yVelocity;
            blocks[r][c].status = false;
        }
        let ballHitLeftOfBlock = (this.x >= horizontalDistanceFromLeft && this.x < blocks[r][c].x - this.radius);
        let ballHitRightOfBlock = (this.x <= horizontalDistanceFromRight && this.x > blocks[r][c].x + blockWidth + this.radius);
        let ballInBlockHeightScope = this.y > blocks[r][c].y && this.y < blocks[r][c].y + blockHeight && blocks[r][c].status;
        if ((ballHitLeftOfBlock || ballHitRightOfBlock) && ballInBlockHeightScope) {
            this.xVelocity = -this.xVelocity;
            blocks[r][c].status = false;
        }
    }
};
let Block = function(r,c){
    this.height=blockHeight;
    this.width= blockWidth;
    this.x= blockOffset + blockWidth*c;
    this.y= blockHeight*(numberOfBlockRows-r-1);
    this.color= blockColor;
    this.status=true;
};
let blocks = [];
let blockColor = 'darkred';
function createBlocks(){
    for (r = 0;r<numberOfBlockRows;r++){
        blocks[r] = [];
        for (c=0;c<numberOfBlockColumn;c++){
            blocks[r][c] = new Block(r,c)
        }
    }
}
let paddle= new Paddle();
let ball = new Ball();
let blockOffset = ball.radius*2 +2;
let numberOfBlockRows = 5;
let numberOfBlockColumn = 20;
let blockHeight = (maxHeight - paddle.height -ball.radius*2)/30;
let blockWidth = (maxWidth -blockOffset*2)/numberOfBlockColumn ;
createBlocks();
function startGame(){
    var ctx = canvas.getContext("2d");
    let distanceToMaxHeight = maxHeight - ball.radius - ball.yVelocity;
    ball.hitEdges();
    ball.hitConnerOfPaddle();
    for (r = 0; r < blocks.length; r++) {
        for (c = 0; c < blocks[r].length; c++) {
            ball.hitEdgesOfBlocks();
            ball.hitConnerOfBlocks();
        }
    }
    checkGameOver();
    ball.x += ball.xVelocity;
    ball.y+=ball.yVelocity;
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

function updateBallVelocity() {
    ball.xVelocity = Math.cos(ball.directionAngle) * ball.velocityMagnitude;
    ball.yVelocity = -Math.sin(ball.directionAngle) * ball.velocityMagnitude;
}

function startBall(){
    if (gameState === 0) {
        updateBallVelocity();
        gameState =1;
        ball.onPaddle = false;
    }
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
function getDirection() {
    let directionAngle;
    if (Math.round(Math.random())>0.5) directionAngle = Math.random()* Math.PI/3 + Math.PI/12;
    else directionAngle = Math.random()* Math.PI/3 + 7*Math.PI/12;
    return directionAngle;
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
function IntervalTimer(callback, interval) {
    var timerId, startTime, remaining = 0;
    var state = 0; //  0 = idle, 1 = running, 2 = paused, 3= resumed

    this.pause = function () {
        if (state !== 1) return;

        remaining = interval - (new Date() - startTime);
        window.clearInterval(timerId);
        state = 2;
    };

    this.resume = function () {
        if (state !== 2) return;

        state = 3;
        window.setTimeout(this.timeoutCallback, remaining);
    };

    this.timeoutCallback = function () {
        if (state !== 3) return;

        callback();

        startTime = new Date();
        timerId = window.setInterval(callback, interval);
        state = 1;
    };

    this.stop = function(){
        window.clearInterval(timerId)
    };
    startTime = new Date();
    timerId = window.setInterval(callback, interval);
    state = 1;
}
let runGame = new IntervalTimer(startGame,1);
let setLevelUp = new IntervalTimer(levelUp,120000);