import { Outlet, Navigate } from "react-router-dom"
import useAuth from "../hooks/useAuth"
import Header from "../components/Header"
import Sidebar from "../components/Sidebar"
import Spinner from "../components/Spinner"

const AdminLayout = () => {

    const { auth, loading } = useAuth()

    if (loading) return <Spinner />

  return (
        <>
            {
                auth?.adminId ? 
                    (
                        <div className="min-h-screen bg-blue-100 overflow-hidden">
                            <Header/>
                            <div className="md:flex">
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