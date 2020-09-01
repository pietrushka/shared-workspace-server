const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const AppError = require('./utils/appError')
const globalErrorHandler = require('./controllers/errorController')
const authRouter = require('./routes/authRouter')


const app = express()

app.use(cors())

// parse requests of content-type - application/json
app.use(express.json({}))

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true}))

// Routes
app.get('/', (req, res) => {
  res.send('server is up and runin')
})

app.use('/api/auth', authRouter)

// app.all('*', (req, res, next) => {
//   next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404))
// })

app.use(globalErrorHandler)

module.exports = app 