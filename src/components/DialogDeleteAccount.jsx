import { useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import useAuth from '../hooks/useAuth'
import useUser from '../hooks/useUser'

export default function DialogDeleteAccount({handleDeleteAccount}) {

    const [ confirmDelete, setConfirmDelete ] = useState("")

    const { openCloseDeleteAccountDialog, openDeleteAccountDialog } = useUser()
    const { auth } = useAuth()

    const deleteCheck = confirmDelete==="Delete my account" ? false : true

    return (
      <>  
        <Transition appear show={openDeleteAccountDialog} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={openCloseDeleteAccountDialog}>
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
                      className="text-lg leading-6 text-red-500 uppercase font-bold"
                    >
                      Deleting account:
                        <span
                            className="text-almost-white ml-3">
                            {auth.customId} - {auth.lastName}, {auth.name}
                        </span> 
                    </Dialog.Title>
                    <form onSubmit={handleDeleteAccount}>
                        <div className="p-3 text-user-light">
                           <p className="text-almost-white text-lg">Are you sure you want to delete your account?</p>
                           <p className="text-red-600 mt-2 font-bold text-lg">You account and any open orders will be completely deleted and cannot be recovered</p>
                            <p>To delete your account, please write below: </p>
                            <p className="text-admin-light">Delete my account</p>
                            <input
                                type="text"
                                id="delete"
                                className="text-almost-white bg-user-primary mt-3  px-2 border border-user-light rounded-sm w-full"
                                value={confirmDelete}
                                onChange={e=>setConfirmDelete(e.target.value)}
                            />
                        </div>
                        <div className="mt-4 flex justify-around">
                        <button
                                type="button"
                                className="rounded-md px-8 bg-user-primary-h py-2 text-sm font-medium text-almost-white hover:bg-user-secondary transition-colors"
                                onClick={openCloseDeleteAccountDialog}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className={`${!deleteCheck ? "bg-red-700 hover:bg-red-600" : "" } rounded-md px-8  py-2 text-sm text-almost-white font-bold  transition-colors`}
                                disabled={deleteCheck}
                            >
                                Delete
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