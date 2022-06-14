import { Outlet, Navigate } from "react-router-dom"
import useAuth from "../hooks/useAuth"
import Header from "../components/Header"
import Sidebar from "../components/Sidebar"

const AdminLayout = () => {

    const { auth, loading } = useAuth()

    if (loading) return "Loading..."

  return (
        <>
            {
                auth?.adminId ? 
                    (
                        <div>
                            <Header/>
                            <div className="md:flex min-h-screen bg-blue-100">
                                <Sidebar/>
                                <main className="md:w-3/4 lg:w-4/5">
                                    <Outlet />
                                </main>
                            </div>
                        </div>
                    ) 
                : <Navigate to="/" />
            }
        </>
  )
}

export default AdminLayout