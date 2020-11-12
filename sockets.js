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

      if(rooms[roomId] && rooms[roomId].users.length > 1) {
        socket.emit('room-full')
        return
      }

      username = user.username
      currentRoomId = addUserToRoom(socket.id, user, roomId)

      socket.join(roomId)

      console.log(`${username} joined`)

      if (rooms[roomId].users.length === 2) {
        const partnerID = rooms[roomId].users.find(user => user.socketId !== socket.id)
        socket.emit('partner-in-room-id', partnerID)
      }

      //send drawings and messages to user
      rooms[roomId].whiteboard.map(drawingData => {
        socket.emit('drawing', drawingData)
      })
      rooms[roomId].messages.map(messageObj => {
        socket.emit('message', messageObj)
      })
    })

    socket.on('call-partner', ({partnerID, signal, callerID}) => {
      io.to(partnerID).emit('incomming-call', {signal, callerID});
    })

    socket.on('returning-signal', ({callerID, signal}) => {
      io.to(callerID).emit('receiving-returned-signal', {signal, id: socket.id})
    })


    socket.on('drawing', (data) => {
      if (!!rooms[currentRoomId]) {
        rooms[currentRoomId].whiteboard.push(data)
      }

      socket.to(currentRoomId).emit('drawing', data)
    })
    
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
      socket.to(currentRoomId).emit('user-left', socket.id)
      if (!!rooms[currentRoomId]) removeUser(currentRoomId, socket.id)
    })
  })
}
