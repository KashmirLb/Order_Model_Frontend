import { useNavigate } from "react-router-dom"

const ItemPreview = ({item}) => {

    const navigate = useNavigate()
    const {customId, name, owner, orders, _id} = item
  
  return (
    <tr className="group shadow-md bg-admin-secondary text-admin-light text-center hover:bg-admin-primary hover:cursor-pointer" onClick={()=>navigate(_id)}>
            <td className="pl-3 py-2 ">{customId}</td>
            <td>{name}</td>
            <td>{owner.lastName}, {owner.name}</td>
            <td className={orders[0]?.status==="Open"||orders[0]?.status==="Finished" ?  "bg-indigo-600 text-almost-white group-hover:bg-indigo-800" : "" }>
              {orders[0] ? (
                <>
                  <div className="text-admin-light">{orders[0]?.customId}</div>
                  <div >{orders[0]?.status}</div>
                </>
              ): "No orders assigned"}
            </td>
    </tr>
  )
}

export default ItemPreview