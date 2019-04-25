let Ball = function () {
  let self = this;
  this.radius = 10;
  this.x = maxWidth / 2;
  this.y = paddle.y - this.radius;
  this.color = 'gray';
  this.xVelocity = 0;
  this.yVelocity = 0;
  this.onPaddle = true;
  this.velocityMagnitude = 3;
  this.getDirection = function () {
    let directionAngle;
    if (Math.round(Math.random()) > 0.5) directionAngle = Math.random() * Math.PI / 3 + Math.PI / 12;
    else directionAngle = Math.random() * Math.PI / 3 + 7 * Math.PI / 12;
    return directionAngle;
  }
  this.directionAngle = this.getDirection();
  this.updateVelocity = function (directionAngle, velocityMagnitude) {
    self.xVelocity = Math.cos(directionAngle) * velocityMagnitude
    self.yVelocity = -Math.sin(directionAngle) * velocityMagnitude
  }
  this.stickOnPaddle = function (dx) {
    self.y = paddle.y - self.radius
    self.x = paddle.x + dx
  }
  this.hitEdges = function () {
    let distanceToZeroWidth = self.radius - self.xVelocity
    let distanceToMaxWidth = maxWidth - self.radius - self.xVelocity
    let distanceToZeroHeight = self.radius - self.yVelocity
    if (self.x >= distanceToMaxWidth || self.x <= distanceToZeroWidth) {
      self.xVelocity = -self.xVelocity
    }
    if (this.y < distanceToZeroHeight) {
      self.yVelocity = -self.yVelocity
    }
  }
  this.hitPaddle = function () {
    if ((self.y > (paddle.y - self.radius - self.yVelocity)) && (self.x >= paddle.x) && (self.x <= paddle.x + paddle.width)) {
      let dist = self.x - (paddle.x + paddle.width/2);
      self.xVelocity = self.xVelocity* 2 * dist/paddle.width * (self.xVelocity===0?0:self.xVelocity<0?-1:1) + (1-Math.abs(self.xVelocity/self.velocityMagnitude))*Math.sqrt(self.velocityMagnitude* self.velocityMagnitude)*dist/paddle.width;
      self.yVelocity = - Math.sqrt(self.velocityMagnitude*self.velocityMagnitude-self.xVelocity*self.xVelocity)
    }
  }
  this.hitConnerOfPaddle = function () {
    let distanceToMaxHeight = maxHeight - self.radius - self.yVelocity
    let distanceToUpLeftConnerOfPaddle = Math.sqrt((paddle.x - self.x) * (paddle.x - self.x) +
      (paddle.y - self.y) * (paddle.y - self.y))
    let distanceToUpRightConnerOfPaddle = Math.sqrt((self.x - (paddle.x + paddle.width)) * (self.x - (paddle.x + paddle.width)) +
      (paddle.y - self.y) * (paddle.y - self.y))
    if ((self.y < distanceToMaxHeight) && ((distanceToUpLeftConnerOfPaddle <= self.radius && self.x < paddle.x) ||
      (distanceToUpRightConnerOfPaddle <= self.radius && self.x > paddle.x + paddle.width))) {
      self.xVelocity = -self.xVelocity
      self.yVelocity = -self.yVelocity
    }
  }
  this.hitConnerOfBlocks = function (r,c) {
    let distanceToUpLeftConnerOfBlock = Math.sqrt((blocks[r][c].x - self.x) * (blocks[r][c].x - self.x) +
      (blocks[r][c].y - self.y) * (blocks[r][c].y - self.y))
    let distanceToUpRightConnerOfBlock = Math.sqrt((self.x - (blocks[r][c].x + blocks[r][c].width)) *
      (self.x - (blocks[r][c].x + blocks[r][c].width)) + (blocks[r][c].y - self.y) * (blocks[r][c].y - self.y))
    let distanceToBottomLeftConnerOfBlock = Math.sqrt((blocks[r][c].x - self.x) * (blocks[r][c].x - self.x) +
      (blocks[r][c].y + blockHeight - self.y) * (blocks[r][c].y + blockHeight - self.y))
    let distanceToBottomRightConnerOfBlock = Math.sqrt((self.x - (blocks[r][c].x + blocks[r][c].width)) *
      (self.x - (blocks[r][c].x + blocks[r][c].width)) + (blocks[r][c].y + blockHeight - self.y) * (blocks[r][c].y + blockHeight - self.y))
    let ballGoesDownRight = self.xVelocity > 0 && self.yVelocity > 0
    let ballGoesUpRight = self.xVelocity > 0 && self.yVelocity < 0
    let ballGoesDownLeft = self.xVelocity < 0 && self.yVelocity > 0
    let ballGoesUpLeft = self.xVelocity < 0 && self.yVelocity < 0
    let ballOnUpLeftOfBlock = self.x < blocks[r][c].x && self.y < blocks[r][c].y
    let ballOnBottomLeftOfBlock = self.x < blocks[r][c].x && self.y > blocks[r][c].y + blockHeight
    let ballOnUpRightOfBlock = self.x > blocks[r][c].x + blockWidth && self.y < blocks[r][c].y
    let ballOnBottomRightOfBlock = self.x > blocks[r][c].x + blockWidth && self.y > blocks[r][c].y + blockHeight
    if (ballOnUpLeftOfBlock && ballGoesDownRight && distanceToUpLeftConnerOfBlock <= self.radius) {
      if (r === blocks.length - 1) {
        if (c === 0) {
          self.xVelocity = -self.xVelocity
          self.yVelocity = -self.yVelocity
          blocks[r][c].status = false
        } else if (blocks[r][c - 1].status === false) {
          self.xVelocity = -self.xVelocity
          self.yVelocity = -self.yVelocity
          blocks[r][c].status = false
        }
      } else if (c === 0) {
        if (blocks[r + 1][c].status === false) {
          self.xVelocity = -self.xVelocity
          self.yVelocity = -self.yVelocity
          blocks[r][c].status = false
        }
      } else if (blocks[r + 1][c].status === false && blocks[r][c - 1].status === false) {
        self.xVelocity = -self.xVelocity
        self.yVelocity = -self.yVelocity
        blocks[r][c].status = false
      }
    } else if (ballOnBottomLeftOfBlock && ballGoesUpRight && distanceToBottomLeftConnerOfBlock <= self.radius) {
      if (r === 0) {
        if (c === 0) {
          self.xVelocity = -self.xVelocity
          self.yVelocity = -self.yVelocity
          blocks[r][c].status = false
        } else if (blocks[r][c - 1].status === false) {
          self.xVelocity = -self.xVelocity
          self.yVelocity = -self.yVelocity
          blocks[r][c].status = false
        }
      } else if (c === 0) {
        if (blocks[r - 1][c].status === false) {
          self.xVelocity = -self.xVelocity
          self.yVelocity = -self.yVelocity
          blocks[r][c].status = false
        }
      } else if (blocks[r - 1][c].status === false && blocks[r][c - 1].status === false) {
        self.xVelocity = -self.xVelocity
        self.yVelocity = -self.yVelocity
        blocks[r][c].status = false
      }
    } else if (ballOnUpRightOfBlock && ballGoesDownLeft && distanceToUpRightConnerOfBlock <= self.radius) {
      if (r === blocks.length - 1) {
        if (c === numberOfBlockColumn - 1) {
          self.xVelocity = -self.xVelocity
          self.yVelocity = -self.yVelocity
          blocks[r][c].status = false
        } else if (blocks[r][c + 1] === false) {
          self.xVelocity = -self.xVelocity
          self.yVelocity = -self.yVelocity
          blocks[r][c].status = false
        }
      } else if (c === numberOfBlockColumn - 1) {
        if (blocks[r + 1][c].status === false) {
          self.xVelocity = -self.xVelocity
          self.yVelocity = -self.yVelocity
          blocks[r][c].status = false
        }
      } else if (blocks[r + 1][c].status === false && blocks[r][c + 1] === false) {
        self.xVelocity = -self.xVelocity
        self.yVelocity = -self.yVelocity
        blocks[r][c].status = false
      }
    } else if (ballOnBottomRightOfBlock && ballGoesUpLeft && distanceToBottomRightConnerOfBlock <= self.radius) {
      if (r === 0) {
        if (c === numberOfBlockColumn - 1) {
          self.xVelocity = -self.xVelocity
          self.yVelocity = -self.yVelocity
          blocks[r][c].status = false
        } else if (blocks[r][c + 1].status === false) {
          self.xVelocity = -self.xVelocity
          self.yVelocity = -self.yVelocity
          blocks[r][c].status = false
        }
      } else if (c === numberOfBlockColumn - 1) {
        if (blocks[r - 1][c].status === false) {
          self.xVelocity = -self.xVelocity
          self.yVelocity = -self.yVelocity
          blocks[r][c].status = false
        }
      } else if (blocks[r - 1][c].status === false && blocks[r][c + 1].status === false) {
        self.xVelocity = -self.xVelocity
        self.yVelocity = -self.yVelocity
        blocks[r][c].status = false
      }
    }
  }

  this.hitEdgesOfBlocks = function (r,c) {
    let verticalDistanceFromBottom = blocks[r][c].y + blockHeight + self.radius - self.yVelocity
    let horizontalDistanceFromRight = blocks[r][c].x + blockWidth + self.radius - self.xVelocity
    let verticalDistanceFromTop = blocks[r][c].y - self.radius - self.yVelocity
    let horizontalDistanceFromLeft = blocks[r][c].x - self.radius - self.xVelocity
    let ballHitBottomOfBlock = (self.y <= verticalDistanceFromBottom && self.y > blocks[r][c].y + blockHeight)
    let ballHitTopOfBlock = (self.y >= verticalDistanceFromTop && self.y < blocks[r][c].y)
    let ballInBlockWidthScope = self.x >= blocks[r][c].x && self.x <= blocks[r][c].x + blockWidth
    if ((ballHitBottomOfBlock || ballHitTopOfBlock) && ballInBlockWidthScope) {
      self.yVelocity = -self.yVelocity
      blocks[r][c].status = false
    }
    let ballHitLeftOfBlock = (self.x >= horizontalDistanceFromLeft && self.x < blocks[r][c].x)
    let ballHitRightOfBlock = (self.x <= horizontalDistanceFromRight && self.x > blocks[r][c].x + blockWidth)
    let ballInBlockHeightScope = self.y > blocks[r][c].y && self.y < blocks[r][c].y + blockHeight
    if ((ballHitLeftOfBlock || ballHitRightOfBlock) && ballInBlockHeightScope) {
      self.xVelocity = -self.xVelocity
      blocks[r][c].status = false
    }
  }
}

let ball = new Ball()