import { ButtonGroup, VStack, Button, Heading, Text } from '@chakra-ui/react'
import { Form, Formik } from 'formik'
import TextField from './TextField'
import * as Yup from 'yup'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useContext, useState } from 'react'
import { AuthContext } from '../Context/AuthContext'

const Signup = () => {
  const navigate = useNavigate()
  const { setUser } = useContext(AuthContext)
  const [error,setError] = useState(null)
  return (
    <Formik
      initialValues={{ username: '', password: '', email: '' }}
      validationSchema={Yup.object({
        username: Yup.string()
          .required('Username Required!')
          .min(6, 'Username too short!')
          .max(28, 'Username too long!'),
        password: Yup.string()
          .required('Password required!')
          .min(6, 'Password too short!')
          .max(28, 'Password too long!'),
        email: Yup.string().email().required('Email Required!'),
      })}
      onSubmit={async (values, actions) => {
        const vals = { ...values }
        // alert(JSON.stringify(values, null, 2))
        actions.resetForm()
        var config = {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        }
        try {
          await axios
            .post(
              'http://localhost:4000/auth/register',
              {
                username: vals.username,
                password: vals.password,
                email: vals.email,
              },
              config
            )
            .then((res) => {
              if (!res || res.status >= 400) {
                return
              }
              return res.data
            })
            .then((data) => {
              if (!data) return
              setUser({ ...data })
              if (data.status) {
                setError(data.status)
              } else if (data.loggedIn === true) {
                navigate('/home')
              }
            })
        } catch (error) {
          console.log(error)
          setError("Oops!! server timed out!!")
        }
      }}
    >
      <VStack
        as={Form}
        w={{ base: '90%', md: '500px' }}
        m='auto'
        justify='center'
        h='100vh'
        spacing='1rem'
      >
        <Heading>Log In</Heading>
        <Text color='red.500'>{error}</Text>
        <TextField
          name='username'
          placeholder='Enter Username'
          label='Username'
        />
        <TextField
          name='email'
          placeholder='Enter Email Address'
          label='Email'
        />
        <TextField
          name='password'
          placeholder='Enter Password'
          type='password'
          label='Password'
        />
        <ButtonGroup pt='1rem'>
          <Button colorScheme='teal' type='submit'>
            Register
          </Button>
          <Button onClick={() => navigate('/')}>Go Back</Button>
        </ButtonGroup>
      </VStack>
    </Formik>
  )
}

export default Signup
