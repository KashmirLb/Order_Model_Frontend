import { formatDate } from "../helpers"
import { useNavigate } from "react-router-dom"

const CustomerPreview = ({customer}) => {

    const navigate = useNavigate()
    const {customId, name, lastName, comments, activeOrder} = customer
  
  return (
    <tr className="group shadow-md bg-admin-secondary text-admin-light text-center hover:bg-admin-primary hover:cursor-pointer" onClick={()=>navigate(customer._id)}>
            <td className="pl-3 py-2 ">{customId}</td>
            <td>{name}</td>
            <td>{lastName}</td>
            <td className={comments.length ? !comments[0]?.adminRead ? "bg-user-secondary text-almost-white group-hover:bg-user-primary" : "" : ""}>
                {comments.length>0 ? formatDate(comments[0].createdAt) : "None"} {comments.length>0 && !comments[0]?.adminRead ? (<div className="text-user-light">New Message !</div>) : null }
            </td>
            <td className={activeOrder ? "bg-indigo-600 group-hover:bg-indigo-800" : ""}>{activeOrder ? "Active" : "All Closed"}</td>
    </tr>
  )
}

export default CustomerPreview