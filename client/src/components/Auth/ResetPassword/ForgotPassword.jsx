import { Button, ButtonGroup, Heading, Text, VStack } from '@chakra-ui/react'
import React, { useContext ,useState} from 'react'
import TextField from '../TextField'
import { Form, Formik } from 'formik'
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup'
import { ResetPassContext } from '../../Context/ResetPassContext'
import axios from 'axios'

const ForgotPassword = () => {
  const navigate = useNavigate()
  const {setPage,setUser} = useContext(ResetPassContext)
  const [error,setError] = useState(null)
  return (
    <Formik
      initialValues={{email:''}}
      validationSchema={Yup.object({
        email:Yup.string().email().required('Email Required!')
      })}
      onSubmit={async(values,actions)=>{
        const vals = {...values}
        var config = {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        }
        try {
          await axios
            .post(
              'http://localhost:4000/auth/forgotPassword',
              {
                email: vals.email,
              },
              config
            )
            .then((res) => {
              if (!res || res.status >= 400) {
                return
              }
              return res.data
            }).then((data)=>{
              setUser({email:vals.email,...data})
              if(!data)return
              if(data.status){
                setError(data.status)
              }else if(data.OtpSent=== true){
                setPage('EnterOtp')
              }
            })
        } catch (error) {
          console.log(error)
          setError('Oops!! server timed out!!')
        }
        setPage('EnterOtp')
      }}
    >
      <VStack
        w={{ base: '90%', md: '500px' }}
        m='auto'
        justify='center'
        h='100vh'
        spacing='1rem'
        as={Form}
      >
        <Heading>Forgot Password?</Heading>
        <Text color='red.500'>{error}</Text>
        <TextField
          name='email'
          label='Email'
          placeholder='Enter Email Address'
        />
        <ButtonGroup pt='1rem'>
          <Button colorScheme='teal' type='submit'>Get OTP</Button>
          <Button onClick={() => navigate('/')}>Back</Button>
        </ButtonGroup>
      </VStack>
    </Formik>
  )
}

export default ForgotPassword
