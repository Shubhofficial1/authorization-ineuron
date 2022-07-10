import mongoose from 'mongoose'

const connectDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log(`MongoDB connected successfully : ${conn.connection.host}`)
  } catch (error) {
    console.error(`Error : ${error.message}`)
  }
}

export default connectDb
