import { Route, Routes } from 'react-router-dom'
import Login from './Auth/Login'
import Signup from './Auth/Signup'
import { Text } from '@chakra-ui/react'
import PrivateRoute from './PrivateRoutes'
import ResetPassword from './Auth/ResetPassword/ResetPassword'

const Views = () => {
  return (
    <Routes>
      <Route path='/' element={<Login />} />
      <Route path='/signup' element={<Signup />} />
      <Route path='/forgotPassword' element={<ResetPassword />} />
      <Route element={<PrivateRoute />}>
        <Route path='/home' element={<Text>Hi welcome home</Text>} />
      </Route>
      <Route path='*' element={<Login />} />
    </Routes>
  )
}

export default Views
