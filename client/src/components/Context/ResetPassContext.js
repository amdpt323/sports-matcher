import { useState ,createContext} from 'react'

export const ResetPassContext = createContext()
export const ResetPassProvider = ({ children }) => {
  const [page, setPage] = useState('ForgotPassword')
  const [user,setUser] =useState(null)
  return (
    <ResetPassContext.Provider value={{ page, setPage ,user ,setUser}}>
      {children}
    </ResetPassContext.Provider>
  )
}
