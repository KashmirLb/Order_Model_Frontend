import { useEffect, Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import useData from '../hooks/useData'
import Alert from './Alert'
import { generatePassword } from '../helpers'

export default function DialogCreateAdmin({handleCreateAdmin}) {

  const [ alert, setAlert ] = useState({})
  const [ name, setName ] = useState("")
  const [ lastName, setLastName ] = useState("")
  const [ email, setEmail ] = useState("")
  const [ password, setPassword ] = useState("")
  const [ firstLogin, setFirstLogin ] = useState(true)

  const { openCreateAdminDialog, openCloseCreateAdminDialog } = useData()

  useEffect(()=>{

    setAlert({})
    setName("")
    setLastName("")
    setEmail("")
    setPassword("")

  },[openCreateAdminDialog])

    const handleFirstLogin = () =>{
        setFirstLogin(!firstLogin)
    }

    const handleGeneratePassword = () =>{
      setPassword(generatePassword())
    }

    const handleSubmit = async e =>{

      e.preventDefault()

      try {
          const response = await handleCreateAdmin({name, lastName, password, email, firstLogin})
    
          if(!response.error){
              setName("")
              setLastName("")
              setEmail("")
              setPassword("")
              openCloseCreateAdminDialog()
          }
          else{
            setAlert(response)
          }
      } catch (error) {
        console.log(error.response)
      }
    }

    const { error, msg } = alert

    const styleBorders = input =>{
      if(input==="" && error){
        return "outline-red-700 outline-4 outline"
      }
      return ""
    } 

    return (
      <>  
        <Transition appear show={openCreateAdminDialog} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={openCloseCreateAdminDialog}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>
  
            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-admin-primary p-6 text-left
                    align-middle shadow-xl transition-all border border-admin-light">
                    <Dialog.Title
                      as="h3"
                      className="text-4xl font-bold leading-6 text-admin-light pb-2"
                    >
                      New Admin
                    </Dialog.Title>
                      <form
                        onSubmit={handleSubmit}
                      >
                        <div className="p-3 bg-admin-secondary mt-3 rounded-md">
                          {msg && <Alert alert={alert}/>}
                            <div className="m-3 mt-5">
                                <label 
                                    className=" text-admin-light text-xl font-bold"
                                    htmlFor="username"
                                >Name:</label>
                                <input 
                                    type="text"
                                    id="name"
                                    autoComplete="name"
                                    placeholder="Name"
                                    className={`${styleBorders(name)} w-full mt-3 p-2 border rounded-sm bg-gray-50`}
                                    value={name}
                                    onChange={e=>setName(e.target.value)}
                                />
                            </div>
                            <div className="m-3 mt-5">
                                <label 
                                    className=" text-admin-light text-xl font-bold"
                                    htmlFor="lastName"
                                >Last Name(s):</label>
                                <input 
                                    type="text"
                                    id="lastName"
                                    autoComplete="Last name"
                                    placeholder="Last Name(s)"
                                    className={`${styleBorders(lastName)} w-full mt-3 p-2 border rounded-sm bg-gray-50`}
                                    value={lastName}
                                    onChange={e=>setLastName(e.target.value)}
                                />
                            </div>
                            <div className="m-3 mt-5">
                                <label 
                                    className=" text-admin-light text-xl font-bold"
                                    htmlFor="email"
                                >Email address:</label>
                                <input 
                                    type="email"
                                    id="email"
                                    autoComplete="email"
                                    placeholder="Email"
                                    className={`${styleBorders(email)} w-full mt-3 p-2 border rounded-sm bg-gray-50`}
                                    value={email}
                                    onChange={e=>setEmail(e.target.value)}
                                />
                            </div>
                            <div className="m-3 mt-5">
                                <label 
                                    className=" text-admin-light text-xl font-bold"
                                    htmlFor="password"
                                >Initial Password:</label>
                                <input 
                                    type="text"
                                    id="password"
                                    autoComplete="password"
                                    placeholder="Initial password"
                                    className={`${styleBorders(password)} w-full mt-3 p-2 border rounded-sm bg-gray-50`}
                                    value={password}
                                    onChange={e=>setPassword(e.target.value)}
                                />
                                <button
                                    type="button" 
                                    className="mt-2 px-2 bg-admin-primary rounded-md text-almost-white border border-admin-light"
                                    onClick={handleGeneratePassword}
                                >
                                    Generate
                                </button>
                            </div>
                            <div 
                                className="py-4 text-admin-light font-bold"
                            >
                                <label className="pl-6 pr-2">Change password on first login: </label>
                                <input 
                                    onChange={handleFirstLogin} 
                                    type="checkbox" defaultChecked={true} 
                                    className="bg-admin-secondary border border-admin-light"
                                />
                            </div>
                        </div>   
                        <div className="mt-4 flex justify-around">
                            <button
                                type="button"
                                className="rounded-md px-8 bg-admin-secondary py-2 text-sm font-medium text-almost-white hover:bg-user-primary transition-colors"
                                onClick={openCloseCreateAdminDialog}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="rounded-md px-8 bg-indigo-700 py-2 text-sm text-almost-white font-bold hover:bg-user-primary transition-colors"
                            >
                                Create
                            </button>
                        </div>
                    </form>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </>
    )
  }