import express from 'express'
import dotenv from 'dotenv'
import User from './models/UserModel.js'
import connectDb from './config/connectDb.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import auth from './middleware/auth.js'
import cookieParser from 'cookie-parser'
// App initilization with express framework
const app = express()

// json middleware
app.use(express.json())
app.use(cookieParser())
// dotenv configuration
dotenv.config()

// connect to MongoDB
connectDb()

app.get('/', (req, res) => {
  res.status(200).send('Api is working..')
})

app.post('/register', async (req, res) => {
  const { firstname, lastname, email, password } = req.body

  // check if all details are provided
  if (!firstname || !lastname || !email || !password) {
    return res.status(400).send('All fields are mandatory')
  }

  // check if the user already exist in db or not
  const existingUser = await User.findOne({ email })

  // if already exisiting user, throw error
  if (existingUser) {
    return res.status(400).send('User already exists')
  }

  // encrypt the password using bcryptjs
  const myEncPassword = await bcrypt.hash(password, 10)

  const createdUser = await User.create({
    firstname,
    lastname,
    email,
    password: myEncPassword,
  })

  // token
  const token = jwt.sign({ id: createdUser._id }, process.env.SECRET_KEY, {
    expiresIn: '2h',
  })

  createdUser.token = token
  // update token in db or not ?

  // TODO: handle password situation
  createdUser.password = undefined

  res.status(200).json(createdUser)
})

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).send('Email/Password is required')
    }

    const loggedUser = await User.findOne({ email })

    if (!loggedUser) {
      return res.status(400).send('Profile Not Found')
    }

    if (loggedUser && (await bcrypt.compare(password, loggedUser.password))) {
      const token = jwt.sign({ id: loggedUser._id }, process.env.SECRET_KEY, {
        expiresIn: '2h',
      })

      loggedUser.token = token
      loggedUser.password = undefined

      // res.status(200).json(loggedUser)

      const options = {
        expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      }

      res.status(200).cookie('token', token, options).json({
        success: true,
        token,
        loggedUser,
      })
    }

    return res.status(400).send('Email / Password is incorrect')
  } catch (error) {
    console.error(error)
  }
})

app.get('/dashboard', auth, (req, res) => {
  res.send('Welcome to secret information')
})

// Port initialization

const PORT = process.env.PORT || 5000

// app listener
app.listen(PORT, () => {
  console.log(
    `Server is running on PORT ${process.env.PORT} in ${process.env.MODE} mode`
  )
})
