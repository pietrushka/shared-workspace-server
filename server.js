const http = require('http')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const socketio = require('socket.io')

const {addUser, getUser} = require('./socketio/users')
const {makeCanvas, saveDrawing, getDrawings} = require('./socketio/actions')

dotenv.config({ path: './config.env' })
const PORT = process.env.PORT || 4000

const app = require("./app")

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
)

mongoose.connect(DB, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true
}).then(() => console.log('DB connection successful'))


const server = http.createServer(app)
const io = socketio(server)

io.on('connection', socket => {

  socket.on('join', ({user, roomId}) => {
    console.log(roomId)
    addUser({socketId: socket.id, user, roomId})
    makeCanvas(roomId)
    socket.join(roomId) 
    getDrawings(roomId).map(drawingData => {
      socket.broadcast.emit('drawing', drawingData)
    })
  })

  socket.on('drawing', (data) => {
    const user = getUser(socket.id)
    saveDrawing(user.roomId, data)
    socket.to(user.roomId).emit('drawing', data)   
  }) 
})
 


server.listen(PORT, () => console.log(`server runnin on port 4000`))
