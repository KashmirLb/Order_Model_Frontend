import { Outlet, Navigate } from "react-router-dom"
import useUser  from "../hooks/useUser"
import Header from "../components/Header"
import Sidebar from "../components/Sidebar"

const UserLayout = () => {

    const { auth, loadingUser } = useUser()

  return (
        <>
            {auth?._id ?  
            (
                <div>
                    <Header />
                    <div className="md:flex min-h-screen bg-almost-white">
                        <Sidebar/>
                        <main>
                            <Outlet />
                        </main>
                    </div>
                </div>
            )
            : 
                <Navigate to="/" />
            }   
        </> 
  )
}

export default UserLayout