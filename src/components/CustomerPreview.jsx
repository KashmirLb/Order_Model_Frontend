import { formatDate } from "../helpers"

const CustomerPreview = ({customer}) => {

    const {customId, name, lastName, secondLastName, comments, activeOrder} = customer
    const { adminRead } = comments[0]
  return (
    <tr className="group shadow-md bg-admin-secondary text-admin-light text-center hover:bg-admin-primary hover:cursor-pointer">
        <td className="pl-3 py-2 ">{customId}</td>
        <td>{name}</td>
        <td>{lastName} {secondLastName && secondLastName}</td>
        <td className={!adminRead ? "bg-user-secondary text-almost-white group-hover:bg-user-primary" : ""}>
            {comments.length>0 ? formatDate(comments[0].createdAt) : "None"} {!adminRead && (<div className="text-user-light">New Message !</div>)}
        </td>
        <td className={activeOrder ? "bg-indigo-600 group-hover:bg-indigo-800" : ""}>{activeOrder ? "Active" : "All Closed"}</td>
    </tr>
  )
}

export default CustomerPreview