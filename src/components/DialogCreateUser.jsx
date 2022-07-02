import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Dialog, Transition, Popover } from '@headlessui/react'
import { Fragment, useState } from 'react'
import useData from '../hooks/useData'
import useAuth from '../hooks/useAuth'
import Alert from './Alert'

export default function DialogCreateUser({creatingOrder}) {

  const [ alert, setAlert ] = useState({})
  const [ name, setName ] = useState("")
  const [ lastName, setLastName ] = useState("")
  const [ email, setEmail ] = useState("")
  const [ phoneNumber, setPhoneNumber ] = useState("")
  const [ password, setPassword ] = useState("")
  const [ items, setItems ] = useState([])
  const [ itemName, setItemName ] = useState("")
  const [ itemDescription, setItemDescription ] = useState("")

  const navigate = useNavigate()

  const { openCreateUserDialog, openCloseUserDialog, createCustomer, obtainCustomerData } = useData()
  const { prepareSearchList } = useAuth()

  useEffect(()=>{

    setAlert({})
    setName("")
    setLastName("")
    setEmail("")
    setPhoneNumber("")
    setPassword("")
    setItems([])

  },[openCreateUserDialog])

    const handleGeneratePassword = () =>{
      setPassword(Math.random().toString(36).slice(2,10))
    }

    const handleAddItem = () =>{

      if(itemName===""){
        return
      }

      let newItem = {
        name: itemName,
        description: itemDescription,
      }

      setItemName("")
      setItemDescription("")
      setItems([...items, newItem])
    }

    const handleSubmit = async e =>{
      e.preventDefault()

      if([name, lastName, password, email].includes("")){

        setAlert({
          msg: "Mandatory fields missing",
          error: true
        })
        return
      }
      const addingCustomer = await createCustomer({
        name,
        lastName,
        password,
        email,
        phoneNumber,
        items
      })

      setAlert(addingCustomer.alert)

      setName("")
      setLastName("")
      setEmail("")
      setPhoneNumber("")
      setPassword("")
      setItems([])

      if(creatingOrder){
        await prepareSearchList()
        await obtainCustomerData(addingCustomer.user._id)
        setTimeout(()=>{
          setAlert({})
          
          openCloseUserDialog()
        },1500)
      }
      else{
        setTimeout(()=>{
          setAlert({})
          openCloseUserDialog()
          navigate(`/admin-console/users/${addingCustomer.user._id}`)
        },1500)
      }
    }

    const { msg, error } = alert

    const styleBorders = input =>{
      if(input==="" && error){
        return "outline-red-700 outline-4 outline"
      }
      return ""
    } 

    return (
      <>  
        <Transition appear show={openCreateUserDialog} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={openCloseUserDialog}>
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
                                    htmlFor="telephone"
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
                            <div className="m-3 mt-5">
                                <label 
                                    className=" text-admin-light text-xl font-bold"
                                    htmlFor="items"
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
                                  <Popover.Panel className="absolute z-10 translate-x-10 -translate-y-72  rounded-sm">
                                    <div 
                                      className="m-2 bg-admin-secondary p-2 rounded-sm border-4 border-user-secondary"
                                    >
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
                                          htmlFor="itemDescription"
                                      >Description</label>
                                      <textarea 
                                        className="block w-full mt-3 p-2 border rounded-sm bg-gray-50"
                                        id="itemDescription"
                                        value={itemDescription}
                                        onChange={e=>setItemDescription(e.target.value)}
                                      />
                                      <div className="mt-4 flex justify-around">
                                        <Popover.Button
                                            type="button"
                                            className="rounded-md px-8 bg-admin-primary py-2 text-sm font-medium text-almost-white hover:bg-user-primary transition-colors"
                                        >
                                            Cancel
                                        </Popover.Button>
                                        <Popover.Button
                                            type="button"
                                            className={`${itemName==="" ? "bg-admin-primary" : "bg-admin-light hover:bg-admin-light-h" } rounded-md px-8 py-2 text-sm text-almost-black font-bold  transition-colors`}
                                            disabled={itemName==="" ? true : false}
                                            onClick={handleAddItem}
                                        >
                                            Add
                                        </Popover.Button>
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
                                onClick={openCloseUserDialog}
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