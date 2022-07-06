import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import useData from "../hooks/useData"
import Spinner from "../components/Spinner"
import Alert from "../components/Alert"
import { formatDate } from "../helpers"
import DialogDeleteItem from "../components/DialogDeleteItem"
import useAuth from "../hooks/useAuth"

/*
    Enable delete button (item will be set to deleted, but not removed)
*/

const Item = () => {

    const [ alert, setAlert ] = useState({})
    const [ itemLoading, setItemLoading ] = useState(true)
    const [ editItem, setEditItem ] = useState(false)
    const [ editName, setEditName ] = useState("")
    const [ editDescription, setEditDescription ] = useState("")

    const params = useParams()
    const navigate = useNavigate()

    const { dataLoading, obtainItemData, itemData, updateItem, setItemData, openCloseDeleteItemDialog, openDeleteItemDialog, deleteItem } = useData()
    const { prepareSearchList } = useAuth()

    const { name, customId, description, owner, orders, createdAt } = itemData

    useEffect(()=>{

        if(openDeleteItemDialog){
            openCloseDeleteItemDialog()
        }

        const getItem = async () =>{
            await obtainItemData(params.id)
            setItemLoading(false)
        }
        getItem()
    },[params])

    const handleOwnerClick = () =>{
        navigate(`/admin-console/users/${owner._id}`)
    }

    const handleEditItem = () =>{
        setEditName(name)
        setEditDescription(description)
        setEditItem(true)
    }

    const handleUpdateItem = async () =>{
        if(editName===""){
            setAlert({
                msg: "Item name empty",
                error: true
            })
            setTimeout(()=>{
                setAlert({})
            },2000)
            return
        }

        const updatingItem = await updateItem({_id: itemData._id, name: editName, description: editDescription})

        setAlert(updatingItem)

        const updatedItem = {...itemData}
        updatedItem.name = editName
        updatedItem.description = editDescription

        setItemData(updatedItem)
        setEditItem(false)

        setTimeout(()=>{
            setAlert({})
        },1500)
    }

    const handleDeleteItem = async e  =>{
        e.preventDefault()

        try{
            const deletingItem = await deleteItem(itemData._id)
    
            openCloseDeleteItemDialog()
            setAlert(deletingItem)
            await prepareSearchList()
    
            setTimeout(()=>{
                setAlert({})
                if(!deletingItem.error){
                    setItemData({})
                    navigate("/admin-console/items")
                }
            },2000)

        }catch(error){
            console.log(error)
        }
    }

    const { msg } = alert

  return (

    dataLoading || itemLoading ? <Spinner/> :
        <div className="md:flex gap-3 pt-2">
            <div className="bg-admin-secondary md:w-1/2 rounded-md">
                <div className="p-5 break-normal">
                    <table className="table-fixed w-full">
                        <tbody className="text-lg text-admin-light rounded-md">
                            <tr className="bg-admin-primary">
                                <td className="p-2">ID:</td>
                                <td className="text-almost-white p-2 ">{customId}</td>
                            </tr>
                            <tr className="h-2"></tr>
                            <tr className="bg-admin-primary">
                                <td className="p-2">Item name:</td>
                                <td className="text-almost-white">
                                    {
                                         editItem ? (
                                            <input
                                                type="text"
                                                className="text-almost-black px-2 rounded-md"
                                                value={editName}
                                                onChange={e=>setEditName(e.target.value)}
                                            />
                                        ) : name
                                    }
                                </td>
                            </tr>
                            <tr className="h-2"></tr>
                            <tr className="h-2"></tr>
                            <tr className="bg-admin-primary">
                                <td className="p-2">Owner:</td>
                                <td className="text-almost-white hover:text-admin-light hover:cursor-pointer" onClick={handleOwnerClick}>{owner.lastName}, {owner.name}</td>
                            </tr>
                            <tr className="h-2"></tr>
                            <tr className="bg-admin-primary">
                                <td className="p-2">Description:</td>
                                <td className="text-almost-white">
                                    {
                                        editItem ? (
                                            <textarea 
                                            className="text-almost-black p-2 my-2 rounded-sm bg-gray-50 h-20"
                                            value={editDescription}
                                            onChange={e=>setEditDescription(e.target.value)}
                                          />
                                       ) : description && description
                                   }
                                </td>
                            </tr>
                            <tr className="h-2"></tr>
                            
                            <tr className="h-2"></tr>
                            <tr className="bg-admin-primary">
                                <td className="p-2">Date added:</td>
                                <td className="text-almost-white">{formatDate(createdAt)}</td>
                            </tr>
                        </tbody>
                </table>
                </div>
                
                    {
                        editItem ? (
                            <div className="flex gap-3 px-3">
                                 <button
                                    type="button"
                                    className="my-3 p-2 bg-user-primary-h hover:bg-user-secondary text-almost-white font-bold uppercase rounded-md w-1/3 transition-colors"
                                    onClick={()=>setEditItem(false)}
                                >Cancel</button>
                                <button
                                    type="button"
                                    className="my-3 p-2 bg-indigo-700 hover:bg-indigo-500 text-almost-white font-bold uppercase rounded-md w-1/3 transition-colors"
                                    onClick={handleUpdateItem}
                                >
                                    Update
                                </button>
                            </div>
                        )
                        :
                        (
                            <div className="flex gap-3 px-3">
                                <button
                                    type="button"
                                    className="my-3 p-2 bg-user-primary-h hover:bg-user-secondary text-almost-white font-bold uppercase rounded-md w-1/3 transition-colors"
                                    onClick={handleEditItem}
                                >Edit</button>
                                <button
                                    type="button"
                                    className="my-3 p-2 bg-red-700 hover:bg-red-600 text-almost-white font-bold uppercase rounded-md w-1/3 transition-colors"
                                    onClick={openCloseDeleteItemDialog}
                                >
                                    Delete
                                </button>
                            </div>
                        )
                    }
                <div className="px-10 mb-3">
                    {msg && <Alert alert={alert}/>}
                </div>
            </div>
            <div className="bg-admin-primary md:mt-0 md:w-1/2 rounded-md mt-3 p-4 flex flex-col gap-2">
                <div>
                    <p className="text-white text-lg font-bold">Assigned Orders:</p>
                    {orders.length ? orders.map(order =>(
                            <div key={order._id} className={`${order.status==="Closed" ? "bg-admin-secondary" : "bg-indigo-700"} rounded-md p-2 text-almost-white mt-4`}>
                                <div className=" grid grid-flow-col gap-4">
                                    <div className="text-admin-light">
                                        <p>ID: </p>
                                        <p>Title: </p>
                                        <p>Created: </p>
                                        <p>Description: </p>
                                    </div>
                                    <div>
                                        <p>{order.customId}</p>
                                        <p>{order.title}</p>
                                        <p>{formatDate(order.createdAt)}</p>
                                        <p className="whitespace-pre-wrap line-clamp-4 ">{order.description}</p>
                                    </div>
                                </div>
                                <div className="flex items-end gap-5">
                                    <button
                                        type="button"
                                        className="bg-admin-primary p-2 mt-2 rounded-md hover:text-admin-light transition-colors"
                                        onClick={()=>navigate(`/admin-console/orders/${order._id}`)}
                                    >See order</button>
                                    <p className="text-admin-light "> Last update:<span className="text-almost-white ml-5">{formatDate(order.updatedAt)}</span></p>
                                </div>
                            </div>
                        ))
                        :
                        <p className="bg-admin-secondary rounded-md p-2 text-almost-white mt-4">No active orders</p>
                    }
                </div>
            </div>
            <DialogDeleteItem handleDeleteItem={handleDeleteItem} />
        </div>
  )
}

export default Item