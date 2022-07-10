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
                auth?.firstLogin ? 
                (
                    <main className="container mx-auto mt-5 md:mt-10 p-5 md:flex md:justify-center">
                        <div className="md:w-2/3 lg:w-2/5">
                            <Outlet />
                        </div>
                    </main>
                ):
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