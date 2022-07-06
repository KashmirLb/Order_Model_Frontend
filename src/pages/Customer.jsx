import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import useData from "../hooks/useData"
import useAuth from "../hooks/useAuth"
import Spinner from "../components/Spinner"
import { formatDate } from "../helpers"
import Alert from "../components/Alert"
import DialogPasswordReset from "../components/DialogPasswordReset"
import DialogDeleteUser from "../components/DialogDeleteUser"

const Customer = () => {

    const [ alert, setAlert ] = useState({})
    const [ customerLoading, setCustomerLoading ] = useState(true)
    const [ editName, setEditName ] = useState("")
    const [ editLastName, setEditLastName ] = useState("")
    const [ editEmail, setEditEmail ] = useState("")
    const [ editPhoneNumber, setEditPhoneNumber ] = useState("")
    const [ editCustomer, setEditCustomer ] = useState(false)

    const params = useParams()
    const navigate = useNavigate()

    const { dataLoading, obtainCustomerData, customerData, updateCustomer, setCustomerData, openClosePasswordResetDialog, openPasswordResetDialog,
        passwordReset, openCloseDeleteUserDialog, openDeleteUserDialog, deleteUser } = useData()

    const { prepareSearchList } = useAuth()

    const { name, lastName, email, customId, phoneNumber, comments, assets, orders, activeOrders } = customerData

    useEffect(()=>{

        if(openDeleteUserDialog){
            openCloseDeleteUserDialog()
        }
        if(openPasswordResetDialog){
            openClosePasswordResetDialog()
        }
        const getCustomer = async () =>{
            await obtainCustomerData(params.id)
            setCustomerLoading(false)
        }
        getCustomer()
    },[params])

    const handleEditCustomer = () =>{
        setEditName(name)
        setEditLastName(lastName)
        setEditEmail(email)
        setEditPhoneNumber(phoneNumber)
        setEditCustomer(true)
    }

    const handleUpdateCustomer = async () =>{

        if([editName, editLastName, editEmail].includes("")){
            setEditCustomer(false)
            return
          }
      
          const updatedCustomer = {...customerData}
          updatedCustomer.name = editName
          updatedCustomer.lastName = editLastName
          updatedCustomer.email = editEmail
          updatedCustomer.phoneNumber = editPhoneNumber
          
          try {
            const message = await updateCustomer(updatedCustomer)

            if(!message.error){
                setCustomerData(updatedCustomer)
            }
            setEditCustomer(false)
            setAlert(message)

            setTimeout(()=>{
                setAlert({})
            },2000)
            
          } catch (error) {
            console.log(error)
          }
          
    }

    const handlePasswordReset = async (e, user)=>{
        e.preventDefault()

        if(user.password===""){
            openClosePasswordResetDialog()
            setAlert({
                msg: "Password can't be empty",
                error: true
            })
            setTimeout(()=>{
                setAlert({})
            },1500)
            return
        }

        const reset = await passwordReset(user)
        openClosePasswordResetDialog()

        setAlert(reset)

        setTimeout(()=>{
            setAlert({})
        },2000)
    }

    const handleDeleteUser = async e =>{
        e.preventDefault()
        try{
            const message = await deleteUser(customerData._id)

            openCloseDeleteUserDialog()
            setAlert(message)

            if(!message.error){
                prepareSearchList()
            }

            setTimeout(()=>{
                setAlert({})
                if(!message.error){
                    setCustomerData({})
                    navigate("/admin-console/users")
                }
            },2000)
        }
        catch(error){
            console.log(error)
        }
    }

    const { msg } = alert

  return (

    dataLoading || customerLoading ? <Spinner/> :
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
                                <td className="p-2">Name:</td>
                                <td className="text-almost-white ">
                                    {editCustomer ? (
                                        <input
                                            type="text"
                                            className="text-almost-black px-2 rounded-md w-5/6"
                                            value={editName}
                                            onChange={e=>setEditName(e.target.value)}
                                        />
                                    ) : name}
                                </td>
                            </tr>
                            <tr className="h-2"></tr>
                            <tr className="bg-admin-primary">
                                <td className="p-2">Last Name(s):</td>
                                <td className="text-almost-white">
                                    {editCustomer ? (
                                            <input
                                                type="text"
                                                className="text-almost-black px-2 rounded-md w-5/6"
                                                value={editLastName}
                                                onChange={e=>setEditLastName(e.target.value)}
                                            />
                                        ) : lastName}
                                </td>
                            </tr>
                            <tr className="h-2"></tr>
                            <tr className="bg-admin-primary">
                                <td className="p-2">Email:</td>
                                <td className="text-almost-white break-all">
                                    {editCustomer ? (
                                            <input
                                                type="email"
                                                className="text-almost-black px-2 rounded-md w-5/6"
                                                value={editEmail}
                                                onChange={e=>setEditEmail(e.target.value)}
                                            />
                                        ) : email}
                                </td>
                            </tr>
                            <tr className="h-2"></tr>
                            <tr className="bg-admin-primary">
                                <td className="p-2">Telephone:</td>
                                <td className="text-almost-white break-all">
                                    {editCustomer ? (
                                            <input
                                                type="text"
                                                className="text-almost-black px-2 rounded-md w-5/6"
                                                value={editPhoneNumber}
                                                onChange={e=>setEditPhoneNumber(e.target.value)}
                                            />
                                        ) : phoneNumber && phoneNumber}
                                </td>
                            </tr>
                            <tr className="h-2"></tr>
                            <tr className="bg-admin-primary">
                                <td className="p-2">Assets:</td>
                                <td className="text-almost-white">
                                    <ul>
                                        {assets?.length ? assets.map((item)=> 
                                            <li 
                                                className="hover:text-admin-light hover:cursor-pointer"
                                                key={item._id}
                                                onClick={()=>navigate(`/admin-console/items/${item._id}`)}
                                            >{item.customId} - {item.name}</li>)
                                        :
                                        <li>No items available</li>}
                                    </ul>
                                </td>
                            </tr>
                            <tr className="h-2"></tr>
                            <tr className="bg-admin-primary">
                                <td className="p-2">Last Orders:</td>
                                <td className="text-almost-white">
                                    {orders?.length ? orders.map((order, index)=>{
                                        if(index<4){
                                            return (
                                                <li 
                                                    className="list-none mb-4" 
                                                    key={order._id}
                                                >
                                                    <span 
                                                        className="text-admin-light hover:text-almost-white hover:cursor-pointer"
                                                        onClick={()=>navigate(`/admin-console/orders/${order._id}`)}
                                                    >{order.customId}</span> - {order.title}
                                                </li>)
                                        }
                                        else return null
                                    })
                                    :
                                    <li className="list-none">No orders available</li>}
                                </td>
                            </tr>
                        </tbody>
                </table>
                </div>
                <div className="px-3">
                    {msg && <Alert alert={alert}/>}
                </div>
                {
                    editCustomer ? (
                        <div className="px-3 flex gap-10">
                            <button
                                type="button"
                                className="my-3 p-2 bg-admin-primary text-almost-white font-bold uppercase rounded-md w-1/3 hover:bg-user-primary"
                                onClick={()=>setEditCustomer(false)}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="my-3 p-2 bg-admin-light text-almost-black font-bold uppercase rounded-md w-1/3 hover:bg-admin-light-h"
                                onClick={handleUpdateCustomer}
                            >
                                Update
                            </button>
                        </div>
                    )
                    :(
                        <div className="flex gap-3 px-3">
                            <button
                                type="button"
                                className="my-3 p-2 bg-user-secondary text-almost-white hover:bg-user-primary-h font-bold uppercase rounded-md w-1/3 transition-colors"
                                onClick={handleEditCustomer}
                            >Edit</button>
                            <button
                                type="button"
                                className="my-3 p2 bg-admin-light hover:bg-admin-light-h text-almost-black font-bold uppercase rounded-md w-1/3"
                                onClick={openClosePasswordResetDialog}
                            >Password Reset</button>
                            <button
                                type="button"
                                className="my-3 p-2 bg-red-700 hover:bg-red-600 text-almost-white font-bold uppercase rounded-md w-1/3"
                                onClick={openCloseDeleteUserDialog}
                            >
                                Delete
                            </button>
                        </div>
                    )
                }
            </div>
            <div className="bg-admin-primary md:mt-0 md:w-1/2 rounded-md mt-3 p-4 flex flex-col gap-2 overflow-y-scroll scrollbar-hide max-h-largeDashboard">
                <div>
                    <p className="text-white text-lg font-bold">Active orders:</p>
                    {activeOrders?.length  ? 
                        activeOrders.map(order =>(
                            <div key={order._id} className="bg-admin-secondary rounded-md p-2 text-almost-white mt-4">
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
                <div>
                <p className="text-white text-lg font-bold">Last Messages:</p>
                    {comments?.length ? 
                        comments.map( (comment, index) =>{
                            if(index<6){
                                return(
                                    <div key={comment._id} className={`${comment.adminRead ? "bg-admin-secondary" : "bg-indigo-700"} rounded-md p-2 text-almost-white mt-4`}>
                                        <div 
                                            className="text-admin-light hover:text-admin-light-h hover:cursor-pointer hover:bg-admin-primary w-fit p-1 rounded-md"
                                            onClick={()=>navigate(`/admin-console/orders/${comment.order._id}`)}
                                        >
                                            {comment.order.customId}
                                        </div>
                                        <p className="pl-1">{comment.comment}</p>
                                    </div>
                                )
                            }
                        })
                        :
                        <p className="bg-admin-secondary rounded-md p-2 text-almost-white mt-4">No comments available</p>
                    }
                </div>
            </div>
            <DialogPasswordReset handlePasswordReset={handlePasswordReset} />
            <DialogDeleteUser handleDeleteUser={handleDeleteUser} />
        </div>
  )
}

export default Customer