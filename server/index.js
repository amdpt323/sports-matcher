const express = require('express')
const { Server } = require('socket.io')
const helmet = require('helmet')
const cors = require('cors')
const session = require('express-session')
require('dotenv').config()

const authRouter = require('./routes/authRouter')

const app = express()

const server = require('http').createServer(app)

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    credentials: 'true',
  },
})

app.use(helmet())
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
)
app.use(express.json())
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    credentials: true,
    name: 'sid',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.ENVIORNMENT === 'production' ? 'true' : 'auto',
      httpOnly: true,
      sameSite: process.env.ENVIORNMENT === 'production' ? 'none' : 'lax',
      expires : 1000 * 60 * 24 * 7 ,
    },
  })
)

app.use('/auth', authRouter)

app.get('/', (req, res) => {
  res.send('hiii')
})

io.on('connect', (socket) => {})

server.listen(4000, () => {
  console.log('Server listening on port 4000')
})
