import { Outlet, Navigate } from "react-router-dom"
import useAuth  from "../hooks/useAuth"
import Header from "../components/Header"
import Sidebar from "../components/Sidebar"

const UserLayout = () => {

    const { auth, loading } = useAuth()

    if(loading) return "Loading..."

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