import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../config/axiosClient";

const AuthContext = createContext()

const AuthProvider = ({children}) =>{

    const [ auth, setAuth ] = useState({})
    const [ loading, setLoading ] = useState(true)
    const [ searchList, setSearchList ] = useState([])
    const [ customers, setCustomers ] = useState([])

    const navigate = useNavigate()

    const config = token =>{
        return(
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
        )
    }

    const prepareSearchList = list =>{
        const newCustomIdList = list.map( item =>{

            let customId = `${item.lastName}, ${item.name}`
            let _id = item._id
            return {_id, customId}
        })
        setSearchList([...newCustomIdList, ...list])
    }
   
    useEffect(()=> {

        const obtainUser = async () =>{
            setLoading(true)

            const adminToken = sessionStorage.getItem('admintoken')

            if(adminToken){
                try {
                    const { data } = await axiosClient('/admin/check-admin', config(adminToken))
    
                    setAuth(data)
                    navigate("/admin-console")

                    const { data: search } = await axiosClient('/admin/search-list', config(adminToken))

                    prepareSearchList(search)
                } catch (error) {
                    console.log(error)
                }
            }
            else{
                const token = sessionStorage.getItem('usertoken')
    
                if(!token){
                    setLoading(false)
                    return
                }
                try {
                    const { data } = await axiosClient('/user/profile', config(token))
    
                    setAuth(data)
                    navigate("/user")
    
                } catch (error) {
                    console.log(error)
                }
            }

            setLoading(false)
        }
        obtainUser()
    },[])

    const obtainCustomers = async () =>{

        const adminToken = sessionStorage.getItem('admintoken')
       
        const { data } = await axiosClient('/user/user-list', config(adminToken))

        const allActive = data.filter(user => user.activeOrder)
        const nonActive = data.filter(user => !user.activeOrder)

        const activeSorted = [...allActive].sort((a,b)=>new Date(b.comments[0].createdAt)- new Date(a.comments[0].createdAt))
        const nonActiveSorted = [...nonActive].sort((a,b)=>new Date(b.comments[0].createdAt)- new Date(a.comments[0].createdAt))

        setCustomers([...activeSorted, ...nonActiveSorted])
    }

    return(
        <AuthContext.Provider
            value={{
                auth,
                setAuth,
                loading,
                setLoading,
                searchList,
                obtainCustomers,
                customers
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export {
    AuthProvider
}

export default AuthContext