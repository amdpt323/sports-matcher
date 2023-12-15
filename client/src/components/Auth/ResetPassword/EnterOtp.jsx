import {
  Button,
  ButtonGroup,
  HStack,
  Heading,
  PinInput,
  PinInputField,
  Text,
  VStack,
} from '@chakra-ui/react'
import React, { useContext, useState } from 'react'
import { ResetPassContext } from '../../Context/ResetPassContext'
import axios from 'axios'

const EnterOtp = () => {
  const { setPage, user ,setUser} = useContext(ResetPassContext)
  const [otp, setOtp] = useState(null)
  const [error, setError] = useState(null)
  const handleSubmit = async (e) => {
    e.preventDefault()
    var config = {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    }
    try {
      axios
        .post(
          'http://localhost:4000/auth/verifyOtp',
          {
            otp: otp,
            email: user.email,
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
          setUser({...data })
          if (!data) return
          if (data.status) {
            setError(data.status)
          } else if (data.isVerified === true) {
            setPage('ChangePassword')
          }
        })
    } catch (error) {
      console.log(error)
      setError('Oops!! server timed out !')
    }
  }
  return (
    <VStack
      w={{ base: '90%', md: '500px' }}
      m='auto'
      justify='center'
      h='100vh'
      spacing='1rem'
    >
      <Heading size='2xl' pb='1rem'>
        Enter OTP
      </Heading>
      <Text color='red.500'>{error}</Text>
      <HStack>
        <PinInput type='number' onChange={(value) => setOtp(value)}>
          <PinInputField />
          <PinInputField />
          <PinInputField />
          <PinInputField />
          <PinInputField />
          <PinInputField />
        </PinInput>
      </HStack>
      <ButtonGroup pt='1rem'>
        <Button colorScheme='teal' type='submit' onClick={handleSubmit}>
          Submit
        </Button>
        <Button onClick={() => setPage('ForgotPassword')}>Wrong Email?</Button>
      </ButtonGroup>
    </VStack>
  )
}

export default EnterOtp
