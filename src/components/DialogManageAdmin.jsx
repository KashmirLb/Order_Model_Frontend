import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import useData from '../hooks/useData'
import { generatePassword } from '../helpers'
import { useEffect } from 'react'
import SearchBar from './SearchBar'

export default function DialogManageAdmin({handlePasswordReset, handleActivateDisableAdmin, deactivate}) {

    const [ password, setPassword ] = useState("")
    const [ firstLogin, setFirstLogin ] = useState(true)
  
    const { openManageAdminDialog, openCloseManageAdminDialog, obtainAdminList, adminList, customerData } = useData()
    
    useEffect(()=>{
      obtainAdminList()
      setPassword("")
    },[openManageAdminDialog])

    const handleGeneratePassword = () =>{
        setPassword(generatePassword())
    }

    const handleFirstLogin = () =>{
      setFirstLogin(!firstLogin)
  }

    return (
      <>  
        <Transition appear show={openManageAdminDialog} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={openCloseManageAdminDialog}>
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
                  <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-admin-primary p-6 text-left align-middle shadow-xl transition-all">
                    <Dialog.Title
                      as="h3"
                      className="text-2xl p-2 uppercase font-medium leading-6 text-admin-light"
                    >
                      {deactivate ? "Activate / Disable admin" : "Reset Password"}
                    </Dialog.Title>
                    <form onSubmit={e=> deactivate ? handleActivateDisableAdmin(e) : handlePasswordReset(e, password, firstLogin)}>
                      <div className="bg-admin-secondary px-2 pt-2 pb-5 mt-3 rounded-md">
                        { adminList.length && <SearchBar searchList={adminList} sidebar={false}/> }
                        <div className=" text-almost-white bg-admin-primary p-3 m-1 rounded-md border border-admin-light mt-2">
                            <p><span className="text-admin-light">Id:</span> {customerData.adminId && customerData.adminId}</p>
                            <p><span className="text-admin-light">Name:</span> {customerData.name && ` ${customerData.lastName}, ${customerData.name}`}</p>
                            {customerData.adminId && (
                            <p
                              className={`${customerData.active ? "text-green-500" : "text-red-600"} font-bold uppercase`}
                            >{customerData.active ? "Active" : "Disabled"}</p>)}
                        </div>
                      </div>
                      { !deactivate && (
                        <>
                          <div className="p-3 text-admin-light">
                              <label className=" block">Enter a new password:</label>
                              <button
                                  type="button" 
                                  className="mt-2 px-2 bg-admin-primary rounded-md text-almost-white border border-admin-light"
                                  onClick={handleGeneratePassword}
                              >
                                  Generate
                              </button>
                              <input
                                  className="text-almost-white bg-admin-primary mt-3 ml-6 px-2 border border-admin-light rounded-sm"
                                  value={password}
                                  onChange={e=>setPassword(e.target.value)}
                              />
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
                      </>
                      )}
                          <div className="mt-4 flex justify-around">
                              <button
                                  type="button"
                                  className="rounded-md px-8 bg-admin-secondary py-2 text-sm font-medium text-almost-white hover:bg-user-primary transition-colors"
                                  onClick={openCloseManageAdminDialog}
                              >
                                  Cancel
                              </button>
                              {
                                deactivate ? 
                                  <button
                                    hidden={customerData.adminId ? false : true}
                                    type="submit"
                                    className="rounded-md px-8 bg-red-700 py-2 text-sm text-almost-white font-bold hover:bg-red-600 transition-colors"
                                  >
                                      {customerData.active ? "Deactivate" : "Activate"}
                                  </button>
                                  :
                                  <button
                                      type="submit"
                                      className="rounded-md px-8 bg-indigo-700 py-2 text-sm text-almost-white font-bold hover:bg-user-primary transition-colors"
                                  >
                                      Reset
                                  </button>
                              }
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