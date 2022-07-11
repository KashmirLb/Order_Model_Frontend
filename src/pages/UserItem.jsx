import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import Spinner from "../components/Spinner"
import { formatDate } from "../helpers"
import useUser from "../hooks/useUser"


const UserItem = () => {

    const [ itemLoading, setItemLoading ] = useState(true)

    const params = useParams()
    const navigate = useNavigate()

    const { userObtainItemData, userItemData } = useUser()

    const { name, customId, description, owner, orders, createdAt } = userItemData

    useEffect(()=>{
        const getItem = async () =>{
            await userObtainItemData(params.id)
            setItemLoading(false)
        }
        getItem()
    },[params])

    const handleOwnerClick = () =>{
        navigate(`/user/profile`)
    }

  return (
        itemLoading || !name ? <Spinner/> :
        <div className="md:flex gap-3 pt-2">
            <div className="bg-user-secondary md:w-1/2 rounded-md">
                <div className="p-5 break-normal">
                    <table className="table-fixed w-full">
                        <tbody className="text-lg text-user-light rounded-md">
                            <tr className="bg-user-primary">
                                <td className="p-2">ID:</td>
                                <td className="text-almost-white p-2 ">{customId}</td>
                            </tr>
                            <tr className="h-2"></tr>
                            <tr className="bg-user-primary">
                                <td className="p-2">Item name:</td>
                                <td className="text-almost-white">
                                  {name}
                                </td>
                            </tr>
                            <tr className="h-2"></tr>
                            <tr className="h-2"></tr>
                            <tr className="bg-user-primary">
                                <td className="p-2">Owner:</td>
                                <td className="text-almost-white hover:text-user-light hover:cursor-pointer" onClick={handleOwnerClick}>{owner.lastName}, {owner.name}</td>
                            </tr>
                            <tr className="h-2"></tr>
                            <tr className="bg-user-primary">
                                <td className="p-2">Description:</td>
                                <td className="text-almost-white whitespace-pre-wrap w-full">
                                    {description && description}
                                </td>
                            </tr>
                            <tr className="h-2"></tr>
                            
                            <tr className="h-2"></tr>
                            <tr className="bg-user-primary">
                                <td className="p-2">Date added:</td>
                                <td className="text-almost-white">{formatDate(createdAt)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="bg-user-primary md:mt-0 md:w-1/2 rounded-md mt-3 p-4 flex flex-col gap-2">
                <div>
                    <p className="text-white text-lg font-bold">Assigned Orders:</p>
                    {orders.length ? orders.map(order =>(
                            <div key={order._id} className={`${order.status==="Closed" ? "bg-user-secondary" : "bg-sky-700"} rounded-md p-2 text-almost-white mt-4`}>
                                <div className=" grid grid-flow-col gap-4">
                                    <div className="text-user-light">
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
                                        className="bg-user-primary text-user-light p-2 mt-2 rounded-md hover:bg-user-primary-h  transition-colors"
                                        onClick={()=>navigate(`/user/orders/${order._id}`)}
                                    >See order</button>
                                    <p className="text-user-light "> Last update:<span className="text-almost-white ml-5">{formatDate(order.updatedAt)}</span></p>
                                </div>
                            </div>
                        ))
                        :
                        <p className="bg-user-secondary rounded-md p-2 text-almost-white mt-4">No active orders</p>
                    }
                </div>
            </div>
        </div>
  )
}

export default UserItem