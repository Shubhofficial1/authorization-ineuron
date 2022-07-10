import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    deafult: null,
  },
  lastname: {
    type: String,
    default: null,
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Email is required'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  token: {
    type: String,
  },
})

const User = mongoose.model('user', userSchema)

export default User
