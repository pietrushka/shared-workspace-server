const rooms = {}

const addUserToRoom = ( socketId, user, roomId ) => {
  if (!rooms[roomId]){
    // create room
    rooms[roomId] = {
      users: [],
      whiteboard: []
    }
  }

  //Add user
  const userData = {
    socketId,
    user,
  }
  rooms[roomId].users.push(userData)
  return roomId
}

const removeUser = (roomId, socketId) => {
  newUsers = rooms[roomId].users.filter(e => e.socketId !== socketId)
  rooms[roomId].users = newUsers
  console.log(newUsers)
}

module.exports = handleIo = (io) => {
  io.on('connection', socket => {
    let currentRoomId

    socket.on('join', ({ user, roomId }) => {
      currentRoomId = addUserToRoom(socket.id, user, roomId)
      socket.join(roomId)

      //send drawings to user
      rooms[roomId].whiteboard.map(drawingData => {
        socket.emit('drawing', drawingData)
      })
      console.log('user joined to room', roomId)
    })

    socket.on('drawing', (data) => {
      //save drawing
      rooms[currentRoomId].whiteboard.push(data)

      socket.to(currentRoomId).emit('drawing', data)
    })

    socket.on('disconnect', function () {
      console.log(socket.id)
      removeUser(currentRoomId, socket.id)
    })
  })
}
