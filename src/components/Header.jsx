import { useNavigate } from "react-router-dom"
import useAuth from "../hooks/useAuth"
import useData from "../hooks/useData"
import useUser from "../hooks/useUser"

const Header = () => {

    const navigate = useNavigate()

    const { auth, logoutAuth } = useAuth()
    const { logoutAdminData } = useData()
    const { logoutUser } = useUser()

    const handleLogout = () =>{
        logoutAdminData()
        logoutAuth()
        logoutUser()
        sessionStorage.removeItem("admintoken")
        sessionStorage.removeItem("usertoken")
    }

  return (
    <header className={`${auth.adminId ? "bg-admin-primary" : "bg-user-primary"} py-5 md:flex justify-between items-center px-8 md:max-h-32`}>
        <img src="/small-logo.png" alt="small-logo" className="mb-4 mx-auto md:m-0 hover:cursor-pointer" onClick={()=>navigate("/admin-console")}/>
        <div className="flex items-center gap-5 justify-center ">
            <div className={`${auth.adminId ? "text-admin-light" : "text-user-light"} text-xl font-bold`}>
                Logged in as: <span className="text-almost-white">{auth?.name && auth.name} ({auth?.customId ? auth.customId : auth.adminId})</span>
            </div>
            <button
                type="button"
                className="bg-red-700 hover:bg-red-600 text-white font-bold uppercase py-3 px-5 text-md rounded-md transition-colors"
                onClick={handleLogout}
            >
                Logout
            </button>
        </div>
    </header>
  )
}

export default Header