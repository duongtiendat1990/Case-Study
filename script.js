
function Game () {
  let self = this
  this.state = 0 // 0: means idle 1: means running 2: means paused 3: means over
  this.startBall = function () {
    ball.updateVelocity(ball.directionAngle, ball.velocityMagnitude)
    ball.onPaddle = false
    setLevelUp = new IntervalTimer(self.levelUp, 60000)
  }
  this.restart = function () {
    document.location.reload()
  }
  this.pause = function () {
    run.pause()
    setLevelUp.pause()
  }
  this.resume = function () {
    run.resume()
    setLevelUp.resume()
  }
  this.over = function () {
    run.stop()
    setLevelUp.stop()
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
        }
      }
    }
    self.checkOver()
    ball.x += ball.xVelocity
    ball.y += ball.yVelocity
    self.keyDownHandler()
    self.keyUpHandler()
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
  this.keyDownHandler = function () {
    window.addEventListener('keydown', self.moveSelectionKeyDown)
  }
  this.moveSelectionKeyDown = function (event) {
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
    }
  }
  this.keyUpHandler = function () {
    window.addEventListener('keyup', self.moveSelectionKeyUp)
  }
  this.moveSelectionKeyUp = function (event) {
    switch (event.code) {
      case 'ArrowLeft':
        paddle.leftArrowKeyPressed = false
      break;
      case 'ArrowRight':
        paddle.rightArrowKeyPressed = false
      break;
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
}

let game = new Game();
let run = new IntervalTimer(game.start, 1);
let setLevelUp;