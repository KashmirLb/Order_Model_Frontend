import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import useData from '../hooks/useData'


export default function DialogTimeFrame({setTimeFrame}) {
  
  
    const { openDateDialog, setOpenDateDialog } = useData()
    const [ initialDate, setInitialDate ] = useState("")
    const [ endDate, setEndDate ] = useState("")

    const handleDialogClose = () =>{
        setTimeFrame("Week")
        setOpenDateDialog(false)
    }

    const handleDatesSelected = () =>{

        if([initialDate, endDate].includes("")){
            return 
        }

        setTimeFrame([initialDate, endDate])
        setOpenDateDialog(false)
    }
  
    return (
      <>  
        <Transition appear show={openDateDialog} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={handleDialogClose}>
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
                      Select Date Range
                    </Dialog.Title>
                    <div className="p-3 flex ">
                        <div className="m-3">
                            <label className=" text-admin-light">From:</label>
                            <input 
                                type="date" 
                                className="border-2 mt-2 border-admin-light bg-almost-white  font-bold p-2 placeholder-almost-white"
                                onChange={e=>setInitialDate(e.target.value)}
                            />
                        </div>
                        <div className="m-3">
                            <label className="text-admin-light">To:</label>
                            <input 
                                type="date" 
                                className="border-2 mt-2 border-admin-light bg-almost-white  font-bold p-2 placeholder-almost-white"
                                onChange={e=>setEndDate(e.target.value)}
                            />
                        </div>
                    </div>
                    
  
                    <div className="mt-4 flex justify-around">
                      <button
                        type="button"
                        className="rounded-md px-8 bg-admin-secondary py-2 text-sm font-medium text-almost-white hover:bg-user-primary transition-colors"
                        onClick={handleDialogClose}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="rounded-md px-8 bg-indigo-700 py-2 text-sm text-almost-white font-bold hover:bg-user-primary transition-colors"
                        onClick={handleDatesSelected}
                      >
                        Select
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </>
    )
  }