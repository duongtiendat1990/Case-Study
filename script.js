function Game () {
  let self = this
  this.score = 0
  this.magnetCollected = 0
  this.showMessage = function (content) {
    message.innerHTML = content
    message.style.visibility = 'visible'
  }
  this.accelerateBall = function () {
    for (let ball of balls) {
      ball.xVelocity *= 1.01
      ball.yVelocity *= 1.01
      ball.velocityMagnitude*=1.01
    }
  }
  this.startBall = function (ball) {
    ball.updateVelocity(ball.directionAngle, ball.velocityMagnitude)
    ball.onPaddle = false
    setLevelUp = new IntervalTimer(self.levelUp, 60000)
    accelerate = new IntervalTimer(self.accelerateBall, 1000)
  }
  this.restart = function () {
    document.location.reload()
  }
  this.pause = function () {
    run.pause()
    setLevelUp.pause()
    accelerate.pause()
  }
  this.resume = function () {
    run.resume()
    setLevelUp.resume()
    accelerate.resume()
  }
  this.over = function () {
    self.showMessage('Game Over!')
    run.stop()
    setLevelUp.stop()
    accelerate.stop()
  }
  this.removeBall = function () {
    for (let ball of balls) {
      let distanceToMaxHeight = maxHeight - ball.radius
      if (ball.y >= distanceToMaxHeight) {
        let index = balls.indexOf(ball)
        balls.splice(index, 1)
      }
    }
  }
  this.checkOver = function () {
    if (balls.length === 0) {
      self.over()
      gameState = 3
    } else {
      for (let r = 0; r < blocks.length; r++) {
        for (let c = 0; c < blocks[r].length; c++) {
          if (blocks[r][c].status && ((blocks[r][c].y + blockHeight) >= (paddle.y - balls[0].radius * 2))) {
            self.over()
            gameState = 3
          }
        }
      }
    }
  }
  this.checkWin = function () {
    if (self.score === blocks.length * blocks[blocks.length - 1].length) {
      self.showMessage('You Win')
      run.stop()
      setLevelUp.stop()
      accelerate.stop()
    }
  }

  this.drawGuideline = function (stats) {
    stats.clearRect(0, 0, statsCanvas.width, statsCanvas.height)
    stats.beginPath()
    stats.font = '20px Arial'
    stats.strokeText('Score: ' + self.score, 0, 25)
    stats.fillStyle = 'gold'
    stats.fillRect(120, 8, blockWidth, blockHeight)
    stats.strokeText('Add ball', 125 + blockWidth, 25)
    stats.fillStyle = 'magenta'
    stats.fillRect(220 + blockWidth, 8, blockWidth, blockHeight)
    stats.strokeText('Magnet-Press\'Ctrl\' to use', 225 + blockWidth * 2, 25)
    stats.strokeText('Press \'Space\' to start\/pause\/resume', 525 + blockWidth * 2, 25)
    stats.strokeText('Magnets Collected: ' + self.magnetCollected, statsCanvas.width - 200, 25)
    stats.closePath()
  }

  this.start = function () {
    ctx.clearRect(0, 0, maxWidth, maxHeight)
    for (let ball of balls) {
      paddle.draw()
      ball.hitEdges(ball)
      ball.hitPaddle(ball)
      ball.hitConnerOfPaddle(ball)
      for (let r = 0; r < blocks.length; r++) {
        for (let c = 0; c < blocks[r].length; c++) {
          if (blocks[r][c].status === true) {
            ball.hitEdgesOfBlocks(ball, r, c)
            ball.hitConnerOfBlocks(ball, r, c)
            if (blocks[r][c].status === false) {
              self.score++
              if (blocks[r][c].color === 'magenta') self.magnetCollected++
              if (blocks[r][c].color === 'gold') self.addBall(ball)
            }
          }
        }
      }
      self.updateBall(ball)
      ball.draw(ball)
      self.docReady()
      paddle.move(ball)
      drawBlocks()
    }
    self.removeBall()
    self.checkWin()
    self.checkOver()
    self.drawGuideline(stats)

    function drawBlocks () {
      for (let r = 0; r < blocks.length; r++) {
        for (let c = 0; c < blocks[r].length; c++) {
          if (blocks[r][c].status) {
            ctx.beginPath()
            ctx.fillStyle = blocks[r][c].color
            ctx.fillRect(blocks[r][c].x + 1, blocks[r][c].y + 1, blocks[r][c].width - 1, blocks[r][c].height - 1)
            ctx.closePath()
          }
        }
      }
    }
  }
  this.docReady = function () {
    window.addEventListener('keydown', self.keyDownHandler)
    window.addEventListener('keyup', self.keyUpHandler)
    window.addEventListener('dblclick', self.doubleClickHandler)
    window.addEventListener('mousemove', paddle.moveByMouse, false)
  }
  this.keyDownHandler = function (event) {
    switch (event.code) {
      case 'Space':
        switch (gameState) {
          case 0:
            self.startBall(balls[0])
            gameState = 1
            break
          case 1:
            self.pause()
            gameState = 2
            break
          case 2:
            self.resume()
            gameState = 1
            break
          case 3:
            self.restart()
            break
        }
        break
      case 'ArrowLeft':
        paddle.leftArrowKeyPressed = true
        break
      case 'ArrowRight':
        paddle.rightArrowKeyPressed = true
        break
      case 'ControlLeft':
      case 'ControlRight':
        self.holdBall()
        break
    }
  }
  this.keyUpHandler = function (event) {
    switch (event.code) {
      case 'ArrowLeft':
        paddle.leftArrowKeyPressed = false
        break
      case 'ArrowRight':
        paddle.rightArrowKeyPressed = false
        break
      case 'ControlLeft':
      case 'ControlRight':
        for (let ball of balls) ball.onPaddle = false
        self.magnetCollected--
        break
    }
  }
  this.doubleClickHandler = function () {
    switch (gameState) {
      case 0:
        self.startBall(balls[0])
        gameState = 1
        break
      case 1:
        self.pause()
        gameState = 2
        break
      case 2:
        self.resume()
        gameState = 1
        break
      case 3:
        self.restart()
        break
    }
  }
  this.levelUp = function () {
    numberOfBlockRows++
    blocks[blocks.length] = []
    for (let r = 0; r < blocks.length; r++) {
      for (let c = 0; c < blocks[r].length; c++) {
        blocks[r][c].y += blockHeight
      }
    }
    for (let c = 0; c < blocks[numberOfBlockRows - 2].length; c++) {
      blocks[numberOfBlockRows - 1][c] = new Block(numberOfBlockRows - 1, c)
    }
  }
  this.addBall = function (ball) {
    ball.directionAngle = Math.acos(ball.xVelocity / ball.velocityMagnitude)
    let newBallX = ball.x + Math.cos(ball.directionAngle) * ball.radius * 2
    let newBallY = ball.y - Math.sin(ball.directionAngle) * ball.radius * 2
    balls[balls.length] = new Ball(false, ball.xVelocity, ball.yVelocity, newBallX, newBallY)
  }
  this.holdBall = function () {
    for (let ball of balls) {
      if (self.magnetCollected > 0 && (ball.y > (paddle.y - 5 * ball.radius - ball.yVelocity)) && (ball.x >= paddle.x) && (ball.x <= paddle.x + paddle.width)) {
        ball.y = paddle.y - ball.radius
        ball.onPaddle = true
      }
    }
  }
  this.updateBall = function (ball) {
    if (!ball.onPaddle) {
      ball.x += ball.xVelocity
      ball.y += ball.yVelocity
    }
  }
}

let game = new Game()
let run = new IntervalTimer(game.start, 1)
let setLevelUp