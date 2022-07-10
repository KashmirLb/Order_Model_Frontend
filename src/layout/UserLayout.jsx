import { Outlet, Navigate } from "react-router-dom"
import Spinner from "../components/Spinner"
import useAuth  from "../hooks/useAuth"
import Header from "../components/Header"
import Sidebar from "../components/Sidebar"

const UserLayout = () => {

    const { auth, loading } = useAuth()

    if(loading) return <Spinner />

  return (
        <>
            {auth?.customId ?  
            (
                <div className="min-h-screen bg-almost-white overflow-hidden">
                    <Header />
                    <div className="md:flex">
                        <Sidebar/>
                        <main className="md:w-3/4 lg:w-4/5">
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