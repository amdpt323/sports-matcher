import { Button, ButtonGroup, Heading, Text, VStack } from '@chakra-ui/react'
import { Form, Formik } from 'formik'
import React, { useContext, useState } from 'react'
import TextField from '../TextField'
import { ResetPassContext } from '../../Context/ResetPassContext'
import * as Yup from 'yup'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const CreateNewPassword = () => {
  const navigate = useNavigate()
  const { setPage, user } = useContext(ResetPassContext)
  const [error, setError] = useState(null)
  return (
    <Formik
      initialValues={{ newPassword: '', confirmPassword: '' }}
      validationSchema={Yup.object({
        newPassword: Yup.string()
          .required('Password required!')
          .min(6, 'Password too short!')
          .max(28, 'Password too long!'),
        confirmPassword: Yup.string()
          .required('Password required!')
          .min(6, 'Password too short!')
          .max(28, 'Password too long!'),
      })}
      onSubmit={async (values, actions) => {
        const vals = { ...values }
        var config = {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        }
        if (vals.newPassword !== vals.confirmPassword) {
          setError('Password doesnot Match')
          return
        }
        try {
          axios.post(
            'http://localhost:4000/auth/changePassword',
            { username: user.username, password: vals.newPassword },
            config
          ).then((res) => {
              if (!res || res.status >= 400) {
                return
              }
              return res.data
            }).then((data)=>{
              if(!data)return
              if(data.status){
                setError(data.status)
              }else if(data.loggedIn=== true){
                navigate("/home")
              }
            })
        } catch (error) {
          console.log(error)
          setError('Oops!! server timed out!!')
        }
      }}
    >
      <VStack
        w={{ base: '90%', md: '500px' }}
        h='100vh'
        m='auto'
        justify='center'
        spacing='1rem'
        as={Form}
      >
        <Heading pb='2rem'>Create New Password</Heading>
        <Text color='red.500'>{error}</Text>
        <TextField
          label='New Password'
          name='newPassword'
          placeholder='Enter your new password'
        />
        <TextField
          label='Confirm Password'
          name='confirmPassword'
          placeholder='Confirm your new password'
        />
        <ButtonGroup pt='1rem'>
          <Button
            colorScheme='teal'
            type='submit'
          >
            Reset Password
          </Button>
          {/* <Button onClick={()=>setPage('ForgotPassword')}>Go Back</Button> */}
        </ButtonGroup>
      </VStack>
    </Formik>
  )
}

export default CreateNewPassword
