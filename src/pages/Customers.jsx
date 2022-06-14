import { useEffect } from "react"
import CustomerPreview from "../components/CustomerPreview"
import useAuth from "../hooks/useAuth"

const Customers = () => {

  const { obtainCustomers, customers } = useAuth()

  useEffect(()=>{
    obtainCustomers()
  },[])

  return (

    <div className="m-1 my-3 md:m-4 bg-admin-primary rounded-lg">
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
          {customers?.length ? customers.map(customer => (
            <CustomerPreview key={customer._id} customer={customer}/>
          ))
        :
        <tr><td>Loading...</td></tr>}
        </tbody>

      </table>
      <div>
        more
      </div>
    </div>
  )
}

export default Customers