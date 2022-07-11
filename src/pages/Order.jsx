import { useEffect, useState, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import useData from "../hooks/useData"
import Spinner from "../components/Spinner"
import Alert from "../components/Alert"
import { formatDate } from "../helpers"
import useAuth from "../hooks/useAuth"

const Order = () => {

  const [ alert, setAlert ] = useState({})
  const [ orderLoading, setOrderLoading ] = useState(true)
  const [ commentText, setCommentText ] = useState("")
  const [ editingOrder, setEditingOrder ] = useState(false)
  const [ updatedDescription, setUpdatedDescription ] = useState("")
  const [ updatedStatus, setUpdatedStatus ] = useState("")

  const firstLoad = useRef("")

  const params = useParams()
  const navigate = useNavigate()

  const { orderData, obtainOrderData, setOrderData, commentIsRead, createComment, updateOrder, addLastViewedOrder } = useData()
  const { auth } = useAuth()

  useEffect(()=>{
    setOrderData({})
    if(firstLoad.current!==params.id){
      addLastViewedOrder(params.id)
      firstLoad.current = params.id

      const getData = async () =>{
        await obtainOrderData(params.id)
      }
      getData()
    }
    setOrderLoading(false)
  },[params])

  const handleCommentRead = async comment =>{
  
    if(comment.adminRead===false){
      comment.adminRead=true
      await commentIsRead(comment._id)
    }
  }

  const handleEditing = () =>{
    setUpdatedDescription(orderData.description)
    setUpdatedStatus(orderData.status)
    setEditingOrder(true)
  }

  const handleUpdateOrder = async () =>{

    if(updatedDescription===""){
      setEditingOrder(false)
      return
    }

    const updatedOrder = {...orderData}
    updatedOrder.description = updatedDescription
    updatedOrder.status = updatedStatus
    
    try {
      const commentAdded = await updateOrder(updatedOrder)

      if(commentAdded){
        commentAdded.admin = { name: auth.name}
        updatedOrder.comments = [commentAdded, ...updatedOrder.comments]
      }
      setOrderData(updatedOrder)
      setAlert({
        msg: "Updated correctly",
        error: false
      })
      
    } catch (error) {
      console.log(error)
      setAlert({
        msg: "Update failed",
        error: true
      })
    }
    setUpdatedDescription("")
    setUpdatedStatus("")
    setEditingOrder(false)

    setTimeout(()=>{
      setAlert({})
    },1500)
  }

  const handleCommentSubmit = async e =>{
    e.preventDefault()

    await createComment({
      order: orderData._id,
      comment: commentText
    })
    setOrderLoading(true)
    await obtainOrderData(params.id)
    setCommentText("")
    setOrderLoading(false)
  }
   
  const { msg } = alert
  return (
    <>
      {
        orderLoading || !orderData.title ? <Spinner /> :(

          <div className="p-3 md:grid md:grid-cols-2 gap-2">
            <div className="bg-admin-primary w-full rounded-md  text-admin-light p-4 h-fit">
              <div className="flex justify-between">
                <h1 className="font-bold text-2xl">{orderData.customId}</h1>
                {
                  !editingOrder && (
                    <button 
                      type="button"
                      className="text-almost-white hover:text-admin-light"
                      onClick={handleEditing}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                  )
                }
              </div>
              <p className="text-almost-white py-2 text-lg font-bold">{orderData.title}</p>
              <div>Customer: 
                <span 
                  className="text-almost-white hover:text-admin-light hover:cursor-pointer"
                  onClick={()=>navigate(`/admin-console/users/${orderData.customer._id}`)}
                > {orderData.customer.lastName}, {orderData.customer.name}
                </span>
              </div>
              <div>Item: 
                <span 
                  className="text-almost-white hover:text-admin-light hover:cursor-pointer"
                  onClick={()=>navigate(`/admin-console/items/${orderData.asset._id}`)}
                > {orderData.asset.customId} - {orderData.asset.name}
                </span>
              </div>
              <p className="text-lg py-2 font-bold">Description:</p>
              <p className="text-almost-white p-3 border border-admin-light rounded-md whitespace-pre-wrap">
                {editingOrder ? (
                  <textarea 
                    className="w-full text-almost-black p-2 rounded-sm bg-gray-50 h-24"
                    value={updatedDescription}
                    onChange={e=>setUpdatedDescription(e.target.value)}
                  />
                )
                :
                orderData.description}
              </p>
              <div className="py-5 text-lg font-bold uppercase">
                Status: 
                { editingOrder ? (
                  <select 
                    className="text-admin-light px-2 mx-2 border border-admin-light rounded-sm bg-admin-secondary"
                    value={updatedStatus}
                    onChange={e=>setUpdatedStatus(e.target.value)}
                  >
                    <option value="Open">Open</option>
                    <option value="Finished">Finished</option>
                    <option value="Closed">Closed</option>
                  </select>
                )
              :
                <span className="text-almost-white px-2">{orderData.status}</span>
              }
              </div>
              { editingOrder && (
                 <div className="mt-2 flex gap-10">
                  <button
                    type="button"
                    className="rounded-md px-8 bg-admin-secondary py-2 text-sm font-medium text-almost-white hover:bg-user-primary transition-colors"
                    onClick={()=>setEditingOrder(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="rounded-md px-8 bg-indigo-700 py-2 text-sm text-almost-white font-bold hover:bg-indigo-500 transition-colors"
                    onClick={handleUpdateOrder}
                  >
                    Update
                  </button>
                </div>
              )}
              {msg && <Alert alert={alert}/>}
            </div>
            <div className="bg-admin-primary w-full rounded-md">
              <div className="md:mt-0 rounded-md mt-3 p-4 flex flex-col gap-2 max-h-largeDashboard w-full">
                <div className="overflow-y-scroll scrollbar-hide">
                  <p className="text-white text-lg font-bold">Comments:</p>
                    {orderData.comments?.length  ? 
                      orderData.comments.map(comment =>(
                        <div key={comment._id} className={`${comment.adminRead ? "bg-admin-secondary" : "bg-indigo-700"} rounded-md p-2 mt-4 text-almost-white`} onMouseOver={()=>handleCommentRead(comment)}>
                            <p className={comment?.user ? "text-user-light" : "text-admin-light"}> 
                              {comment?.user ? `${comment.user.name} ${comment.user.lastName}` : comment.admin.name}
                              <span className="text-almost-white text-xs pl-2"> {formatDate(comment.createdAt)}</span>
                            </p>
                            <p className="p-2 bg-admin-primary mt-2 whitespace-pre-wrap">
                              {comment.comment}
                            </p>
                        </div>
                      ))
                      :
                        <p className="bg-admin-secondary text-admin-light rounded-md p-2 mt-4">No comments yet</p>
                    }
                </div>
                <div>
                  <p className="text-white text-lg font-bold">New comment:</p>
                  <form
                    className="px-2 py-4 bg-admin-secondary  rounded-md mt-2"
                    onSubmit={handleCommentSubmit}
                  >
                    <textarea 
                      className="w-full p-2 rounded-sm bg-gray-50 h-24"
                      value={commentText}
                      onChange={e=>setCommentText(e.target.value)}
                    />
                    <button
                      type="submit"
                      className="rounded-md px-8 mt-3 mx-4 bg-admin-light py-2 text-sm text-almost-black font-bold hover:bg-admin-light-h transition-colors"
                    >
                      POST
                    </button>
                  </form>    
                </div>
              </div>
            </div>
          </div>
        )
      }
    </>
  )
}

export default Order