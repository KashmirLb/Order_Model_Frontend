import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import useData from "../hooks/useData"
import DialogTimeFrame from "../components/DialogTimeFrame"
import Spinner from "../components/Spinner"
import { formatDate } from "../helpers"
import useUser from "../hooks/useUser"

const UserMessages = () => {

  const [ timeFrame, setTimeFrame ] = useState("Week")
  const [ searchOrder, setSearchOrder ] = useState("")
  const [ readSelected, setReadSelected ] = useState(true)
  const [ loadingMessages, setLoadingMessages ] = useState(true)

  const navigate = useNavigate()

  const { setOpenDateDialog } = useData()
  const { userObtainComments, userCommentList } = useUser()

  const bothFiltered = () =>{

    const filterOrder =
      searchOrder === "" ?
        userCommentList :
          userCommentList.filter(comment => 
            comment.order.customId.toLowerCase().includes(searchOrder.toLowerCase()))

    const filterRead =
      readSelected ? 
        filterOrder :
          filterOrder.filter(comment => !comment.userRead)

    return filterRead
  }

  useEffect(()=>{
    if(timeFrame==="Range"){
      setOpenDateDialog(true)
    }
  },[timeFrame])

  useEffect(()=>{
    userObtainComments(timeFrame)
    setLoadingMessages(false)
  },[])

  const filteredList = bothFiltered()
    
  const handleSearch = () => {
    userObtainComments(timeFrame)
  }

  const handleRead = () => {
    setReadSelected(!readSelected)
  }

  return (
    <>
      <div className="p-2">
        <div className="bg-user-primary rounded-md p-3 text-user-light md:flex md:flex-wrap">
          <div className="mt-3 md:my-2">
            <label className="pl-6 pr-2">Order:</label>
            <input 
              type="text" 
              className="bg-user-secondary border border-user-light text-almost-white px-1"
              value={searchOrder}
              onChange={e=>setSearchOrder(e.target.value)}
            />
          </div>
          <div 
            className="mt-3 md:my-2 md:text-center pr-4"
          >
            <label className="pl-6 pr-2">Read: </label>
            <input 
              onChange={handleRead} 
              type="checkbox" 
              defaultChecked={true} 
              className="bg-user-secondary border border-user-light"
            />
          </div>
          <div className="mt-3 md:my-2"><label className="pl-6 pr-2">Show: </label>
            <select type="combobox" className="bg-user-secondary border border-user-light text-almost-white px-2"
            value={Array.isArray(timeFrame) ? "Time frame selected" : timeFrame} onChange={e => setTimeFrame(e.target.value)}>
              <option value="Day">Today</option>
              <option value="Week">This Week</option>
              <option value="Month">This Month</option>
              <option value="Three Months">Three Months</option>
              <option value="Six Months">Six Months</option>
              <option value="All">All</option>
              {
                Array.isArray(timeFrame) ? (
                  <option value="Time frame selected">Time Frame Selected</option>
                )
                :
                (
                  <option value="Range">Select range...</option>
                )
              }
            </select>
          </div>
          <div className="flex items-end mt-3 md:my-2">
            <button
              type="button"
              className="bg-user-secondary border border-black text-almost-white ml-4 px-4 hover:bg-user-primary transition-colors"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>
        </div>
        <div className="bg-user-secondary rounded-md p-3 text-user-light mt-3 overflow-y-scroll scrollbar-hide max-h-dashboard">

          { loadingMessages ? <div className="flex justify-center"> <Spinner/></div> :
          
            filteredList?.length ? filteredList.map( comment =>(

              <div 
                key={comment._id} 
                className={`${comment.userRead ? "bg-user-primary hover:bg-user-primary-h" : "bg-sky-700 hover:bg-sky-600"}
                  group hover:cursor-pointer rounded-md px-3 py-2 my-2 md:flex`}
                onClick={()=>navigate(`/user/orders/${comment.order._id}`)}
              >
                <div className="inline-block md:w-2/5 mr-4 py-2">
                  <p className="rounded-md group-hover:bg-user-primary group-hover:px-2 group-hover:-mx-2 w-fit">{comment.order.customId}</p>
                  <p>{comment.admin.name}</p>
                  {!comment.userRead && <p className="text-admin-light text-lg">New Message!</p>}
                  <p className="mt-3">{formatDate(comment.createdAt)}</p>
                </div>
                <div className="inline-block pl-1 bg-user-secondary w-full text-almost-white whitespace-pre-wrap">{comment.comment}</div>
              </div>
            ))
              :
              <div className="bg-user-secondary rounded-md px-3 py-2 text-almost-white text-center font-bold"> No comments found with this filter </div> 
            }
        </div>
      </div>
      <DialogTimeFrame setTimeFrame={setTimeFrame}/>
    </>
  )
}

export default UserMessages