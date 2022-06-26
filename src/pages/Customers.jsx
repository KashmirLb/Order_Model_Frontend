import { useState } from "react"
import { useEffect } from "react"
import CustomerPreview from "../components/CustomerPreview"
import Spinner from "../components/Spinner"
import useData from "../hooks/useData"
import DialogCreateUser from "../components/DialogCreateUser"

const Customers = () => {

  const [ sortType, setSortType ] = useState("Last Comment")
  const [ sortOrder, setSortOrder ] = useState("Ascending")
  const [ sortOnlyActive, setSortOnlyActive ] = useState(false)
  const { obtainCustomers, customers, sortCustomers } = useData()

  useEffect(()=>{
    obtainCustomers()
  },[])

  useEffect(()=>{
    sortCustomers(sortType, sortOrder)
  },[sortType, sortOrder, sortOnlyActive])

  const handleActiveSort = () =>{
    setSortOnlyActive(!sortOnlyActive)
  }

  const filterCustomers =

    !sortOnlyActive ? 
      customers :
        [...customers].filter(customer => customer.activeOrder)

  return (
    <>
      <button
        type="button"
        className="p-2 bg-admin-light text-lg shadow-md m-4 rounded-md font-bold hover:bg-admin-light-h transition-colors"
      >New Customer</button>
      <div className="m-1 my-3 md:m-4 md:mt-2 bg-admin-primary rounded-lg">
        <div className=" text-admin-light p-4 flex">
          <div>
            <label className="text-lg">Sort by:</label>
            <select 
              type="combobox" 
              className="bg-admin-secondary border border-admin-light text-almost-white px-2 mx-2"
              value={sortType}
              onChange={e=>setSortType(e.target.value)}
            >
              <option value="Last Comment">Last Comment</option>
              <option value="Last Name">Last Name</option>
              <option value="Name">Name</option>
              <option value="Id">Customer ID</option>
            </select>
          </div>
          <div className="mx-4">
            <label className="text-lg">Order:</label>
            <select 
              type="combobox" 
              className="bg-admin-secondary border border-admin-light text-almost-white px-2 mx-2"
              value={sortOrder}
              onChange={e=>setSortOrder(e.target.value)}
            >
              <option value="Descending">Descending</option>
              <option value="Ascending">Ascending</option>
            </select>
          </div>
          <div>
            <label className="pl-6 pr-2">Show only active: </label>
            <input type="checkbox" onChange={handleActiveSort} className="bg-admin-secondary border border-admin-light"/>
          </div>
        </div>
        <table className="table-fixed w-full">
          <thead>
            <tr className=" text-almost-white ">
              <th className="w-1/5 ">Customer ID</th>
              <th className="w-1/5">Name</th>
              <th className="w-1/3">Last Name(s)</th>
              <th className="w-1/6">Last Comment</th>
              <th className="w-1/5">Active Order</th>
            </tr>
          </thead>
          <tbody>
            {filterCustomers?.length ? filterCustomers.map(customer => (
              <CustomerPreview key={customer._id} customer={customer}/>
            ))
          :
          <tr><td><Spinner/></td></tr>}
          </tbody>

        </table>
        <div className="h-5">
            {
              // paging will be handled here, current page, arrows etc.
            }
        </div>
      </div>
      <DialogCreateUser />
    </>
  )
}

export default Customers