import { Outlet, Navigate } from "react-router-dom"
import useAdmin from "../hooks/useAdmin"
import Header from "../components/Header"
import Sidebar from "../components/Sidebar"

const AdminLayout = () => {

    const { admin, loading, adminChecked } = useAdmin()

    if (loading) return "Loading..."

  return (
        <>
            {
                admin.adminId ? 
                   adminChecked ? 
                    (
                        <div>
                            <Header/>
                            <div className="md:flex min-h-screen bg-blue-100">
                                <Sidebar/>
                                <main>
                                    <Outlet />
                                </main>
                            </div>
                        </div>
                    ) : <div> Checking ID....</div>
                : <Navigate to="/" />
            }
        </>
  )
}

export default AdminLayout