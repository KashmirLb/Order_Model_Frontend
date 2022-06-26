import useAuth from "../hooks/useAuth"
import NavElement from "./NavElement"
import SearchBar from "./SearchBar"

const adminLinks =[
  {name: "Dashboard", link: "/admin-console"},
  {name: "Messages", link: "messages"},
  {name: "Customers", link: "users"},
  {name: "All Orders", link: "orders"},
  {name: "All Items", link: "items"},
  {name: "Settings", link: "settings"},
]

const userLinks =[
  {name: "Home", link: "/user"},
  {name: "Messages", link: "messages"},
  {name: "My Orders", link: "orders"},
  {name: "My items", link: "items"},
  {name: "Settings", link: "settings"},
]

const Sidebar = () => {

  const { auth } = useAuth()

  return (
    <aside className="md:w-1/4 lg:w-1/5 shadow-lg ">
      <nav>
     
        {auth?.adminId ? 
          adminLinks.map( item =>(
            <NavElement key={item.name} name={item.name} link={item.link}/>
          ))
          :
          userLinks.map(item=>(
            <NavElement key={item.name} name={item.name} link={item.link}/>
          ))
        }
      </nav>
      {auth?.adminId && <SearchBar />}
    </aside>
  )
}

export default Sidebar