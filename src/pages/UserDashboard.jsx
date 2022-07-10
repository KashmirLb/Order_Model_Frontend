import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import useData from "../hooks/useData"
import { formatDate } from "../helpers"
import Spinner from "../components/Spinner"
import DialogCreateUser from "../components/DialogCreateUser"
import useUser from "../hooks/useUser"

const UserDashboard = () => {

  const { obtainLastViewedOrders, lastViewedOrders, dataLoading, openCloseUserDialog } = useData()
  const { userObtainComments, userCommentList, obtainUserOrders, userOrders } = useUser()

  const navigate = useNavigate()

  useEffect(()=>{
    const getComments = async () =>{
      await userObtainComments("All")
      await obtainUserOrders("All")
    }
    getComments()
  },[])

  const filterComments =
    userCommentList.length===0 ? 
      userCommentList :
        userCommentList.filter(comment => !comment.userRead)

  const filterOrders = 
    userOrders.length===0 ?
      userOrders :
        userOrders.filter(order => order.status==="Open" || order.status==="Finished")
  
  return (
    <>
      <div className="text-almost-white p-2 flex flex-col gap-3">
        <div className="bg-user-primary rounded-md p-3">
          <h2 className="text-user-light text-2xl ml-5 font-bold">New Messages:</h2>
          <div className="bg-user-secondary p-2 max-h-smallDashboard overflow-y-scroll scrollbar-hide border-user-primary border-4">
            {dataLoading ? <Spinner/> : filterComments?.length ? filterComments.map(comment=>(
              <div 
                key={comment._id} 
                className={`bg-user-primary hover:bg-user-primary-h
                group hover:cursor-pointer rounded-md px-3 py-2 my-2 md:flex`}
                onClick={()=>navigate(`/user/orders/${comment.order._id}`)}
              >
                <div className="inline-block md:w-2/5 mr-4 py-2">
                  <p className="rounded-md group-hover:bg-user-primary group-hover:px-2 group-hover:-mx-2 w-fit">{comment.order.customId}</p>
                  <p>{comment.admin.name}</p>
                  <div className="flex flex-wrap gap-2">
                    <p className="mt-3">{formatDate(comment.createdAt)}</p>
                  </div>
                </div>
                <div className="inline-block pl-1 bg-user-secondary w-full text-almost-white whitespace-pre-wrap">{comment.comment}</div>
              </div>
            )) 
            : 
            <div> No new messages.</div>
            }
          </div>
        </div>
        <div className="bg-user-primary rounded-md p-3">
          <h2 className="text-user-light text-2xl ml-5 font-bold">Active Orders:</h2>
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
          <div className="bg-user-secondary p-2 max-h-smallDashboard overflow-hidden overflow-y-scroll scrollbar-hide border-user-primary border-4">
            {dataLoading ? <Spinner/> : filterOrders.length ? (
              <table className="table-fixed w-full">
                
                <tbody className=" border-user-primary border-4 text-almost-white">
                  {filterOrders.map(order=>(
                    <tr 
                      className="text-center bg-user-secondary h-16 mt-1 border-2 border-user-primary rounded-md hover:cursor-pointer hover:bg-user-primary" 
                      onClick={()=>navigate(`/user/orders/${order._id}`)}
                      key={order._id}
                    >
                      <td className="py-1 text-user-light">{order.customId}</td>
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
      <DialogCreateUser creatingOrder={false}/>
    </>
  )
}

export default UserDashboard