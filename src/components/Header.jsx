import useUser from "../hooks/useUser"
import useAdmin from "../hooks/useAdmin"
import { setColors } from "../helpers"

const Header = () => {

    const { auth } = useUser()
    const { admin } = useAdmin()

    const { backgroundPrimary, textLight } = setColors(auth?._id ? "user" : "admin")

  return (
    <header className={`${backgroundPrimary} py-5 md:flex justify-between items-center px-8`}>
        <img src="/small-logo.png" alt="small-logo" className="mx-auto md:mx-0"/>
        <div className=" flex items-center gap-5">
            <div className={`${textLight} text-xl font-bold`}>
                Logged in as: <span className="text-almost-white">{auth?.name ? auth.name : admin.name}</span>
            </div>
            <button
                type="button"
                className="bg-red-700 hover:bg-red-600 text-white font-bold uppercase py-3 px-5 text-md rounded-md transition-colors"
            >
                Logout
            </button>
        </div>
    </header>
  )
}

export default Header