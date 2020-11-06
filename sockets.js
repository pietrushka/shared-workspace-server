const rooms = {}

const addUserToRoom = ( socketId, user, roomId ) => {
  if (!rooms[roomId]){
    // create room
    rooms[roomId] = {
      users: [],
      whiteboard: [],
      messages: []
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
}

module.exports = handleIo = (io) => {
  io.on('connection', socket => {
    let username
    let currentRoomId

    socket.on('join', ({ user, roomId }) => {
      if (!user) return

      username = user.username
      currentRoomId = addUserToRoom(socket.id, user, roomId)

      socket.join(roomId)

      //send drawings and messages to user
      rooms[roomId].whiteboard.map(drawingData => {
        socket.emit('drawing', drawingData)
      })
      rooms[roomId].messages.map(messageObj => {
        socket.emit('message', messageObj)
      })

      const usersInRoom = rooms[roomId].users.filter(({socketId}) => socketId !== socket.id)
      socket.emit('users-in-the-room', usersInRoom)
    })

    socket.on('drawing', (data) => {
      if (!!rooms[currentRoomId]) {
        rooms[currentRoomId].whiteboard.push(data)
      }

      socket.to(currentRoomId).emit('drawing', data)
    })

    socket.on("sending-signal", payload => {
      io.to(payload.userToSignal).emit('user-joined', { signal: payload.signal, callerID: payload.callerID });
    });

    socket.on("returning-signal", payload => {
      io.to(payload.callerID).emit('receiving-returned-signal', { signal: payload.signal, id: socket.id });
    });
    
    socket.on('message', (message) => {

      const messageObj = {
        author: username,
        content: message
      }

      if (!!rooms[currentRoomId]) {
        rooms[currentRoomId].messages.push(messageObj)
      }

      //// sending to all clients in currentRoomId, excluding sender 
      socket.to(currentRoomId).emit('message', messageObj)
    })

    socket.on('disconnect', function () {
      if (!!rooms[currentRoomId]) removeUser(currentRoomId, socket.id)
    })
  })
}
