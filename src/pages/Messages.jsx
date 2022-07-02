import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import useData from "../hooks/useData"
import DialogTimeFrame from "../components/DialogTimeFrame"
import Spinner from "../components/Spinner"
import { formatDate } from "../helpers"

const Messages = () => {

  const [ timeFrame, setTimeFrame ] = useState("Week")
  const [ searchOrder, setSearchOrder ] = useState("")
  const [ searchClient, setSearchClient ] = useState("")
  const [ readSelected, setReadSelected ] = useState(true)
  const [ loadingMessages, setLoadingMessages ] = useState(true)

  const navigate = useNavigate()

  const { setOpenDateDialog, obtainComments, commentList, dataLoading, commentIsRead } = useData()

  const bothFiltered = () =>{
    const filterCustomer =
      searchClient === "" ?
        commentList :
          commentList.filter(comment => 
            comment.user.name.toLowerCase().includes(searchClient.toLowerCase()) 
            || comment.user.lastName.toLowerCase().includes(searchClient.toLowerCase())
            || comment.user.customId.toLowerCase().includes(searchClient.toLowerCase()))

    const filterOrder =
      searchOrder === "" ?
        filterCustomer :
          filterCustomer.filter(comment => 
            comment.order.customId.toLowerCase().includes(searchOrder.toLowerCase()))

    const filterRead =
      readSelected ? 
        filterOrder :
          filterOrder.filter(comment => !comment.adminRead)

    return filterRead
  }

  useEffect(()=>{
    if(timeFrame==="Range"){
      setOpenDateDialog(true)
    }
  },[timeFrame])

  useEffect(()=>{
    obtainComments(timeFrame)
    setLoadingMessages(false)
  },[])

  const filteredList = bothFiltered()
    
  const handleSearch = () => {
    obtainComments(timeFrame)
  }

  const handleRead = () => {
    setReadSelected(!readSelected)
  }

  const handleMessageClick = (e, id)=>{
      if(e.target.tagName==="button" || e.target.tagName==="svg" || e.target.tagName==="path"){
        return
      }
      navigate(`/admin-console/orders/${id}`)
  }

  return (
    <>
      <div className="p-3">
        <div className="bg-admin-primary rounded-md p-3 text-admin-light md:flex md:flex-wrap">
          <div className="mt-3 md:my-2">
            <label className="pl-6 pr-2">Order:</label>
            <input 
              type="text" 
              className="bg-admin-secondary border border-admin-light text-almost-white px-1"
              value={searchOrder}
              onChange={e=>setSearchOrder(e.target.value)}
            />
          </div>
          <div className="mt-3 md:my-2">
            <label className="pl-6 pr-2">Client:</label>
            <input 
              type="text" 
              className="bg-admin-secondary border border-admin-light text-almost-white px-1" 
              value={searchClient}
              onChange={e=>setSearchClient(e.target.value)}
            />
          </div>
          <div className="mt-3 md:my-2 md:text-center pr-4"><label className="pl-6 pr-2">Read: </label><input onChange={handleRead} type="checkbox" defaultChecked={true} className="bg-admin-secondary border border-admin-light"/></div>
          
          <div className="mt-3 md:my-2"><label className="pl-6 pr-2">Show: </label>
            <select type="combobox" className="bg-admin-secondary border border-admin-light text-almost-white px-2"
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
              className="bg-admin-secondary border border-black text-almost-white ml-4 px-4 hover:bg-user-primary transition-colors"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>
        </div>
        <div className="bg-admin-primary rounded-md p-3 text-admin-light mt-3 overflow-y-scroll scrollbar-hide max-h-dashboard">

          { dataLoading || loadingMessages ? <div className="flex justify-center"> <Spinner/></div> :
          
            filteredList?.length ? filteredList.map( comment =>(

              <div 
                key={comment._id} 
                className={`${comment.adminRead ? "bg-admin-secondary hover:bg-admin-secondary-h" : "bg-user-primary hover:bg-user-secondary"}
                  group hover:cursor-pointer rounded-md px-3 py-2 my-2 md:flex`}
                onClick={(e)=>handleMessageClick(e, comment.order._id)}
              >
                <div className="inline-block md:w-2/5 mr-4 py-2">
                  <p className="rounded-md group-hover:bg-admin-primary group-hover:px-2 group-hover:-mx-2 w-fit">{comment.order.customId}</p>
                  <p>{comment.user.name}, {comment.user.lastName}</p>
                  <div className="flex flex-wrap gap-2">
                    <p className="mt-3">{formatDate(comment.createdAt)}</p>
                    {comment.adminRead ? "" : (
                      <button className="bg-user-secondary hover:bg-admin-light hover:cursorp-1 m-1 text-almost-white rounded-md z-10" type="button" onClick={()=>commentIsRead(comment._id)}>
                        <svg xmlns="http://www.w3.org/2000/svg" id="adminRead"  className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
                <div className="inline-block pl-1 bg-admin-primary w-full text-almost-white whitespace-pre-wrap">{comment.comment}</div>
              </div>
            ))
              :
              <div className="bg-admin-secondary rounded-md px-3 py-2 text-almost-white text-center font-bold"> No comments found with this filter </div> 
            }
        </div>
      </div>
      <DialogTimeFrame setTimeFrame={setTimeFrame}/>
    </>
  )
}

export default Messages