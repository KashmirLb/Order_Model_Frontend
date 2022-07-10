import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import useUser from '../hooks/useUser'
import { useEffect } from 'react'

export default function DialogChangePassword({handleChangePassword}) {

    const [ password, setPassword ] = useState("")
    const [ repeatPassword, setRepeatPassword ] = useState("")

    const { openCloseChangePasswordDialog, openChangePasswordDialog } = useUser()

    useEffect(()=>{
      setPassword("")
      setRepeatPassword("")
    },[openChangePasswordDialog])

    return (
      <>  
        <Transition appear show={openChangePasswordDialog} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={openCloseChangePasswordDialog}>
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
                      className="text-xl uppercase font-medium leading-6 text-user-light"
                    >
                      Change current password
                    </Dialog.Title>
                    <form onSubmit={e=>handleChangePassword(e, password, repeatPassword)}>
                        <div className="p-3 text-user-light text-lg">
                            <label className="block"
                            htmlFor='password'>Enter a new password:</label>
                            <input
                                id="password"
                                type="password"
                                className="text-almost-white bg-user-primary mt-3  px-2 border border-user-light rounded-sm w-full"
                                value={password}
                                onChange={e=>setPassword(e.target.value)}
                            />
                        </div>
                        <div className="p-3 text-user-light text-lg">
                            <label className=" block" htmlFor="repeat-password">Repeat password:</label>
                            <input
                                id="repeat-password"
                                type="password"
                                className="text-almost-white bg-user-primary mt-3  px-2 border border-user-light rounded-sm w-full"
                                value={repeatPassword}
                                onChange={e=>setRepeatPassword(e.target.value)}
                            />
                        </div>
                        <div className="mt-4 flex justify-around">
                            <button
                                type="button"
                                className="rounded-md px-8 bg-user-primary-h py-2 text-sm font-medium text-almost-white hover:bg-user-secondary transition-colors"
                                onClick={openCloseChangePasswordDialog}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="rounded-md px-8 bg-sky-700 py-2 text-sm text-almost-white font-bold hover:bg-sky-600 transition-colors"
                            >
                                Change password
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