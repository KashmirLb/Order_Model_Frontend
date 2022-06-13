import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../config/axiosClient";

const UserContext = createContext()

const UserProvider = ({children}) =>{

    const [ auth, setAuth ] = useState({})
    const [ loadingUser, setLoadingUser ] = useState(true)

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

    useEffect(()=> {

        const obtainUser = async () =>{

            const token = sessionStorage.getItem('usertoken')

            if(!token){
                setLoadingUser(false)
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
        obtainUser()
    },[])

    return(
        <UserContext.Provider
            value={{

                auth,
                setAuth,
                loadingUser
            }}
        >
            {children}
        </UserContext.Provider>
    )
}

export {
    UserProvider
}

export default UserContext