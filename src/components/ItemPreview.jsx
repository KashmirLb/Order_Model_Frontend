import { useNavigate } from "react-router-dom"

const ItemPreview = ({item}) => {

    const navigate = useNavigate()
    const {customId, name, owner, orders, _id} = item
    const adminToken = sessionStorage.getItem('admintoken')

    const obtainBackground = () =>{
    
        if(adminToken){
            return "bg-admin-secondary hover:bg-admin-primary text-admin-light"
        }
        else{
          return "bg-user-secondary hover:bg-user-primary text-user-light"
        }
    }

    const activeBackground = () =>{
    
        if(adminToken){
            return "bg-indigo-600 text-almost-white group-hover:bg-indigo-800"
        }
        else{
          return "bg-sky-700 group-hover:bg-sky-800 text-user-light"
        }
    }
  
  return (
    <tr className={`${obtainBackground()} group shadow-md  text-center hover:cursor-pointer`} onClick={()=>navigate(_id)}>
            <td className="pl-3 py-2 ">{customId}</td>
            <td>{name}</td>
            <td>{owner.lastName}, {owner.name}</td>
            <td className={orders[0]?.status==="Open"||orders[0]?.status==="Finished" ?  activeBackground() : "" }>
              {orders[0] ? (
                <>
                  <div className={adminToken ? "text-admin-light" : "text-almost-white"}>{orders[0]?.customId}</div>
                  <div >{orders[0]?.status}</div>
                </>
              ): "No orders assigned"}
            </td>
    </tr>
  )
}

export default ItemPreview