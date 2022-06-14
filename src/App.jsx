import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthProvider'
import NotAuthLayout from './layout/notAuthLayout'
import AdminLayout from './layout/AdminLayout'
import UserLayout from './layout/UserLayout'
import Login from './pages/Login'
import AdminDashboard from './pages/AdminDashboard'
import UserDashboard from './pages/UserDashboard'
import Messages from './pages/Messages'
import Customers from './pages/Customers'
import Customer from './pages/Customer'
import Orders from './pages/Orders'
import Items from './pages/Items'
import Settings from './pages/Settings'

function App() {
 
  return (

    <BrowserRouter> 
      <AuthProvider>
        <Routes>
          <Route path="/" element={<NotAuthLayout />}>
            <Route index element={<Login />} />
          </Route>
          <Route path="/admin-console" element={<AdminLayout />}>
            <Route index element={<AdminDashboard/>}/>
            <Route path="messages" element={<Messages/>}/>
            <Route path="customers" element={<Customers/>}/>
            <Route path="customers/:id" element={<Customer/>}/>
            <Route path="orders" element={<Orders/>}/>
            <Route path="items" element={<Items/>}/>
            <Route path="settings" element={<Settings/>}/>
          </Route>
          <Route path="/user" element={<UserLayout/>}>
            <Route index element={<UserDashboard/>}/>
            <Route path="messages" element={<Messages/>}/>
            <Route path="orders" element={<Orders/>}/>
            <Route path="items" element={<Items/>}/>
            <Route path="settings" element={<Settings/>}/>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
   
  )
}

export default App
