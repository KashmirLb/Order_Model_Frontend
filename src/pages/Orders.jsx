import useData from "../hooks/useData"
import { useState, useEffect } from "react"
import DialogTimeFrame from "../components/DialogTimeFrame"
import { formatDate } from "../helpers"
import Spinner from "../components/Spinner"
import { useNavigate } from "react-router-dom"

const Orders = () => {

  const [ timeFrame, setTimeFrame ] = useState("Week")
  const [ searchOrder, setSearchOrder ] = useState("")
  const [ searchClient, setSearchClient ] = useState("")
  const [ orderStatus, setOrderStatus ] = useState("All Active")
  const [ selectSort, setSelectSort ] = useState("Last created")
  const [ loadingOrders, setLoadingOrders ] = useState(true)

  const navigate = useNavigate()

  const { setOpenDateDialog, obtainOrders, orders, dataLoading, sortOrders } = useData()

  const bothFiltered = () =>{
    const filterCustomer =
      searchClient === "" ?
        orders :
          orders.filter(order => 
            order.customer.name.toLowerCase().includes(searchClient.toLowerCase()) 
            || order.customer.lastName.toLowerCase().includes(searchClient.toLowerCase())
            || order.customer.customId.toLowerCase().includes(searchClient.toLowerCase()))

    const filterOrder =
      searchOrder === "" ?
        filterCustomer :
          filterCustomer.filter(order => 
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
    obtainOrders(timeFrame)
    setLoadingOrders(false)
  },[])

  useEffect(()=>{
    sortOrders(selectSort)
  },[selectSort])

  const filteredList = bothFiltered()
    
  const handleSearch = () => {
    obtainOrders(timeFrame)
    setSelectSort("Last created")
  }

  return (
    <>
    <button
        type="button"
        className="p-2 px-4 bg-admin-light text-lg shadow-md m-4 mb-0 rounded-md font-bold hover:bg-admin-light-h transition-colors"
        onClick={()=>navigate("create")}
      >New Order</button>
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
          <div className="mt-3 md:my-2"><label className="pl-6 pr-2">Status: </label>  
            <select type="combobox" className="bg-admin-secondary border border-admin-light text-almost-white px-2"
            value={orderStatus} onChange={e => setOrderStatus(e.target.value)}>
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
              className="bg-admin-secondary border border-black text-almost-white ml-4 px-4 hover:bg-user-primary transition-colors"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>
        </div>
        <div className="bg-admin-primary rounded-md p-3 text-admin-light mt-3">
          <div className="pr-4 mb-2">
            <label className="pl-6 pr-2">Sort by: </label>
            <select 
              className="bg-admin-secondary border border-admin-light"
              value={selectSort}
              onChange={e=>setSelectSort(e.target.value)}
            >
              <option>Last created</option>
              <option>Last updated</option>
            </select>
          </div>
          <div className="overflow-y-scroll scrollbar-hide max-h-dashboard">

            { dataLoading || loadingOrders ? <div className="flex justify-center"> <Spinner/></div> :
          
            filteredList?.length ? filteredList.map( order =>(

              <div key={order._id} 
                className={`${!order.comments[0]?.adminRead && order.comments[0] ? "bg-user-primary hover:bg-user-secondary" : 
                "bg-admin-secondary hover:bg-admin-secondary-h"} group hover:cursor-pointer rounded-md px-3 py-2 my-2 md:flex`}
                onClick={()=>navigate(order._id)}
              >
                <div className="inline-block md:w-2/5 mr-4 py-2">
                  <p className="rounded-md group-hover:bg-admin-primary group-hover:px-2 group-hover:-mx-2 w-fit">{order.customId}</p>
                  <p>{order.customer.lastName}, {order.customer.name}</p>
                  <p>{order.asset && order.asset?.name}</p>
                  <div className="flex flex-wrap gap-2">
                    <p className="mt-3">{!order.comments[0]?.adminRead ? order.comments[0] ? "New Message!" : "No messages" : `Last update: ${formatDate(order.comments[0]?.createdAt)}`}</p>
                  </div>
                  <p className="text-almost-white text-lg mt-3">{order.status}</p>
                  <p className="text-almost-white text-lg mt-3">{formatDate(order.createdAt)}</p>
                </div>
                <div className="inline-block pl-1 bg-admin-primary w-full text-almost-white whitespace-pre-wrap">{order.description}</div>
              </div>
            ))
              :
              <div className="bg-admin-secondary rounded-md px-3 py-2 text-almost-white text-center font-bold"> No orders found with this filter </div> 
            }
          </div>
        </div>
      </div>
      <DialogTimeFrame setTimeFrame={setTimeFrame}/>
    </>
  )
}

export default Orders