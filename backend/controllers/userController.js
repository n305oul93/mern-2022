const jwt = require('jsonwebtoken')
const bcrpyt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')

/* @desc    Register new user
   @route   Get /api/users
   @access  Public 
 */
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    res.status(400)
    throw new Error('Please add all fields')
  }

  // check if user exists
  const userExists = await User.findOne({ email })
  if (userExists) {
    res.status(400)
    throw new Error('User already exists')
  }

  // Hash password
  const salt = await bcrpyt.genSalt(10)
  const hashedPassword = await bcrpyt.hash(password, salt)

  // Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword
  })

  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id)
    })
  } else {
    res.status(400)
    throw new Error('Invalid user data')
  }
})

/* @desc    Authenticate a user
   @route   POST /api/users/login
   @access  Public 
 */
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  // check for user
  const user = await User.findOne({ email })

  if (user && (await bcrpyt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id)
    })
  } else {
    res.status(400)
    throw new Error('Invalid credentials')
  }
})

/* @desc    Get user data
   @route   Get /api/users/me
   @access  Public 
 */
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json(req.user)
})

// Generate JWT
// take in user id, will use in JWT payload
const generateToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  })
}

module.exports = { registerUser, loginUser, getMe }
