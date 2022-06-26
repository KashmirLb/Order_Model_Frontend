import { Dialog, Transition, Popover } from '@headlessui/react'
import { Fragment, useState } from 'react'
import useData from '../hooks/useData'


export default function DialogCreateUser() {

  const [ name, setName ] = useState("")
  const [ lastName, setLastName ] = useState("")
  const [ email, setEmail ] = useState("")
  const [ phoneNumber, setPhoneNumber ] = useState("")
  const [ password, setPassword ] = useState("")
  const [ items, setItems ] = useState([])
  const [ itemName, setItemName ] = useState("")
  const [ itemDescription, setItemDescription ] = useState("")
  const [ createItemDialog, setCreateItemDialog ] = useState(false)

  const { openCreateUserDialog, setOpenCreateUserDialog } = useData()

  const handleDialogClose = () =>{
    setCreateItemDialog(false)
    setOpenCreateUserDialog(false)
  }

  // Creating form. Just added the Items section.
  /*
    //////////////////////- Check if more sections need to be added, go through user model.
    //////////////////////- Create states for each field and add it as value + onChange
    ///////////////////// Another module needs to be created to add Items.
    - Instead a popup has been created, need to create function to create Item and add it to items array.
    - Create password generator
    - Create submithandler that does the necessary checks.
    - Modify the "Create new user" in backend accordingly. Make sure ALL FIELDS ARE CREATED (admin needs to be obtained from token, then searched by ID etc...),
    Make sure items is created correctly with the owner customId, item needs to be created with custom ID AFTER user is creatled.
    - After creating the new user, window should navigate to the user profile (ready to create new order)
    - Have "New customer" button work.
  */

    const handleGeneratePassword = () =>{

    }

    const handleCreateItem = () =>{

      setCreateItemDialog(!createItemDialog)

    }

    return (
      <>  
        <Transition appear show={openCreateUserDialog} as={Fragment}>
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
                      className="text-2xl font-medium leading-6 text-admin-light"
                    >
                      Create new User
                    </Dialog.Title>
                      <form>
                        <div className="p-3 bg-admin-secondary mt-3 rounded-md">
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
                                    className="w-full mt-3 p-2 border rounded-sm bg-gray-50"
                                    value={name}
                                    onChange={e=>setName(e.target.value)}
                                />
                            </div>
                            <div className="m-3 mt-5">
                                <label 
                                    className=" text-admin-light text-xl font-bold"
                                    htmlFor="username"
                                >Last Name(s):</label>
                                <input 
                                    type="text"
                                    id="lastName"
                                    autoComplete="Last name"
                                    placeholder="Last Name(s)"
                                    className="w-full mt-3 p-2 border rounded-sm bg-gray-50"
                                    value={lastName}
                                    onChange={e=>setLastName(e.target.value)}
                                />
                            </div>
                            <div className="m-3 mt-5">
                                <label 
                                    className=" text-admin-light text-xl font-bold"
                                    htmlFor="username"
                                >Email address:</label>
                                <input 
                                    type="email"
                                    id="email"
                                    autoComplete="email"
                                    placeholder="Email"
                                    className="w-full mt-3 p-2 border rounded-sm bg-gray-50"
                                    value={email}
                                    onChange={e=>setEmail(e.target.value)}
                                />
                            </div>
                            <div className="m-3 mt-5">
                                <label 
                                    className=" text-admin-light text-xl font-bold"
                                    htmlFor="username"
                                >Phone Number:</label>
                                <input 
                                    type="tel"
                                    id="telephone"
                                    autoComplete="telephone"
                                    placeholder="Phone number"
                                    className="w-full mt-3 p-2 border rounded-sm bg-gray-50"
                                    value={phoneNumber}
                                    onChange={e=>setPhoneNumber(e.target.value)}
                                />
                            </div>
                            <div className="m-3 mt-5">
                                <label 
                                    className=" text-admin-light text-xl font-bold"
                                    htmlFor="username"
                                >Initial Password:</label>
                                <input 
                                    type="text"
                                    id="password"
                                    autoComplete="password"
                                    placeholder="Initial password"
                                    className="w-full mt-3 p-2 border rounded-sm bg-gray-50"
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
                            <div className="m-3 mt-5">
                                <label 
                                    className=" text-admin-light text-xl font-bold"
                                    htmlFor="username"
                                >Items:</label>
                                <div className="text-almost-white p-2">
                                    { items.length ? items.map(item => item.name +", ") : null }
                                </div>
                                <Popover className="relative ">
                                  <Popover.Button className="block text-almost-white m-1 hover:text-admin-light transition-colors">
                                    
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                      </svg>
                                    
                                  </Popover.Button>

                                  <Popover.Panel className="absolute z-10 translate-x-10 -translate-y-80  rounded-sm">
                                    <div className="m-2 bg-admin-secondary p-2 rounded-sm border-4 border-user-secondary">
                                      <label 
                                       className=" text-admin-light text-xl font-bold"
                                        htmlFor="itemName"
                                      >Item Name:</label>
                                      <input 
                                          type="text"
                                          id="itemName"
                                          autoComplete="item-name"
                                          placeholder="Item Name"
                                          className="w-full mt-3 p-2 border rounded-sm bg-gray-50 mb-3"
                                          value={itemName}
                                          onChange={e=>setItemName(e.target.value)}
                                      />
                                      <label 
                                          className=" text-admin-light text-xl font-bold"
                                          htmlFor="username"
                                      >Description</label>
                                      <textarea 
                                        className="block w-full mt-3 p-2 border rounded-sm bg-gray-50"
                                        value={itemDescription}
                                        onChange={e=>setItemDescription(e.target.value)}
                                      />
                                      <div className="mt-4 flex justify-around">
                                        <Popover.Button
                                            type="button"
                                            className="rounded-md px-8 bg-admin-primary py-2 text-sm font-medium text-almost-white hover:bg-user-primary transition-colors"
                                            onClick={close()}
                                        >
                                            Cancel
                                        </Popover.Button>
                                        <button
                                            type="button"
                                            className="rounded-md px-8 bg-admin-light py-2 text-sm text-almost-black font-bold hover:bg-user-primary transition-colors"
                                        >
                                            Add
                                        </button>
                                      </div>
                                    </div>
                                  </Popover.Panel>
                                </Popover>
                               
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