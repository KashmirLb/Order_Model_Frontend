import { useState } from "react"
import { formatDate } from "../helpers"
import Alert from "../components/Alert"
import Spinner from "../components/Spinner"
import useAuth from "../hooks/useAuth"
import DialogChangePassword from "../components/DialogChangePassword"
import useUser from "../hooks/useUser"
import DialogChangeContact from "../components/DialogChangeContact"
import DialogDeleteAccount from "../components/DialogDeleteAccount"
import { useNavigate } from "react-router-dom"

const UserProfile = () => {

  const [ alert, setAlert ] = useState({})

  const navigate = useNavigate()

  const { auth, obtainUser, logoutAuth } = useAuth()
  const { openCloseChangePasswordDialog, userChangePassword, openCloseChangeContactDialog, userChangeContact, openCloseDeleteAccountDialog, deleteAccount, logoutUser } = useUser()

  const handleChangePassword = async (e, password, repeatPassword) =>{
    e.preventDefault()
    openCloseChangePasswordDialog()

    if(password===""){
        setAlert({
            msg: "Password can't be blank",
            error: true
        })
        
    }
    else if(password!==repeatPassword){
        setAlert({
            msg: "Passwords don't match",
            error: true
        })
    }
    else{
        try {
            const response = await userChangePassword(password)
            setAlert(response)
        } catch (error) {
            console.log(error)
        }
    }

    setTimeout(()=>{
        setAlert({})

    },2000)
  }

  const handleChangeContact = async (e, email, phoneNumber) =>{

    e.preventDefault()
    openCloseChangeContactDialog()

    const response = await userChangeContact({ email, phoneNumber})

    setAlert(response)

    setTimeout( async ()=>{
        setAlert({})
        if(!response.error){
            await obtainUser()
        }
    },2000)
  }

  const handleDeleteAccount = async e =>{
    e.preventDefault()
    openCloseDeleteAccountDialog()

    const response = await deleteAccount(auth._id)

    setAlert(response)

    setTimeout(()=>{
        logoutUser()
        logoutAuth()
        sessionStorage.removeItem("usertoken")
        navigate("/")
    },2000)
  }

  const { msg } = alert

  return (
    <>
      {
        !auth.name ? <Spinner /> :(

          <div className="p-2 md:grid md:grid-cols-2 gap-2">
            <div className="bg-user-primary w-full rounded-md  text-almost-white p-4 h-fit">
              <div className="flex justify-between">
                <h1 className="font-bold text-2xl text-user-light">User Profile:</h1>
              </div>
              <div className="py-5 text-lg font-bold uppercase grid grid-cols-2">
                <div className="text-user-light">Customer ID: </div>
                {auth.customId}
              </div>
              <div className="py-5 text-lg font-bold uppercase grid grid-cols-2">
                <div className="text-user-light">Name: </div>
                {auth.name}
              </div>
              <div className="py-5 text-lg font-bold uppercase grid grid-cols-2">
                <div className="text-user-light">Last Name: </div>
                {auth.lastName}
              </div>
              <div className="py-5 text-lg font-bold uppercase grid grid-cols-2">
                <div className="text-user-light">Email: </div>
                {auth.email}
              </div>
              <div className="py-5 text-lg font-bold uppercase grid grid-cols-2">
                <div className="text-user-light">Phone number: </div>
                {auth.phoneNumber && auth.phoneNumber}
              </div>
              <div className="py-5 text-lg font-bold uppercase grid grid-cols-2">
                <div className="text-user-light">Registration date:</div> {formatDate(auth.createdAt)}
              </div>
              {msg && <Alert alert={alert}/>}
            </div>
            <div className="bg-user-primary w-full rounded-md">
              <div className="md:mt-0 mt-3 rounded-md p-4 flex flex-col h-full justify-around w-full ">
                <button 
                  type="button"
                  className="bg-user-secondary border border-user-light py-5 text-almost-white font-bold uppercase hover:bg-user-primary"
                  onClick={openCloseChangePasswordDialog}
                >
                  Change password
                </button>
                <button 
                  className="md:mt-0 mt-3 bg-user-secondary border border-user-light py-5 text-almost-white font-bold uppercase hover:bg-user-primary"
                  onClick={openCloseChangeContactDialog}
                >
                  Change contact information
                </button>
                <button 
                  className="md:mt-0 mt-3 bg-user-secondary border border-user-light py-5 text-almost-white font-bold uppercase hover:bg-user-primary"
                  onClick={openCloseDeleteAccountDialog}
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        )
      }
      <DialogChangePassword handleChangePassword={handleChangePassword}/>
      <DialogChangeContact handleChangeContact={handleChangeContact} />
      <DialogDeleteAccount handleDeleteAccount={handleDeleteAccount} />
    </>
  )
}

export default UserProfile