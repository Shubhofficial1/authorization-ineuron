import jwt from 'jsonwebtoken'

const auth = (req, res, next) => {
  const token =
    req.cookies.token ||
    req.body.token ||
    req.header('Authorization').replace('Bearer ', '')

  if (!token) {
    return res.status(403).send('token is missing')
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY)
    req.user = decoded

    // get all details from db & set user accordingly

    // Move to next code
    next()
  } catch (error) {
    res.status(401).send('Token is invalid')
  }
}

export default auth
