let canvas = document.getElementById('myCanvas');
canvas.height = window.innerHeight -22;
canvas.width = window.innerWidth -10;
const maxWidth = canvas.width;
const maxHeight = canvas.height;
let gameState = 0;
let Paddle = function () {
    this.width = 400;
    this.height= 10;
    this.x=(maxWidth -this.width)/2;
    this.y = maxHeight-this.height;
    this.color = 'saddlebrown';
    this.velocity = maxWidth/50;
    this.moveToLeft=function() {
        if (this.x>=0 && (gameState === 1 || gameState===0)) {
            if (ball.onPaddle){
                let dx = ball.x - this.x;
                this.x -= this.velocity;
                ball.stickOnPaddle(dx);
            } else this.x -= this.velocity;
        }
    };
    this.moveToRight=function() {
        if ((this.x+this.width)<=maxWidth && (gameState === 1 || gameState===0)) {
            if (ball.onPaddle){
                let dx = ball.x - this.x;
                this.x += this.velocity;
                ball.stickOnPaddle(dx);
            } else this.x += this.velocity;
        }
    }
};
let paddle= new Paddle();