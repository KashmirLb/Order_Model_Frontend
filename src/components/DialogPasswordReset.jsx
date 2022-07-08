import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import useData from '../hooks/useData'
import { generatePassword } from '../helpers'
import { useEffect } from 'react'

export default function DialogPasswordReset({handlePasswordReset}) {

    const [ password, setPassword ] = useState("")

    const { openPasswordResetDialog, openClosePasswordResetDialog, customerData } = useData()

    useEffect(()=>{
      setPassword("")
    },[openPasswordResetDialog])

    const handleGeneratePassword = () =>{
        setPassword(generatePassword())
    }

    return (
      <>  
        <Transition appear show={openPasswordResetDialog} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={openClosePasswordResetDialog}>
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
                      className="text-lg font-medium leading-6 text-admin-light"
                    >
                      Reset Password
                    </Dialog.Title>
                    <form onSubmit={e=>handlePasswordReset(e, {_id: customerData._id, password: password})}>
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
                        <div className="mt-4 flex justify-around">
                            <button
                                type="button"
                                className="rounded-md px-8 bg-admin-secondary py-2 text-sm font-medium text-almost-white hover:bg-user-primary transition-colors"
                                onClick={openClosePasswordResetDialog}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="rounded-md px-8 bg-indigo-700 py-2 text-sm text-almost-white font-bold hover:bg-user-primary transition-colors"
                            >
                                Reset
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