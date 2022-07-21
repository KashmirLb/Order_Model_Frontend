import { useState } from "react"
import useAuth from "../hooks/useAuth"
import axiosClient from "../../config/axiosClient"
import Alert from "../components/Alert"
import { useNavigate } from "react-router-dom"

const Login = () => {

    const [ username, setUsername ] = useState("")
    const [ password, setPassword ] = useState("")
    const [ alert, setAlert ] = useState({})
    const { setLoading, obtainUser } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async e => {
        e.preventDefault()
        setAlert({})
        sessionStorage.removeItem("admintoken")
        sessionStorage.removeItem("usertoken")

        if([username, password].includes("")){
            setAlert({
                msg: "All fields are mandatory",
                error: true
            })
            return
        }

        try {
            if(username.charAt(0)==="E"){
                const { data } = await axiosClient.post('/admin/login', { username, password })
                sessionStorage.setItem("admintoken", data.token)
                await obtainUser()
                setLoading(false)
            }
            else{
                const { data } = await axiosClient.post('/user/user-login', { username, password })
                sessionStorage.setItem("usertoken", data.token)
                await obtainUser()
                setLoading(false)
            }
            
        } catch (error) {
            setAlert({
                msg: error.response.data.msg,
                error:true
            })
        }
    }

    const { msg } = alert

  return (
    <>
        <h1 className="text-8xl capitalize font-bold text-user-primary py-10">Order Model</h1>
        <form className="p-10 bg-white rounded-md shadow "
            onSubmit={handleSubmit}
        >
            { msg && <Alert alert={alert} />}
            <div className="my-5">
                
            </div>
            <div className="my-5">
                    <label 
                        className="uppercase text-user-secondary block text-xl font-bold"
                        htmlFor="username"
                    >Username</label>
                    <input 
                        type="text"
                        id="username"
                        autoComplete="username"
                        placeholder="Username"
                        className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
                        value={username}
                        onChange={e=>setUsername(e.target.value)}
                    />
                </div>
                <div className="my-5">
                    <label 
                        className="uppercase text-user-secondary block text-xl font-bold"
                        htmlFor="password"
                    >Password</label>
                    <input 
                        type="password"
                        id="password"
                        autoComplete="password"
                        placeholder="Password"
                        className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
                        value={password}
                        onChange={e=>setPassword(e.target.value)}
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-user-primary hover:bg-user-primary-h text-white font-bold uppercase py-3 text-xl rounded-md transition-colors"
                >Log in</button>
        </form>
    </>
  )
}

export default Login