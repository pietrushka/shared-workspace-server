const canvases = {}

const makeCanvas = (roomId) => {
  if (!canvases[roomId]) {
    canvases[roomId] = []
  }
}

const saveDrawing = (roomId, data) => {
  canvases[roomId].push(data)
}

const getDrawings = (roomId) => {
  return canvases[roomId]
}



module.exports = {
  makeCanvas,
  saveDrawing,
  getDrawings,
}