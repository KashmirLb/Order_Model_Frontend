import { useState } from "react"
import { formatDate } from "../helpers"
import Alert from "../components/Alert"
import Spinner from "../components/Spinner"
import useData from "../hooks/useData"
import useAuth from "../hooks/useAuth"
import DialogCreateAdmin from "../components/DialogCreateAdmin"

const Settings = () => {

  const [ alert, setAlert ] = useState({})
  const [ adminLoading, setAdminLoading ] = useState(false)
  const [ editingAdmin, setEditingAdmin ] = useState(false)
  const [ updatedName, setUpdatedName ] = useState("")
  const [ updatedLastName, setUpdatedLastName ] = useState("")
  const [ updatedEmail, setUpdatedEmail ] = useState("")

  const { updateAdmin, createAdmin, openCloseCreateAdminDialog } = useData()
  const { auth, obtainUser } = useAuth()

  const handleEditing = () =>{
    setUpdatedName(auth.name)
    setUpdatedLastName(auth.lastName)
    setUpdatedEmail(auth.email)
    setEditingAdmin(true)
  }

  const handleUpdateAdmin = async () =>{

    setAdminLoading(true)

    if([updatedName, updatedLastName, updatedEmail].includes("")){
      setEditingAdmin(false)
      setAdminLoading(false)
      return
    }

    const updatedAdmin = {...auth}
    updatedAdmin.name = updatedName
    updatedAdmin.lastName = updatedLastName
    updatedAdmin.email = updatedEmail
    
    try {
      const message = await updateAdmin(updatedAdmin)

      if(!message.error){
          await obtainUser()
      }
      setEditingAdmin(false)
      setAlert(message)

      setTimeout(()=>{
          setAlert({})
      },2000)
      
    } catch (error) {
      console.log(error)
      setEditingAdmin(false)
    }
    setAdminLoading(false)
  }

  const handleCreateAdmin = async admin =>{
    const { name, lastName, password, email } = admin

    if([name, lastName, password, email].includes("")){
      return {msg: "Mandatory fields missing", error: true}
    }
    const addingAdmin = await createAdmin({
      name,
      lastName,
      password,
      email,
      firstLogin
    })

    setAlert(addingAdmin.alert)

    if(addingAdmin.alert.error){
      setTimeout(()=>{
        setAlert({})
      },2000)
    }
  }

  const { msg } = alert

  return (
    <>
      {
        adminLoading || !auth.name ? <Spinner /> :(

          <div className="p-3 md:grid md:grid-cols-2 gap-2">
            <div className="bg-admin-primary w-full rounded-md  text-almost-white p-4 h-fit">
              <div className="flex justify-between">
                <h1 className="font-bold text-2xl text-admin-light">Admin Settings</h1>
                {
                  !editingAdmin && (
                    <button 
                      type="button"
                      className="text-almost-white hover:text-admin-light"
                      onClick={handleEditing}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                  )
                }
              </div>
              <div className="py-5 text-lg font-bold uppercase grid grid-cols-2">
                <div className="text-admin-light">Name: </div>
                {editingAdmin ? (
                  <input 
                    type="text"
                    className="text-almost-black px-2 rounded-md w-5/6"
                    value={updatedName}
                    onChange={e=>setUpdatedName(e.target.value)}
                  />
                )
                :
                auth.name}
              </div>
              <div className="py-5 text-lg font-bold uppercase grid grid-cols-2">
                <div className="text-admin-light">Last Name: </div>
                {editingAdmin ? (
                  <input 
                    type="text"
                    className="text-almost-black px-2 rounded-md w-5/6"
                    value={updatedLastName}
                    onChange={e=>setUpdatedLastName(e.target.value)}
                  />
                )
                :
                auth.lastName}
              </div>
              <div className="py-5 text-lg font-bold uppercase grid grid-cols-2">
                <div className="text-admin-light">Email: </div>
                {editingAdmin ? (
                  <input 
                    type="text"
                    className="text-almost-black px-2 rounded-md w-5/6"
                    value={updatedEmail}
                    onChange={e=>setUpdatedEmail(e.target.value)}
                  />
                )
                :
                auth.email}
              </div>
              <div className="py-5 text-lg font-bold uppercase grid grid-cols-2">
                <div className="text-admin-light">Created:</div> {formatDate(auth.createdAt)}
              </div>

              { editingAdmin && (
                <div className="mt-2 flex gap-10">
                  <button
                    type="button"
                    className="rounded-md px-8 bg-admin-secondary py-2 text-sm font-medium text-almost-white hover:bg-user-primary transition-colors"
                    onClick={()=>setEditingAdmin(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="rounded-md px-8 bg-indigo-700 py-2 text-sm text-almost-white font-bold hover:bg-indigo-500 transition-colors"
                    onClick={handleUpdateAdmin}
                  >
                    Update
                  </button>
                </div>
              )}
              {msg && <Alert alert={alert}/>}
            </div>
            <div className="bg-admin-primary w-full rounded-md">
              <div className="md:mt-0 rounded-md mt-3 p-4 flex flex-col h-full justify-around w-full ">
                <button 
                  type="button"
                  className="bg-admin-secondary border border-admin-light py-5 text-almost-white font-bold uppercase hover:bg-admin-primary"
                  onClick={openCloseCreateAdminDialog}
                >
                  Create Admin
                </button>
                <button className="bg-admin-secondary border border-admin-light py-5 text-almost-white font-bold uppercase hover:bg-admin-primary">Reset Admin Password</button>
                <button className="bg-admin-secondary border border-admin-light py-5 text-almost-white font-bold uppercase hover:bg-admin-primary">Deactivate Admin</button>
              </div>
            </div>
          </div>
        )
      }
      <DialogCreateAdmin handleCreateAdmin={handleCreateAdmin} />
    </>
  )
}

export default Settings