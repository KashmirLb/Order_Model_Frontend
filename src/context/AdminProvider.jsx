import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../config/axiosClient";

const AdminContext = createContext()

const AdminProvider = ({children}) =>{

    const [ admin, setAdmin ] = useState({})
    const [ adminChecked, setAdminChecked ] = useState(false)
    const [ loading, setLoading ] = useState(true)

    const navigate = useNavigate()

    useEffect(()=>{

        const checkAdminToken = async () =>{

            try {
                 const token = sessionStorage.getItem('admintoken')
                 setAdminChecked(false)

                if(!token){
                    setLoading(false)
                    return
                }

                const { data } = await axiosClient.post("/admin/check-admin", { token })

                setAdmin(data)
                navigate("/admin-console")
            }
            catch(error){
                setAdmin({})
                console.log("That went wrong")
            }
        }
        checkAdminToken()
    },[])

    useEffect(()=>{

        const checkAdminToken = async () =>{

            setAdminChecked(false)
            setLoading(true)

            try{
                const token = sessionStorage.getItem('admintoken')
  
                if(!token){
                    setLoading(false)
                    return
                }
                const { data } = await axiosClient.post("/admin/check-admin", { token })

                if(data._id===admin._id){
                    setAdminChecked(true)
                }
            }
            catch(error){
                console.log(error)
            }
            setLoading(false)
        }
        checkAdminToken()
    },[admin])

    const changeAdmin = user => {
        setAdmin(user)
    }

    return(
       <AdminContext.Provider
            value={{
                admin,
                loading,
                changeAdmin,
                adminChecked
            }}
        >
            {children}
        </AdminContext.Provider> 
    )
}

export {
    AdminProvider
}

export default AdminContext