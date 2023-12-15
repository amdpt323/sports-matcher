import axios from 'axios'
import { createContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()
  useEffect(() => {
    getUser()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getUser = async()=>{
    try {
      await axios
        .get('http://localhost:4000/auth/login', {
          withCredentials: true,
        })
        .then((res) => {
          if (!res || res.status >= 400) {
            setUser({ loggedIn: false })
            return
          }
          return res.data
        })
        .then((data) => {
          if (!data) {
            setUser({ loggedIn: false })
            return
          }
          setUser({ ...data })
          navigate('/home')
        })
    } catch (error) {
      setUser({ loggedIn: false })
      console.log(error)
    }
  }
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}
