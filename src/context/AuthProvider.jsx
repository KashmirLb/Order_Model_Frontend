import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../config/axiosClient";

const AuthContext = createContext()

const AuthProvider = ({children}) =>{

    const [ auth, setAuth ] = useState({})
    const [ loading, setLoading ] = useState(true)
    const [ searchList, setSearchList ] = useState([])

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

    const prepareSearchList = async () =>{

        const adminToken = sessionStorage.getItem('admintoken')

        try {
            const { data } = await axiosClient('/admin/search-list', config(adminToken))
           
            setSearchList(data)
        } catch (error) {
            console.log(error.response.data.msg)
        }

    }

    const obtainUser = async () =>{

        const adminToken = sessionStorage.getItem('admintoken')

        if(adminToken){
            try {
                const { data } = await axiosClient('/admin/check-admin', config(adminToken))

                setAuth(data)
                navigate("/admin-console")
                prepareSearchList()
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
   
    useEffect(()=> {  
        obtainUser()
    },[])

    const logoutAuth = () =>{
        setAuth({})
        setSearchList([])
    }

    return(
        <AuthContext.Provider
            value={{
                auth,
                setAuth,
                loading,
                setLoading,
                searchList,
                prepareSearchList,
                obtainUser,
                logoutAuth
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