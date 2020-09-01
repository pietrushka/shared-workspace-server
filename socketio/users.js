const users = []

const addUser = ({socketId, user, roomId}) => {
  const userData = {
    socketId,
    user, 
    roomId
  }

  users.push(userData)

  console.log('Added user', users)

  return userData
}

const getUser = (socketId) => users.find((user) => user.socketId === socketId)

module.exports = {
  addUser,
  getUser
}