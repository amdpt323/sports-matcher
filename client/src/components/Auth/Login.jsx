import { VStack, ButtonGroup, Button, Heading, Text } from '@chakra-ui/react'
import { Form, Formik } from 'formik'
import * as Yup from 'yup'
import TextField from './TextField'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { AuthContext } from '../Context/AuthContext'
import { useContext, useState } from 'react'
import { Link as ChakraLink } from '@chakra-ui/react'
import { Link as ReactRouterLink } from 'react-router-dom'

const Login = () => {
  const navigate = useNavigate()
  const { setUser } = useContext(AuthContext)
  const [error,setError]=useState(null)
  return (
    <Formik
      initialValues={{ username: '', password: '' }}
      validationSchema={Yup.object({
        username: Yup.string()
          .required('Username Required!')
          .min(6, 'Username too short!')
          .max(28, 'Username too long!'),
        password: Yup.string()
          .required('Password required!')
          .min(6, 'Password too short!')
          .max(28, 'Password too long!'),
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
              'http://localhost:4000/auth/login',
              {
                username: vals.username,
                password: vals.password,
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
              setUser({ ...data })
              if (!data) return
              if (data.status) {
                setError(data.status)
              } else if (data.loggedIn === true) {
                navigate('/home')
              }
            })
        } catch (error) {
          console.log(error)
          setError('Oops!! server timed out!!')
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
          name='password'
          placeholder='Enter Password'
          type='password'
          label='Password'
        />
        <ChakraLink as={ReactRouterLink} to='/forgotPassword'>
          Forgot password
        </ChakraLink>
        <ButtonGroup pt='1rem'>
          <Button colorScheme='teal' type='submit'>
            Log In
          </Button>
          <Button onClick={() => navigate('/signup')}>Create Account</Button>
        </ButtonGroup>
      </VStack>
    </Formik>
  )
}

export default Login
