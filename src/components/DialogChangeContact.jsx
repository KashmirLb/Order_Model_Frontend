import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import useUser from '../hooks/useUser'
import { useEffect } from 'react'
import useAuth from '../hooks/useAuth'

export default function DialogChangeContact({handleChangeContact}) {

    const [ email, setEmail ] = useState("")
    const [ phoneNumber, setPhoneNumber ] = useState("")

    const { auth } = useAuth()
    const { openCloseChangeContactDialog, openChangeContactDialog } = useUser()

    useEffect(()=>{
      setEmail(auth.email)
      setPhoneNumber(auth.phoneNumber)
    },[openChangeContactDialog])

    return (
      <>  
        <Transition appear show={openChangeContactDialog} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={openCloseChangeContactDialog}>
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
                  <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-user-primary p-6 text-left align-middle shadow-xl transition-all">
                    <Dialog.Title
                      as="h3"
                      className="text-xl font-medium leading-6 text-user-light uppercase"
                    >
                      Change contact details:
                    </Dialog.Title>
                    <form onSubmit={e=>handleChangeContact(e, email, phoneNumber)}>
                        <div className="p-3 text-user-light text-lg">
                            <label className="block font-bold"
                            htmlFor='email'>Email:</label>
                            <input
                                id="email"
                                type="email"
                                className="text-almost-white bg-user-primary mt-3 px-2 border border-user-light rounded-sm w-full"
                                value={email}
                                onChange={e=>setEmail(e.target.value)}
                            />
                        </div>
                        <div className="p-3 text-user-light text-lg">
                            <label className="block font-bold" htmlFor="phone-number">Phone Number:</label>
                            <input
                                id="phone-number"
                                type="text"
                                className="text-almost-white bg-user-primary mt-3 px-2 border border-user-light rounded-sm w-full"
                                value={phoneNumber}
                                onChange={e=>setPhoneNumber(e.target.value)}
                            />
                        </div>
                        <div className="mt-4 flex justify-around">
                            <button
                                type="button"
                                className="rounded-md px-8 bg-user-primary-h py-2 text-sm font-medium text-almost-white hover:bg-user-secondary transition-colors"
                                onClick={openCloseChangeContactDialog}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="rounded-md px-8 bg-sky-700 py-2 text-sm text-almost-white font-bold hover:bg-sky-600 transition-colors"
                            >
                                Update
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