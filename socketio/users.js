const users = []

const addUser = ({ socketId, user, roomId }) => {
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

const removeUser = socketId => {
  const userToDelete = users.find(user => user.socketId === socketId)
  const userIndex = users.indexOf(userToDelete)
  users.splice(userIndex, 1)
}

module.exports = {
  addUser,
  getUser,
  removeUser
}
