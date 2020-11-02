const http = require('http')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const socketio = require('socket.io')

const handleIO = require('./sockets')

dotenv.config({ path: './config.env' })
const PORT = process.env.PORT || 4000

const app = require('./app')

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
)

mongoose.connect(DB, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true
}).then(() => console.log('DB connection successful'))
mongoose.set('useFindAndModify', false)

const server = http.createServer(app)
const io = socketio(server)
handleIO(io)

server.listen(PORT, () => console.log('server runnin on port 4000'))
