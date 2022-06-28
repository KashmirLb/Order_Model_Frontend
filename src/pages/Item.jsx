import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import useData from "../hooks/useData"
import Spinner from "../components/Spinner"
import { formatDate } from "../helpers"

// Single item page just finished!!!!!

/*
    Created link to owner.
     ? Maybe create link from owner to items ???

     Next up: Create new order.
     > Single order page.
     > Create comments in order.

*/
const Item = () => {

    const [ itemLoading, setItemLoading ] = useState(true)
    const params = useParams()
    const navigate = useNavigate()

    const { dataLoading, obtainItemData, itemData } = useData()

    const { name, customId, description, owner, orders, createdAt } = itemData

    useEffect(()=>{

        const getItem = async () =>{
            await obtainItemData(params.id)
            setItemLoading(false)
        }
        getItem()
    },[params])

    const handleOwnerClick = () =>{
        navigate(`/admin-console/users/${owner._id}`)
    }

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
                                <td className="text-almost-white">{name}</td>
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
                                <td className="text-almost-white">{description && description}</td>
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
                <div className="flex gap-3 px-3">
                    <button
                        type="button"
                        className="my-3 p-2 bg-user-secondary text-almost-white font-bold uppercase rounded-md w-1/3"
                    >Edit</button>
                    <button
                        type="button"
                        className="my-3 p-2 bg-red-700 text-almost-white font-bold uppercase rounded-md w-1/3"
                    >
                        Delete
                    </button>
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
        </div>
  )
}

export default Item