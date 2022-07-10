import useData from "../hooks/useData"
import { useState, useEffect } from "react"
import DialogTimeFrame from "../components/DialogTimeFrame"
import { formatDate } from "../helpers"
import Spinner from "../components/Spinner"
import { useNavigate } from "react-router-dom"
import useUser from "../hooks/useUser"

const UserOrders = () => {

  const [ timeFrame, setTimeFrame ] = useState("All")
  const [ searchOrder, setSearchOrder ] = useState("")
  const [ orderStatus, setOrderStatus ] = useState("All Active")
  const [ selectSort, setSelectSort ] = useState("Last created")
  const [ loadingOrders, setLoadingOrders ] = useState(true)

  const navigate = useNavigate()

  const { setOpenDateDialog } = useData()
  const { obtainUserOrders, userOrders, sortUserOrders } = useUser()

  const bothFiltered = () =>{

    const filterOrder =
      userOrders === "" ?
        userOrders :
          userOrders.filter(order => 
            order.customId.toLowerCase().includes(searchOrder.toLowerCase()))

    const filterStatus =
      orderStatus==="All" ? 
        filterOrder :
            orderStatus==="All Active" ?
              filterOrder.filter(order => 
                order.status==="Open" || order.status==="Finished")
              :
              filterOrder.filter(order => 
                order.status===orderStatus)

    return filterStatus
  }

  useEffect(()=>{
    if(timeFrame==="Range"){
      setOpenDateDialog(true)
    }
  },[timeFrame])

  useEffect(()=>{
    obtainUserOrders(timeFrame)
    setLoadingOrders(false)
  },[])

  useEffect(()=>{
    sortUserOrders(selectSort)
  },[selectSort])

  const filteredList = bothFiltered()
    
  const handleSearch = () => {
    obtainUserOrders(timeFrame)
    setSelectSort("Last created")
  }

  return (
    <>
      <div className="p-2">
        <div className="bg-user-secondary rounded-md p-3 text-user-light md:flex md:flex-wrap">
          <div className="mt-3 md:my-2">
            <label className="pl-6 pr-2">Order:</label>
            <input 
              type="text" 
              className="bg-user-primary border border-user-light text-almost-white px-1"
              value={searchOrder}
              onChange={e=>setSearchOrder(e.target.value)}
            />
          </div>
          <div className="mt-3 md:my-2"><label className="pl-6 pr-2">Show: </label>
            <select type="combobox" className="bg-user-primary border border-user-light text-almost-white px-2"
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
          <div className="mt-3 md:my-2"><label className="pl-6 pr-2">Status: </label>  
            <select 
              type="combobox" 
              className="bg-user-primary border border-user-light text-almost-white px-2"
              value={orderStatus} 
              onChange={e => setOrderStatus(e.target.value)}
            >
              <option value="Open">Open</option>
              <option value="Finished">Finished</option>
              <option value="Closed">Closed</option>
              <option value="All Active">All Active</option>
              <option value="All">All</option>
            </select>
          </div>
          <div className="flex items-end mt-3 md:my-2">
            <button
              type="button"
              className="bg-user-primary border border-black text-almost-white ml-4 px-4 hover:bg-user-secondary transition-colors"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>
        </div>
        <div className="bg-user-secondary rounded-md p-3 text-user-light mt-3">
          <div className="pr-4 mb-2">
            <label className="pl-6 pr-2">Sort by: </label>
            <select 
              className="bg-user-primary border border-user-light text-almost-white"
              value={selectSort}
              onChange={e=>setSelectSort(e.target.value)}
            >
              <option>Last created</option>
              <option>Last updated</option>
            </select>
          </div>
          <div className="overflow-y-scroll scrollbar-hide max-h-dashboard">

            {loadingOrders ? <div className="flex justify-center"> <Spinner/></div> :
          
            filteredList?.length ? filteredList.map( order =>(

              <div key={order._id} 
                className={`${!order.comments[0]?.userRead && order.comments[0] ? "bg-sky-800 hover:bg-sky-700" : 
                "bg-user-primary hover:bg-user-primary-h"} group hover:cursor-pointer rounded-md px-3 py-2 my-2 md:flex`}
                onClick={()=>navigate(order._id)}
              >
                <div className="inline-block md:w-2/5 mr-4 py-2">
                  <p className="rounded-md group-hover:bg-user-secondary group-hover:px-2 group-hover:-mx-2 w-fit">{order.customId}</p>
                  <p>{order.customer.lastName}, {order.customer.name}</p>
                  <p>{order.asset && order.asset?.name}</p>
                  <div className="flex flex-wrap gap-2">
                    <p 
                      className={`${!order.comments[0]?.userRead && order.comments[0] && "text-admin-light"} mt-3`}
                    >{!order.comments[0]?.userRead ? order.comments[0] ? "New Message!" : "No messages" : `Last update: ${formatDate(order.comments[0]?.createdAt)}`}</p>
                  </div>
                  <p className="text-almost-white text-lg mt-3">{order.status}</p>
                  <p className="text-almost-white text-lg mt-3">{formatDate(order.createdAt)}</p>
                </div>
                <div className="inline-block pl-1 bg-user-secondary w-full text-almost-white whitespace-pre-wrap">{order.description}</div>
              </div>
            ))
              :
              <div className="bg-user-primary rounded-md px-3 py-2 text-almost-white text-center font-bold"> No orders found with this filter </div> 
            }
          </div>
        </div>
      </div>
      <DialogTimeFrame setTimeFrame={setTimeFrame}/>
    </>
  )
}

export default UserOrders