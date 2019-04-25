let canvas = document.getElementById('myCanvas')
canvas.height = window.innerHeight - 22 -42
canvas.width = window.innerWidth - 10
const maxWidth = canvas.width
const maxHeight = canvas.height
let statsCanvas = document.getElementById('stats')
statsCanvas.style.top = canvas.height
statsCanvas.height = 36
statsCanvas.width = canvas.width
let gameState = 0
let Paddle = function () {
  let self = this
  this.leftArrowKeyPressed = false;
  this.rightArrowKeyPressed = false;
  this.width = 400
  this.height = 10
  this.x = (maxWidth - this.width) / 2
  this.y = maxHeight - this.height
  this.color = 'saddlebrown'
  this.velocity = maxWidth / 200
  this.moveToLeft = function () {
    if (gameState === 1 || gameState === 0) {
      if (ball.onPaddle) {
        let dx = ball.x - self.x
        if (self.x -self.velocity >= 0) self.x -= self.velocity
        else if (self.x -self.velocity< 0) self.x = 0
        ball.stickOnPaddle(dx)
      } else {
        if (self.x -self.velocity >= 0) self.x -= self.velocity
        else if (self.x -self.velocity< 0) self.x = 0
      }
    }
    console.log(self.x)
  }
  this.moveToRight = function () {
    if (gameState === 1 || gameState === 0){
      if (ball.onPaddle) {
        let dx = ball.x - self.x
        if ((self.x + self.width+ self.velocity) <= maxWidth) self.x += self.velocity
        else if ((self.x + self.width+ self.velocity) > maxWidth) self.x = maxWidth - self.width
        ball.stickOnPaddle(dx)
      } else {
        if ((self.x + self.width+ self.velocity) <= maxWidth) self.x += self.velocity
        else if ((self.x + self.width+ self.velocity) > maxWidth) self.x = maxWidth - self.width
      }
    }
    console.log(self.x)
  }
  this.moveByMouse = function(e) {
    var relativeX = e.clientX;
    if (self.x >= 0 && (self.x + self.width) <= maxWidth && (gameState === 1 || gameState === 0)){
      if (ball.onPaddle) {
        let dx = ball.x - self.x
        if(relativeX => self.width/2 && relativeX <= maxWidth -self.width/2) self.x = relativeX - self.width/2
        else if (self.x<0) self.x = 0
        else if (self.x > maxWidth-self.width) self.x = maxWidth
        ball.stickOnPaddle(dx)
      } else {
        if(relativeX => self.width/2 && relativeX <= maxWidth -self.width/2) self.x = relativeX - self.width/2
        else if (self.x<0) self.x = 0
        else if (self.x > maxWidth -self.width) self.x = maxWidth
      }
    }
    console.log(self.x)
  }
  this.move = function () {
    if (self.leftArrowKeyPressed) self.moveToLeft()
    if (self.rightArrowKeyPressed) self.moveToRight()
  }
}
let paddle = new Paddle()