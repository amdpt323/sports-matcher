const express = require('express')
const router = express.Router()
const Yup = require('yup')
const bcrypt = require('bcrypt')

const { validateLogin, validateSignup } = require('../controllers/validateForm')
const pool = require('../db')
const sendOTP = require('../utils/nodemailer')

router
  .route('/login')
  .get(async (req, res) => {
    if (req.session.user) {
      res.json({ loggedIn: true, username: req.session.user.username })
    } else {
      res.json({ loggedIn: false })
    }
  })
  .post(async (req, res) => {
    validateLogin(req, res)

    const exisitingUserName = await pool.query(
      'SELECT id,username,passhash from users WHERE username=$1',
      [req.body.username]
    )

    if (exisitingUserName.rowCount > 0) {
      const isPasswordCorrect = await bcrypt.compare(
        req.body.password,
        exisitingUserName.rows[0].passhash
      )
      if (isPasswordCorrect) {
        req.session.user = {
          username: req.body.username,
          id: exisitingUserName.rows[0].id,
        }
        // console.log(req.session);
        res.json({ loggedIn: true, username: req.body.username })
      } else {
        res.json({
          loggedIn: false,
          status: 'Either Username or Password is incorrect',
        })
      }
    } else {
      res.json({
        loggedIn: false,
        status: `Either Username or Password is incorrect`,
      })
    }
  })

router.post('/register', async (req, res) => {
  validateSignup(req, res)

  const exisitingUserName = await pool.query(
    'SELECT username from users WHERE username=$1',
    [req.body.username]
  )

  const exisitingUserEmail = await pool.query(
    'SELECT email from users WHERE email=$1',
    [req.body.email]
  )

  if (exisitingUserName.rowCount === 0 && exisitingUserEmail.rowCount === 0) {
    const handlePass = await bcrypt.hash(req.body.password, 10)
    const newUserQuery = await pool.query(
      'INSERT INTO users(username,email,passhash) values($1,$2,$3) RETURNING id,username',
      [req.body.username, req.body.email, handlePass]
    )
    req.session.user = {
      username: req.body.username,
      id: newUserQuery.rows[0].id,
    }
    res.status(200).json({ loggedIn: true, username: req.body.username })
  } else if (exisitingUserEmail.rowCount > 0) {
    res.json({
      loggedIn: false,
      status: `User with the email address ${req.body.email} already exists`,
    })
  } else {
    res.json({ loggedIn: false, status: 'Username taken' })
  }
})

router.post('/forgotPassword', async (req, res) => {
  const email = req.body.email
  const existingUser = await pool.query(
    'SELECT username from users WHERE email=$1',
    [email]
  )
  if (existingUser.rowCount == 0) {
    res.json({ OtpSent: false, status: 'Invalid Email Address' })
  }
  const otp = await sendOTP(email)
  const addOtpQuery = await pool.query(
    'UPDATE users SET otp=$1 WHERE username=$2 RETURNING username',
    [otp, existingUser.rows[0].username]
  )
  res.json({ OtpSent: true, username: addOtpQuery.rows[0].username })
})

router.post('/verifyOtp', async (req, res) => {
  const { otp, email } = req.body
  const existingUser = await pool.query(
    'SELECT username,otp from users WHERE email=$1',
    [email]
  )
  if (existingUser.rowCount > 0) {
    if (existingUser.rows[0].otp === otp) {
      res.json({ isVerified: true, username: existingUser.rows[0].username })
    } else {
      res.json({
        isVerified: false,
        status: 'OTP doesnot match please try again',
      })
    }
  }
  
})

router.post('/changePassword', async (req, res) => {
  const { username, password } = req.body
  const passhash = await bcrypt.hash(password, 10)
  const existingUser = await pool.query(
    'UPDATE users SET passhash=$1 WHERE username=$2 RETURNING id,username',
    [passhash, username]
  )
  req.session.user = {
    username: req.body.username,
    id: existingUser.rows[0].id,
  }
  res.json({ loggedIn: true, username: 'username' })
})

module.exports = router
