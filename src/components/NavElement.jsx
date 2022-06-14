import { Link } from "react-router-dom"
import useAuth from "../hooks/useAuth"

const NavElement = ({name, link}) => {

    const { auth } = useAuth()

  return (
    <Link to={link}>
        <div 
            className={`${auth.adminId ? "bg-admin-secondary hover:bg-admin-primary" : "bg-user-secondary hover:bg-user-primary"} px-4 py-3 m-1 
            rounded-md text-almost-white font-bold text-lg text-center transition-colors`}
        >
        {name}
        </div>
    </Link>
  )
}

export default NavElement