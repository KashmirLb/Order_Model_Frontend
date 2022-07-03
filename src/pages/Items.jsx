import { useEffect, useState } from "react"
import DialogCreateItem from "../components/DialogCreateItem"
import ItemPreview from "../components/ItemPreview"
import Spinner from "../components/Spinner"
import useData from "../hooks/useData"

const Items = () => {

  const [ sortType, setSortType ] = useState("Last Orders")
  const [ sortOrder, setSortOrder ] = useState("Ascending")
  const [ sortOnlyActive, setSortOnlyActive ] = useState(false)
  const [ loadingItems, setLoadingItems ] = useState(true)

  const { obtainItems, items, sortItems, openCloseItemDialog } = useData()

  useEffect(()=>{

    const loadItems = async()=>{
      obtainItems()
      setLoadingItems(false)
    }
    loadItems()
  },[])

  useEffect(()=>{

    sortItems(sortType, sortOrder)

  },[sortType, sortOrder])

  const handleActiveSort = () =>{
    setSortOnlyActive(!sortOnlyActive)
  }

  const filterItems =

  !sortOnlyActive ? 
    items :
      [...items].filter(item => item.orders[0]?.status==="Open"||item.orders[0]?.status==="Finished")

  return (

    <>
      <button
        type="button"
        className="p-2 bg-admin-light text-lg shadow-md m-4 rounded-md font-bold hover:bg-admin-light-h transition-colors"
        onClick={openCloseItemDialog}
      >New Item</button>
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
      <DialogCreateItem />
    </>
  )
}

export default Items