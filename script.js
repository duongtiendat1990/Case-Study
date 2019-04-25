
function Game () {
  let self = this
  this.state = 0 // 0: means idle 1: means running 2: means paused 3: means over
  this.score = 0
  this.magnetCollected = 0
  this.startBall = function () {
    ball.updateVelocity(ball.directionAngle, ball.velocityMagnitude)
    ball.onPaddle = false
    setLevelUp = new IntervalTimer(self.levelUp, 45000)
    accelerateBall = new IntervalTimer(ball.accelerate(),10)
  }
  this.restart = function () {
    document.location.reload()
  }
  this.pause = function () {
    run.pause()
    setLevelUp.pause()
    accelerateBall.pause()
  }
  this.resume = function () {
    run.resume()
    setLevelUp.resume()
    accelerateBall.resume()
  }
  this.over = function () {
    run.stop()
    setLevelUp.stop()
    accelerateBall.stop()
  }
  this.checkOver = function () {
    let distanceToMaxHeight = maxHeight - ball.radius - ball.yVelocity
    if (ball.y >= distanceToMaxHeight) {
      self.over()
      self.state = 3
    }
    for (let r = 0; r < blocks.length; r++) {
      for (let c = 0; c < blocks[r].length; c++) {
        if (blocks[r][c].status && ((blocks[r][c].y + blockHeight) >= (paddle.y - ball.radius * 2))) {
          self.over()
          self.state = 3
        }
      }
    }
  }
  this.start = function () {
    let ctx = canvas.getContext('2d')
    let stats = statsCanvas.getContext('2d')
    ctx.clearRect(0, 0, maxWidth, maxHeight)
    ctx.beginPath()
    drawPaddle()
    drawBall()
    drawBlocks()
    ctx.stroke()
    ctx.closePath()
    paddle.move();
    ball.hitEdges()
    ball.hitPaddle()
    ball.hitConnerOfPaddle()
    for (let r = 0; r < blocks.length; r++) {
      for (let c = 0; c < blocks[r].length; c++) {
        if (blocks[r][c].status === true){
          ball.hitEdgesOfBlocks(r,c)
          ball.hitConnerOfBlocks(r,c)
          if (blocks[r][c].status === false) {
            self.score++
            if (blocks[r][c].color === 'magenta') self.magnetCollected ++
          }
        }
      }
    }
    stats.clearRect(0,0,statsCanvas.width,statsCanvas.height)
    stats.beginPath()
    stats.font = "20px Arial"
    stats.strokeText('Score: ' + self.score,0,25)
    stats.strokeText('Magnet Collected: ' + self.magnetCollected,statsCanvas.width -200,25)
    stats.closePath()
    self.checkOver()
    if (!ball.onPaddle) {
      ball.x += ball.xVelocity
      ball.y += ball.yVelocity
    }
    self.docReady()
    function drawPaddle () {
      ctx.fillStyle = paddle.color
      ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height)
    }

    function drawBall () {
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2)
      ctx.fillStyle = ball.color
      ctx.fill()
    }

    function drawBlocks () {
      for (let r = 0; r < blocks.length; r++) {
        for (let c = 0; c < blocks[r].length; c++) {
          if (blocks[r][c].status) {
            ctx.fillStyle = blocks[r][c].color
            ctx.fillRect(blocks[r][c].x + 1, blocks[r][c].y + 1, blocks[r][c].width - 1, blocks[r][c].height - 1)
          }
        }
      }
    }
  }
  this.docReady = function () {
    window.addEventListener('keydown', self.keyDownHandler)
    window.addEventListener('keyup', self.keyUpHandler)
    window.addEventListener('dblclick',self.doubleClickHandler)
    window.addEventListener('mousemove',paddle.moveByMouse,false)
  }
  this.keyDownHandler = function (event) {
    switch (event.code) {
      case 'Space':
        switch (self.state) {
          case 0:
            self.startBall()
            self.state = 1
          break
          case 1:
            self.pause()
            self.state = 2
          break
          case 2:
            self.resume()
            self.state = 1
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
        ball.onPaddle = false
        self.magnetCollected--
      break
    }
  }
  this.doubleClickHandler = function () {
    switch (self.state) {
      case 0:
        self.startBall()
        self.state = 1
      break
      case 1:
        self.pause()
        self.state = 2
      break
      case 2:
        self.resume()
        self.state = 1
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
  this.holdBall = function () {
    if (self.magnetCollected>0 && (ball.y > (paddle.y - 5*ball.radius - ball.yVelocity)) && (ball.x >= paddle.x) && (ball.x <= paddle.x + paddle.width)) {
      ball.y = paddle.y -ball.radius
      ball.onPaddle = true
    }
  }
}
let game = new Game();
let run = new IntervalTimer(game.start, 1);
let setLevelUp;