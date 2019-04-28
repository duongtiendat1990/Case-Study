let blockOffset = balls[0].radius * 4 + 2
let numberOfBlockRows = 5
let numberOfBlockColumn = 20
let blockHeight = (maxHeight - paddle.height - balls[0].radius * 2 - blockOffset) / 30
let blockWidth = (maxWidth - blockOffset * 2) / numberOfBlockColumn
let Block = function (r, c) {
  this.height = blockHeight
  this.width = blockWidth
  this.x = blockOffset + blockWidth * c
  this.y = blockHeight * (numberOfBlockRows - r - 1) + blockOffset
  this.getColor = function () {
    let randomColor = Math.random()
    if (randomColor < 0.01) return 'magenta'
    else if (randomColor >= 0.01 && randomColor < 0.02) return 'gold'
    else return 'firebrick'
  }
  this.color = this.getColor()
  this.status = true

}
let blocks = []

function createBlocks () {
  for (let r = 0; r < numberOfBlockRows; r++) {
    blocks[r] = []
    for (let c = 0; c < numberOfBlockColumn; c++) {
      blocks[r][c] = new Block(r, c)
    }
  }
}

createBlocks()

