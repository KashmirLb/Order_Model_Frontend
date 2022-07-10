import { useState } from "react"
import useAuth from "../hooks/useAuth"
import useData from "../hooks/useData"
import useUser from "../hooks/useUser"
import Alert from "../components/Alert"

const FirstLogin = () => {

    const [ alert, setAlert ] = useState({})
    const [ password, setPassword ] = useState("")
    const [ repeatPassword, setRepeatPassword ] = useState("")

    const { auth, obtainUser } = useAuth()
    const { adminPasswordReset, removeFirstLogin } = useData()
    const { userChangePassword, userRemoveFirstLogin } = useUser()

    const handleSubmit = async e => {
        e.preventDefault()
        setAlert({})

        if([repeatPassword, password].includes("")){
            setAlert({
                msg: "All fields are mandatory",
                error: true
            })
            return
        }
        if(password!==repeatPassword){
            setAlert({
                msg: "Passwords do not match",
                error: true
            })
            return
        }

        try {
            if(auth.adminId){
                const response = await adminPasswordReset({
                    _id: auth._id, 
                    password: password
                })
                setAlert(response)

                await removeFirstLogin()

                setTimeout(()=>{
                    setAlert({})
                    obtainUser({})
                })
            }
            else{               
                const response = await userChangePassword(password)
                setAlert(response)

                await userRemoveFirstLogin()

                setTimeout(()=>{
                    setAlert({})
                    obtainUser({})
                })
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
        <h1 className="text-6xl font-bold text-user-primary py-10">Choose a New Password:</h1>
        <form className="p-10 bg-white rounded-md shadow "
            onSubmit={handleSubmit}
        >
            { msg && <Alert alert={alert} />}
  
                <div className="my-5">
                    <label 
                        className="uppercase text-user-secondary block text-xl font-bold"
                        htmlFor="password"
                    >New Password</label>
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
                <div className="my-5">
                    <label 
                        className="uppercase text-user-secondary block text-xl font-bold"
                        htmlFor="repeat-password"
                    >Repeat Password:</label>
                    <input 
                        type="password"
                        id="repeat-password"
                        autoComplete="password"
                        placeholder="Repeat Password"
                        className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
                        value={repeatPassword}
                        onChange={e=>setRepeatPassword(e.target.value)}
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-user-primary hover:bg-user-primary-h text-white font-bold uppercase py-3 text-xl rounded-md transition-colors"
                >Continue</button>
        </form>
    </>
  )
}

export default FirstLogin