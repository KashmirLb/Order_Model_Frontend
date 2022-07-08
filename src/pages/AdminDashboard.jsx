import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import useData from "../hooks/useData"
import { formatDate } from "../helpers"
import Spinner from "../components/Spinner"
import DialogCreateUser from "../components/DialogCreateUser"

const AdminDashboard = () => {

  const { obtainComments, commentList, obtainLastViewedOrders, lastViewedOrders, dataLoading, openCloseUserDialog } = useData()

  const navigate = useNavigate()

  useEffect(()=>{
    const getComments = async () =>{
      await obtainComments("All")
      await obtainLastViewedOrders()
    }
    getComments()
  },[])

  const filterComments =
    commentList.length===0 ? 
      commentList :
        commentList.filter(comment => !comment.adminRead)
  
  return (
    <>
      <div className="flex md:w-1/2 justify-around">
        <button
          type="button"
          className="rounded-md px-10 bg-admin-light py-4 uppercase text-xl font-bold text-almost-black
          hover:bg-admin-light-h transition-colors mt-2"
          onClick={()=>navigate("/admin-console/orders/create")}
          >
            New Order
          </button>
        <button 
          type="button"
          className="rounded-md px-10 bg-user-primary py-4 uppercase text-xl font-bold text-almost-white 
          hover:bg-user-primary-h transition-colors mt-2"
          onClick={openCloseUserDialog}
        >
          New Customer
        </button>
      </div>
      <div className="text-almost-white p-2 flex flex-col gap-3">
        <div className="bg-admin-primary p-3 rounded-md">
          <div className="bg-admin-secondary rounded-md p-3 pt-0 ">
            <h2 className="text-admin-light text-2xl ml-5 font-bold">New Messages:</h2>
            <div className="bg-admin-primary p-2 max-h-smallDashboard overflow-y-scroll scrollbar-hide border-admin-primary border-4">
              {dataLoading ? <Spinner/> : filterComments?.length ? filterComments.map(comment=>(
                <div 
                  key={comment._id} 
                  className={`bg-user-primary hover:bg-user-secondary
                  group hover:cursor-pointer rounded-md px-3 py-2 my-2 md:flex`}
                  onClick={()=>navigate(`/admin-console/orders/${comment.order._id}`)}
                >
                  <div className="inline-block md:w-2/5 mr-4 py-2">
                    <p className="rounded-md group-hover:bg-admin-primary group-hover:px-2 group-hover:-mx-2 w-fit">{comment.order.customId}</p>
                    <p>{comment.user.name}, {comment.user.lastName}</p>
                    <div className="flex flex-wrap gap-2">
                      <p className="mt-3">{formatDate(comment.createdAt)}</p>
                    </div>
                  </div>
                  <div className="inline-block pl-1 bg-admin-primary w-full text-almost-white whitespace-pre-wrap">{comment.comment}</div>
                </div>
              )) 
              : 
              <div> No new messages.</div>
              }
            </div>
          </div>
        </div>
        <div className="bg-admin-primary p-3 rounded-md">
        <div className="bg-admin-secondary rounded-md p-3 pt-0 ">
            <h2 className="text-admin-light text-2xl ml-5 font-bold">Last Viewed Orders:</h2>
            <div className="p-2">
              <table className="table-fixed w-full text-center">
                    <thead className="p-2">
                      <tr className=" text-almost-white">
                        <th className="w-1/5">Custom ID</th>
                        <th className="w-1/5">Item</th>
                        <th className="w-1/5">Title</th>
                        <th className="w-1/5">Customer</th>
                        <th className="w-1/5">Last Update</th>
                      </tr>
                    </thead>
              </table>
            </div>
            <div className="bg-admin-primary p-2 max-h-smallDashboard overflow-hidden overflow-y-scroll scrollbar-hide border-admin-primary border-4">

              {dataLoading ? <Spinner/> : lastViewedOrders ? (
                <table className="table-fixed w-full">
                  
                  <tbody className=" border-admin-primary border-4 text-almost-white">
                    {lastViewedOrders.map(order=>(
                      <tr 
                        className="text-center bg-admin-secondary h-16 mt-1 border-8 border-admin-primary rounded-md hover:cursor-pointer hover:bg-user-primary" 
                        onClick={()=>navigate(`/admin-console/orders/${order._id}`)}
                        key={order._id}
                      >
                        <td className="py-1 text-admin-light">{order.customId}</td>
                        <td>{order.asset.customId} - {order.asset.name}</td>
                        <td>{order.title}</td>
                        <td>{order.customer.lastName}, {order.customer.name}</td>
                        <td>{formatDate(order.updatedAt)}</td>
                      </tr>
                    ))}
                  </tbody>
              
                </table>
              )
              : 
              <div> No new messages.</div>
              }
            </div>
          </div>
        </div>
      </div>
      <DialogCreateUser creatingOrder={false}/>
    </>
  )
}

export default AdminDashboard