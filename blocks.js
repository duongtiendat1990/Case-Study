let blockOffset = ball.radius * 4 + 2
let numberOfBlockRows = 5
let numberOfBlockColumn = 20
let blockHeight = (maxHeight - paddle.height - ball.radius * 2 - blockOffset) / 30
let blockWidth = (maxWidth - blockOffset * 2) / numberOfBlockColumn
let Block = function (r, c) {
  this.height = blockHeight
  this.width = blockWidth
  this.x = blockOffset + blockWidth * c
  this.y = blockHeight * (numberOfBlockRows - r - 1) + blockOffset
  this.color = blockColor
  this.status = true

}
let blocks = []
let blockColor = 'darkred'

function createBlocks () {
  for (let r = 0; r < numberOfBlockRows; r++) {
    blocks[r] = []
    for (let c = 0; c < numberOfBlockColumn; c++) {
      blocks[r][c] = new Block(r, c)
    }
  }
}

createBlocks()

