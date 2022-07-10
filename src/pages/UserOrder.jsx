import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import Spinner from "../components/Spinner"
import { formatDate } from "../helpers"
import useUser from "../hooks/useUser"

const UserOrder = () => {

  const [ orderLoading, setOrderLoading ] = useState(true)
  const [ commentText, setCommentText ] = useState("")

  const params = useParams()
  const navigate = useNavigate()

  const { userCommentIsRead, userObtainOrderData, userOrderData, setUserOrderData, userCreateComment } = useUser()

  useEffect(()=>{
    setUserOrderData({})
      const getData = async () =>{
        await userObtainOrderData(params.id)
      }
      getData()
    
    setOrderLoading(false)
  },[params])

  const handleCommentRead = async comment =>{
  
    if(comment.userRead===false){
      comment.userRead=true
      await userCommentIsRead(comment._id)
    }
  }

  const handleCommentSubmit = async e =>{
    e.preventDefault()

    await userCreateComment({
      order: userOrderData._id,
      comment: commentText,
    })
    setOrderLoading(true)
    await userObtainOrderData(params.id)
    setCommentText("")
    setOrderLoading(false)
  }

  return (
    <>
      {
        orderLoading || !userOrderData.title ? <Spinner /> :(

          <div className="p-3 md:grid md:grid-cols-2 gap-2">
            <div className="bg-user-primary w-full rounded-md  text-sky-200 p-4 h-fit">
              <div className="flex justify-between">
                <h1 className="font-bold text-2xl">{userOrderData.customId}</h1>
              </div>
              <p className="text-almost-white py-2 text-lg font-bold">{userOrderData.title}</p>
              <div>Customer: 
                <span 
                  className="text-almost-white hover:text-user-light hover:cursor-pointer"
                  onClick={()=>navigate(`/user/profile`)}
                > {userOrderData.customer.lastName}, {userOrderData.customer.name}
                </span>
              </div>
              <div>Item: 
                <span 
                  className="text-almost-white hover:text-user-light hover:cursor-pointer"
                  onClick={()=>navigate(`/user/items/${userOrderData.asset._id}`)}
                > {userOrderData.asset.customId} - {userOrderData.asset.name}
                </span>
              </div>
              <p className="text-lg py-2 font-bold">Description:</p>
              <p className="text-almost-white p-3 border border-user-light rounded-md whitespace-pre-wrap">
                {userOrderData.description}
              </p>
              <div className="py-5 text-lg font-bold uppercase">
                Status: 
                <span className="text-almost-white px-2">{userOrderData.status}</span>
              </div>
            </div>
            <div className="bg-user-primary w-full rounded-md">
              <div className="md:mt-0 rounded-md mt-3 p-4 flex flex-col gap-2 max-h-largeDashboard w-full">
                <div className="overflow-y-scroll scrollbar-hide">
                  <p className="text-white text-lg font-bold">Comments:</p>
                    {userOrderData.comments?.length  ? 
                      userOrderData.comments.map(comment =>(
                        <div key={comment._id} className={`${comment.userRead ? "bg-user-secondary" : "bg-sky-700"} rounded-md p-2 mt-4 text-almost-white`} onMouseOver={()=>handleCommentRead(comment)}>
                            <p className={comment?.user ? "text-user-light" : "text-admin-light"}> 
                              {comment?.user ? `${comment.user.name} ${comment.user.lastName}` : comment.admin.name}
                              <span className="text-almost-white text-xs pl-2"> {formatDate(comment.createdAt)}</span>
                            </p>
                            <p className="p-2 bg-user-primary mt-2 whitespace-pre-wrap">
                              {comment.comment}
                            </p>
                        </div>
                      ))
                      :
                        <p className="bg-user-secondary text-user-light rounded-md p-2 mt-4">No comments yet</p>
                    }
                </div>
                <div>
                  <p className="text-white text-lg font-bold">New comment:</p>
                  <form
                    className="px-2 py-4 bg-user-secondary rounded-md mt-2"
                    onSubmit={handleCommentSubmit}
                  >
                    <textarea 
                      className="w-full p-2 rounded-sm bg-gray-50 h-24"
                      value={commentText}
                      onChange={e=>setCommentText(e.target.value)}
                    />
                    <button
                      type="submit"
                      className="rounded-md px-8 mt-3 mx-4 bg-user-light py-2 text-sm text-almost-black font-bold hover:bg-almost-white transition-colors"
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

export default UserOrder