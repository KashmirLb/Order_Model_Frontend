import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import useData from '../hooks/useData'
import Alert from './Alert'
import useAuth from '../hooks/useAuth'
import SearchBar from './SearchBar'

export default function DialogCreateItem() {

    const [ alert, setAlert ] = useState({})
    const [ userList, setUserList ] = useState([])
    const [ itemName, setItemName ] = useState("")
    const [ itemDescription, setItemDescription ] = useState("")

    const navigate = useNavigate()

    const { openCreateItemDialog, openCloseItemDialog, foundItem, setFoundItem, createItem } = useData()
    const { searchList } = useAuth()

    useEffect(()=>{

        const onlyUsers = searchList.filter( item => item.searchType==="users")
        setUserList(onlyUsers)

    },[])

    useEffect(()=>{

        setAlert({})
        setItemName("")
        setItemDescription("")
        setFoundItem({})

    },[openCreateItemDialog])

    const handleSubmit = async e =>{
    
        e.preventDefault()  
        if(itemName===""){
            setAlert({
                msg: "You need to provide a name",
                error: true
            })
            return
        }   
        if(!foundItem._id){
            setAlert({
                msg: "You need to select the owner",
                error: true
            })
            return
        }   
        const addedItem = await createItem({
            name: itemName,
            description: itemDescription,
            owner: foundItem._id
        })  
        setAlert(addedItem.alert)

        setTimeout(()=>{
            setAlert({})
            openCloseItemDialog()
            navigate(`/admin-console/items/${addedItem.item._id}`)
          },1500)
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
        <Transition appear show={openCreateItemDialog} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={openCloseItemDialog}>
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
                  <Dialog.Panel className="w-full max-w-md transform rounded-2xl bg-admin-primary p-6 text-left align-middle shadow-xl transition-all">
                    <Dialog.Title
                      as="h3"
                      className="text-2xl font-medium leading-6 text-admin-light"
                    >
                      Create new Item
                    </Dialog.Title>
                      <form
                        onSubmit={handleSubmit}
                      >
                        <div className="p-3 bg-admin-secondary mt-3 rounded-md">
                          {msg && <Alert alert={alert}/>}
                            <div className="m-3 mt-5">
                                <label 
                                    className=" text-admin-light text-xl font-bold"
                                    htmlFor="itemName"
                                >Item Name:</label>
                                <input 
                                    type="text"
                                    id="itemName"
                                    autoComplete="name"
                                    placeholder="Name"
                                    className={`${styleBorders(itemName)} w-full mt-3 p-2 border rounded-sm bg-gray-50`}
                                    value={itemName}
                                    onChange={e=>setItemName(e.target.value)}
                                />
                            </div>
                            <div className="m-3 mt-5">
                                <label 
                                    className=" text-admin-light text-xl font-bold"
                                    htmlFor="itemDescription"
                                >Description</label>
                                <textarea 
                                    className={`w-full mt-3 p-2 border rounded-sm bg-gray-50`}
                                    value={itemDescription}
                                    onChange={e=>setItemDescription(e.target.value)}
                                    id="itemDescription"
                                />
                            </div>
                            <div className="m-3 mt-5">
                                <label 
                                    className=" text-admin-light text-xl font-bold"
                                    htmlFor="username"
                                >Owner</label>
                                <SearchBar searchList={userList} sidebar={false} />
                                <div className="text-almost-white bg-admin-primary p-3 m-1 rounded-md border border-admin-light">
                                    <p><span className="text-admin-light">Id:</span> {foundItem.customId && foundItem.customId}</p>
                                    <p><span className="text-admin-light">Name:</span> {foundItem.name && ` ${foundItem.lastName}, ${foundItem.name}`}</p>

                                </div>
                            </div>
                        </div>
                        <div className="mt-4 flex justify-around">
                            <button
                                type="button"
                                className="rounded-md px-8 bg-admin-secondary py-2 text-sm font-medium text-almost-white hover:bg-user-primary transition-colors"
                                onClick={openCloseItemDialog}
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