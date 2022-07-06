import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import useData from '../hooks/useData'

export default function DialogDeleteItem({handleDeleteItem}) {


    const { itemData, openCloseDeleteItemDialog, openDeleteItemDialog } = useData()

    return (
      <>  
        <Transition appear show={openDeleteItemDialog} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={openCloseDeleteItemDialog}>
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
                      Deleting Item:
                        <span
                            className="text-almost-white ml-3">
                            {itemData.customId} - {itemData.name}
                        </span> 
                    </Dialog.Title>
                    <form onSubmit={handleDeleteItem}>
                        <div className="p-3 text-admin-light">
                           <p className="text-almost-white text-lg">Are you sure you want to delete this item?</p>
                           <p className="text-red-600 mt-2 font-bold text-lg">Item will be set to DELETED</p>
                        </div>
                        <div className="mt-4 flex justify-around">
                            <button
                                type="button"
                                className="rounded-md px-8 bg-admin-secondary py-2 text-sm font-medium text-almost-white hover:bg-user-primary transition-colors"
                                onClick={openCloseDeleteItemDialog}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="rounded-md px-8 bg-red-700 py-2 text-sm text-almost-white font-bold hover:bg-red-600 transition-colors"
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