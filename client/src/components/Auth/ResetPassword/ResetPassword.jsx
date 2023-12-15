import { useContext } from "react"
import { ResetPassContext } from "../../Context/ResetPassContext"
import ForgotPassword from "./ForgotPassword"
import EnterOtp from "./EnterOtp"
import CreateNewPassword from "./CreateNewPassword"


const ResetPassword = () => {
 const {page} = useContext(ResetPassContext)
 if(page==='ForgotPassword'){
  return <ForgotPassword/>
 }else if(page==='EnterOtp'){
  return <EnterOtp/>
 }else{
  return <CreateNewPassword/>
 }
}

export default ResetPassword
