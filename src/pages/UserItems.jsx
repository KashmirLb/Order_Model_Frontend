import { useEffect, useState } from "react"
import ItemPreview from "../components/ItemPreview"
import Spinner from "../components/Spinner"
import useData from "../hooks/useData"
import useUser from "../hooks/useUser"

const UserItems = () => {

  const [ sortType, setSortType ] = useState("Last Orders")
  const [ sortOrder, setSortOrder ] = useState("Ascending")
  const [ sortOnlyActive, setSortOnlyActive ] = useState(false)
  const [ loadingItems, setLoadingItems ] = useState(true)

  const { userObtainItems, userItems, userSortItems } = useUser()

  useEffect(()=>{

    const loadItems = async()=>{
      userObtainItems()
      setLoadingItems(false)
    }
    loadItems()
  },[])

  useEffect(()=>{

    userSortItems(sortType, sortOrder)

  },[sortType, sortOrder])

  const handleActiveSort = () =>{
    setSortOnlyActive(!sortOnlyActive)
  }

  const filterItems =

  !sortOnlyActive ? 
    userItems :
      [...userItems].filter(item => item.orders[0]?.status==="Open"||item.orders[0]?.status==="Finished")

  return (

    <>
      <div className="m-1 my-3 md:m-2 md:mt-2 bg-user-primary rounded-lg">
        <div className=" text-user-light p-4 flex">
          <div>
            <label className="text-lg">Sort by:</label>
            <select 
              type="combobox" 
              className="bg-user-secondary border border-user-light text-almost-white px-2 mx-2"
              value={sortType}
              onChange={e=>setSortType(e.target.value)}
            >
              <option value="Last Orders">Last Orders</option>
              <option value="Item Name">Item Name</option>
              <option value="Owner">Owner</option>
              <option value="Id">Item ID</option>
            </select>
          </div>
          <div className="mx-4">
            <label className="text-lg">Order:</label>
            <select 
              type="combobox" 
              className="bg-user-secondary border border-user-light text-almost-white px-2 mx-2"
              value={sortOrder}
              onChange={e=>setSortOrder(e.target.value)}
            >
              <option value="Descending">Descending</option>
              <option value="Ascending">Ascending</option>
            </select>
          </div>
          <div>
            <label className="pl-6 pr-2">Show only active: </label>
            <input type="checkbox" onChange={handleActiveSort} className="bg-user-secondary border border-user-light"/>
          </div>
        </div>
        <table className="table-fixed w-full">
          <thead>
            <tr className=" text-almost-white ">
              <th className="w-1/5 ">Item ID</th>
              <th className="w-1/5">Name</th>
              <th className="w-1/3">Owner</th>
              <th className="w-1/5">Last order</th>
            </tr>
          </thead>
          <tbody>
            {
              loadingItems ? <tr><td><Spinner/></td></tr> :
              filterItems.length ? filterItems.map( item =>(
                <ItemPreview key={item._id} item={item} />
              ))
              :
              <tr><td className="text-almost-white text-center">No Items found with this filter.</td></tr>
            }
          </tbody>

        </table>
        <div className="h-5">
            {
              // paging will be handled here, current page, arrows etc.
            }
        </div>
      </div>
    </>
  )
}

export default UserItems