import { Link, useLocation } from "react-router-dom"
import useAuth from "../hooks/useAuth"

const NavElement = ({name, link}) => {

    const { auth } = useAuth()
    const location = useLocation()

    const createBackground = () =>{
      
      let afterSlash=""
      const removedSlash = location.pathname.slice(1)

      if(removedSlash.includes("/")){
        afterSlash = removedSlash.split("/")[1]
      }
      else{
        if(link==="/admin-console"){
            return "bg-admin-primary"
          }
        if(link==="/user"){
            return "bg-user-primary"
          }
      }
      if(afterSlash.includes(link)){
        if(auth.adminId){
          return "bg-black"
        }
        return "bg-user-primary"
      }
      if(auth.adminId){
        return "bg-admin-secondary hover:bg-admin-primary"
      }
      return "bg-user-secondary hover:bg-user-primary"
    }

  return (
    <Link to={link}>
        <div 
            className={`${createBackground()} px-4 py-3 m-1 
            rounded-md text-almost-white font-bold text-lg text-center transition-colors`}
        >
        {name}
        </div>
    </Link>
  )
}

export default NavElement