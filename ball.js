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
    this.updateVelocity=function (directionAngle,velocityMagnitude) {
        this.xVelocity = Math.cos(directionAngle) * velocityMagnitude;
        this.yVelocity = -Math.sin(directionAngle) * velocityMagnitude;
    };
    this.stickOnPaddle = function (dx) {
        this.y = paddle.y - this.radius;
        this.x = paddle.x + dx;
    };
    this.hitEdges = function() {
        let distanceToZeroWidth = this.radius - this.xVelocity;
        let distanceToMaxWidth = maxWidth - this.radius - this.xVelocity;
        let distanceToZeroHeight = this.radius - this.yVelocity;
        if (this.x >= distanceToMaxWidth || this.x <= distanceToZeroWidth) {
            this.xVelocity = -this.xVelocity;
        }
        if (this.y < distanceToZeroHeight) {
            this.yVelocity = -this.yVelocity;
        }
    };
    this.hitPaddle = function () {
        if ((this.y > (paddle.y - this.radius - this.yVelocity)) && (this.x >= paddle.x) && (this.x <= paddle.x + paddle.width)) {
            this.yVelocity = -this.yVelocity;
            // this.directionAngle = Math.atan2(this.yVelocity,this.xVelocity);
            // let dist = this.x - (paddle.x + paddle.width/2);
            // this.directionAngle += 2 * Math.PI * dist/paddle.width * (this.xVelocity/Math.abs(this.xVelocity));
            // this.updateVelocity(-this.directionAngle,this.velocityMagnitude);
            // if (this.yVelocity>0) this.yVelocity = -this.yVelocity;
        }
    };
    this.hitConnerOfPaddle = function() {
        let distanceToMaxHeight = maxHeight - this.radius - this.yVelocity;
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
        if (blocks[r][c].status) {
            if (ballOnUpLeftOfBlock && ballGoesDownRight && distanceToUpLeftConnerOfBlock <= this.radius){
                if (r===blocks.length -1){
                    if (c === 0) {
                        this.xVelocity = -this.xVelocity;
                        this.yVelocity = -this.yVelocity;
                        blocks[r][c].status = false;
                    } else if (blocks[r][c-1].status === false) {
                        this.xVelocity = -this.xVelocity;
                        this.yVelocity = -this.yVelocity;
                        blocks[r][c].status = false;
                    }
                } else if (c === 0) {
                    if (blocks[r+1][c].status === false){
                        this.xVelocity = -this.xVelocity;
                        this.yVelocity = -this.yVelocity;
                        blocks[r][c].status = false;
                    }
                }else if (blocks[r+1][c].status === false&&blocks[r][c-1].status === false){
                    this.xVelocity = -this.xVelocity;
                    this.yVelocity = -this.yVelocity;
                    blocks[r][c].status = false;
                }
            } else if (ballOnBottomLeftOfBlock && ballGoesUpRight && distanceToBottomLeftConnerOfBlock <= this.radius) {
                if (r === 0) {
                    if (c === 0) {
                        this.xVelocity = -this.xVelocity;
                        this.yVelocity = -this.yVelocity;
                        blocks[r][c].status = false;
                    } else if (blocks[r][c - 1].status === false) {
                        this.xVelocity = -this.xVelocity;
                        this.yVelocity = -this.yVelocity;
                        blocks[r][c].status = false;
                    }
                } else if (c === 0) {
                    if (blocks[r-1][c].status===false){
                        this.xVelocity = -this.xVelocity;
                        this.yVelocity = -this.yVelocity;
                        blocks[r][c].status = false;
                    }
                }else if (blocks[r-1][c].status===false && blocks[r][c - 1].status === false) {
                    this.xVelocity = -this.xVelocity;
                    this.yVelocity = -this.yVelocity;
                    blocks[r][c].status = false;
                }
            } else if (ballOnUpRightOfBlock && ballGoesDownLeft && distanceToUpRightConnerOfBlock <= this.radius) {
                if (r===blocks.length -1){
                    if (c === numberOfBlockColumn - 1) {
                        this.xVelocity = -this.xVelocity;
                        this.yVelocity = -this.yVelocity;
                        blocks[r][c].status = false;
                    } else if (blocks[r][c+1] === false) {
                        this.xVelocity = -this.xVelocity;
                        this.yVelocity = -this.yVelocity;
                        blocks[r][c].status = false;
                    }
                } else if (c === numberOfBlockColumn - 1) {
                    if (blocks[r+1][c].status === false) {
                        this.xVelocity = -this.xVelocity;
                        this.yVelocity = -this.yVelocity;
                        blocks[r][c].status = false;
                    }
                }else if (blocks[r+1][c].status === false && blocks[r][c+1] === false) {
                    this.xVelocity = -this.xVelocity;
                    this.yVelocity = -this.yVelocity;
                    blocks[r][c].status = false;
                }
            }else if (ballOnBottomRightOfBlock && ballGoesUpLeft && distanceToBottomRightConnerOfBlock <= this.radius) {
                if (r === 0) {
                    if (c === numberOfBlockColumn - 1) {
                        this.xVelocity = -this.xVelocity;
                        this.yVelocity = -this.yVelocity;
                        blocks[r][c].status = false;
                    } else if (blocks[r][c + 1].status === false) {
                        this.xVelocity = -this.xVelocity;
                        this.yVelocity = -this.yVelocity;
                        blocks[r][c].status = false;
                    }
                } else if (c === numberOfBlockColumn - 1) {
                    if (blocks[r-1][c].status === false){
                        this.xVelocity = -this.xVelocity;
                        this.yVelocity = -this.yVelocity;
                        blocks[r][c].status = false;
                    }
                }else if (blocks[r-1][c].status === false && blocks[r][c + 1].status === false) {
                    this.xVelocity = -this.xVelocity;
                    this.yVelocity = -this.yVelocity;
                    blocks[r][c].status = false;
                }
            }
        }
    };

    this.hitEdgesOfBlocks = function() {
        let verticalDistanceFromBottom = blocks[r][c].y + blockHeight + this.radius - this.yVelocity;
        let horizontalDistanceFromRight = blocks[r][c].x + blockWidth + this.radius - this.xVelocity;
        let verticalDistanceFromTop = blocks[r][c].y - this.radius - this.yVelocity;
        let horizontalDistanceFromLeft = blocks[r][c].x - this.radius - this.xVelocity;
        let ballHitBottomOfBlock = (this.y <= verticalDistanceFromBottom && this.y > blocks[r][c].y + blockHeight);
        let ballHitTopOfBlock = (this.y >= verticalDistanceFromTop && this.y < blocks[r][c].y);
        let ballInBlockWidthScope = this.x >= blocks[r][c].x && this.x <= blocks[r][c].x + blockWidth ;
        if ((ballHitBottomOfBlock || ballHitTopOfBlock) && ballInBlockWidthScope && blocks[r][c].status) {
            this.yVelocity = -this.yVelocity;
            blocks[r][c].status = false;
        }
        let ballHitLeftOfBlock = (this.x >= horizontalDistanceFromLeft && this.x < blocks[r][c].x);
        let ballHitRightOfBlock = (this.x <= horizontalDistanceFromRight && this.x > blocks[r][c].x + blockWidth);
        let ballInBlockHeightScope = this.y > blocks[r][c].y && this.y < blocks[r][c].y + blockHeight;
        if ((ballHitLeftOfBlock || ballHitRightOfBlock) && ballInBlockHeightScope && blocks[r][c].status) {
            this.xVelocity = -this.xVelocity;
            blocks[r][c].status = false;
        }
    }
};
function getDirection() {
    let directionAngle;
    if (Math.round(Math.random())>0.5) directionAngle = Math.random()* Math.PI/3 + Math.PI/12;
    else directionAngle = Math.random()* Math.PI/3 + 7*Math.PI/12;
    return directionAngle;
}
let ball = new Ball();