const Yup = require('yup');

const loginFormSchema = Yup.object({
  username: Yup.string()
    .required('Username Required!')
    .min(6, 'Username too short!')
    .max(28, 'Username too long!'),
  password: Yup.string()
    .required('Password required!')
    .min(6, 'Password too short!')
    .max(28, 'Password too long!'),
})

const signupFormSchema = Yup.object({
  username: Yup.string()
    .required('Username Required!')
    .min(6, 'Username too short!')
    .max(28, 'Username too long!'),
  password: Yup.string()
    .required('Password required!')
    .min(6, 'Password too short!')
    .max(28, 'Password too long!'),
  email: Yup.string().email().required('Email Required!'),
})


const validateLogin = (req,res)=>{
 const formData = req.body;
 loginFormSchema
   .validate(formData)
   .catch((err) => {
     console.log(err.errors)
     res.status(422).send()
   })
   .then((valid) => {
     if (valid) {
       // console.log('form is good');
     }
   })
}

const validateSignup = (req, res) => {
  const formData = req.body
  signupFormSchema
    .validate(formData)
    .catch((err) => {
      console.log(err.errors)
      res.status(422).send()
    })
    .then((valid) => {
      if (valid) {
        // console.log('form is good');
      }
    })
}

module.exports = {validateLogin,validateSignup}