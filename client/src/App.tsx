import React from 'react'
import Views from './components/Views'
import { AuthProvider } from './components/Context/AuthContext'
import { ResetPassProvider } from './components/Context/ResetPassContext'

function App() {
  return (
    <AuthProvider>
      <ResetPassProvider>
        {/* theme toggler */}
        <Views />
      </ResetPassProvider>
    </AuthProvider>
  )
}

export default App
