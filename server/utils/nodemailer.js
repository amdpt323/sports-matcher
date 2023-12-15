const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
    user: 'ismael.borer55@ethereal.email',
    pass: 'yjVDs9HJVwaXmSF2WR',
  },
})

const sendOTP = async (email)=>{
 const OTP = Math.floor(Math.random() * 1000000)
 await transporter.sendMail({
   from: '"Sports Matcher" <sportsmatcher@gmail.com>',
   to: email,
   subject: 'OTP ✔',
   text: `Your OTP for Verification is ${OTP}`,
 })
 return OTP
}

module.exports = sendOTP