import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthProvider'
import NotAuthLayout from './layout/notAuthLayout.jsx'
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
import Item from './pages/Item'
import Settings from './pages/Settings'
import { DataProvider } from './context/DataProvider'
import CreateOrder from './pages/CreateOrder'
import Order from './pages/Order'
import UserMessages from './pages/UserMessages'
import UserOrders from './pages/UserOrders'
import { UserProvider } from './context/UserProvider'
import UserOrder from './pages/userOrder'
import UserItems from './pages/UserItems'
import UserItem from './pages/UserItem'
import UserProfile from './pages/UserProfile'
import FirstLogin from './pages/FirstLogin'

function App() {
 
  return (
    <BrowserRouter> 
      <AuthProvider>
        <DataProvider>
          <UserProvider>
            <Routes>
              <Route path="/" element={<NotAuthLayout/>}>
                <Route index element={<Login/>} />
              </Route>
              <Route path="/admin-console" element={<AdminLayout />}>
                <Route index element={<AdminDashboard/>}/>
                <Route path="first-login" element={<FirstLogin />}/>
                <Route path="messages" element={<Messages/>}/>
                <Route path="users" element={<Customers/>}/>
                <Route path="users/:id" element={<Customer/>}/>
                <Route path="orders" element={<Orders/>}/>
                <Route path="orders/create" element={<CreateOrder/>}/>
                <Route path="orders/:id" element={<Order/>}/>
                <Route path="items" element={<Items/>}/>
                <Route path="items/:id" element={<Item/>}/>
                <Route path="settings" element={<Settings/>}/>
              </Route>
              <Route path="/user" element={<UserLayout/>}>
                <Route index element={<UserDashboard/>}/>
                <Route path="first-login" element={<FirstLogin />}/>
                <Route path="messages" element={<UserMessages/>}/>
                <Route path="orders" element={<UserOrders/>}/>
                <Route path="orders/:id" element={<UserOrder/>}/>
                <Route path="items" element={<UserItems/>}/>
                <Route path="items/:id" element={<UserItem/>}/>
                <Route path="profile" element={<UserProfile/>}/>
              </Route>
            </Routes>
          </UserProvider>
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
