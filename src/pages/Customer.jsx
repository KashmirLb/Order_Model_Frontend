import { useEffect } from "react"
import { useParams } from "react-router-dom"
import useData from "../hooks/useData"
import { formatDate } from "../helpers"
import Spinner from "../components/Spinner"
import { useState } from "react"

const Customer = () => {

    const [ customerLoading, setCustomerLoading ] = useState(true)
    const params = useParams()

    const { dataLoading, obtainCustomerData, customerData } = useData()

    const { name, lastName, email, customId, comments, assets, orders, activeOrders } = customerData

    

    useEffect(()=>{

        const getCustomer = async () =>{
            await obtainCustomerData(params.id)
            setCustomerLoading(false)
        }
        getCustomer()
    },[params])


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
                                <td className="text-almost-white">{name}</td>
                            </tr>
                            <tr className="h-2"></tr>
                            <tr className="bg-admin-primary">
                                <td className="p-2">Last Name(s):</td>
                                <td className="text-almost-white">{lastName}</td>
                            </tr>
                            <tr className="h-2"></tr>
                            <tr className="bg-admin-primary">
                                <td className="p-2">Email:</td>
                                <td className="text-almost-white break-all">{email}</td>
                            </tr>
                            <tr className="h-2"></tr>
                            <tr className="bg-admin-primary">
                                <td className="p-2">Assets:</td>
                                <td className="text-almost-white">
                                    <ul>
                                        {assets?.length ? assets.map((item)=> <li key={item._id}>{item.customId} - {item.name}</li>)
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
                                            return <li className="list-none mb-4" key={order._id}><span className="text-admin-light">{order.customId}</span> - {order.title}</li>
                                        }
                                        else return null
                                    })
                                    :
                                    <li className="list-none">No items available</li>}
                                </td>
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
                        className="my-3 p2 bg-admin-light text-almost-black font-bold uppercase rounded-md w-1/3"
                    >Password Reset</button>
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
                                        <div className="text-admin-light hover:text-admin-light-h hover:cursor-pointer hover:bg-admin-primary w-fit p-1 rounded-md">{comment.order.customId}</div>
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
        </div>
  )
}

export default Customer