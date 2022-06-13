import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AdminProvider } from './context/adminProvider'
import { UserProvider } from './context/UserProvider'
import NotAuthLayout from './layout/notAuthLayout'
import AdminLayout from './layout/AdminLayout'
import UserLayout from './layout/UserLayout'
import Login from './pages/Login'
import AdminDashboard from './pages/AdminDashboard'
import UserDashboard from './pages/UserDashboard'

function App() {
 
  return (

    <BrowserRouter>
      <AdminProvider>
        <UserProvider>
        <Routes>
          <Route path="/" element={<NotAuthLayout />}>
            <Route index element={<Login />} />
          </Route>
          <Route path="/admin-console" element={<AdminLayout />}>
            <Route index element={<AdminDashboard/>}/>
          </Route>
          <Route path="/user" element={<UserLayout/>}>
            <Route index element={<UserDashboard/>}/>
          </Route>
        </Routes>
        </UserProvider>
      </AdminProvider>
    </BrowserRouter>
   
  )
}

export default App
