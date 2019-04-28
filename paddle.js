let canvas = document.getElementById('myCanvas')
canvas.height = window.innerHeight - 22 - 42
canvas.width = window.innerWidth - 10
const maxWidth = canvas.width
const maxHeight = canvas.height
let statsCanvas = document.getElementById('stats')
let message = document.getElementById('message')
statsCanvas.style.top = canvas.height
statsCanvas.height = 36
statsCanvas.width = canvas.width
let ctx = canvas.getContext('2d')
let stats = statsCanvas.getContext('2d')
let gameState = 0 // 0: means idle 1: means running 2: means paused 3: means over
let Paddle = function () {
  let self = this
  this.leftArrowKeyPressed = false
  this.rightArrowKeyPressed = false
  this.width = 400
  this.height = 10
  this.x = (maxWidth - this.width) / 2
  this.y = maxHeight - this.height
  this.color = 'saddlebrown'
  this.velocity = maxWidth / 400
  this.moveToLeft = function () {
    if (gameState === 1 || gameState === 0) {
      for (let ball of balls) {
        if (ball.onPaddle) {
          let dx = ball.x - self.x
          if (self.x - self.velocity >= 0) self.x -= self.velocity
          if (self.x - self.velocity < 0) self.x = 0
          ball.stickOnPaddle(dx)
        } else {
          if (self.x - self.velocity >= 0) self.x -= self.velocity
          else if (self.x - self.velocity < 0) self.x = 0
        }
      }
    }
  }
  this.moveToRight = function () {
    if (gameState === 1 || gameState === 0) {
      for (let ball of  balls) {
        if (ball.onPaddle) {
          let dx = ball.x - self.x
          if ((self.x + self.width + self.velocity) <= maxWidth) self.x += self.velocity
          if ((self.x + self.width + self.velocity) > maxWidth) self.x = maxWidth - self.width
          ball.stickOnPaddle(dx)
        } else {
          if ((self.x + self.width + self.velocity) <= maxWidth) self.x += self.velocity
          else if ((self.x + self.width + self.velocity) > maxWidth) self.x = maxWidth - self.width
        }
      }
    }
  }
  this.moveByMouse = function (e) {
    var pointerX = e.clientX
    if (gameState === 1 || gameState === 0) {
      for (let ball of balls) {
        if (ball.onPaddle) {
          let dx = ball.x - self.x
          if (self.x >= 0 && self.x <= maxWidth - self.width) self.x = pointerX - self.width / 2
          if (self.x < 0) self.x = 0
          if (self.x > maxWidth - self.width) self.x = maxWidth - self.width
          ball.stickOnPaddle(dx)
        } else {
          if (self.x >= 0 && self.x <= maxWidth - self.width) self.x = pointerX - self.width / 2
          if (self.x < 0) self.x = 0
          if (self.x > maxWidth - self.width) self.x = maxWidth - self.width
        }
      }
    }
  }
  this.move = function () {
    if (self.leftArrowKeyPressed) self.moveToLeft()
    if (self.rightArrowKeyPressed) self.moveToRight()
  }
  this.draw = function () {
    ctx.beginPath()
    ctx.fillStyle = paddle.color
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height)
  }
}
let paddle = new Paddle()