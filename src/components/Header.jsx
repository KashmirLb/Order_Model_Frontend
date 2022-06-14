import useAuth from "../hooks/useAuth"

const Header = () => {

    const { auth } = useAuth()

  return (
    <header className={`${auth.adminId ? "bg-admin-primary" : "bg-user-primary"} py-5 md:flex justify-between items-center px-8`}>
        <img src="/small-logo.png" alt="small-logo" className="mb-4 mx-auto md:m-0"/>
        <div className=" flex items-center gap-5">
            <div className={`${auth.adminId ? "text-admin-light" : "text-user-light"} text-xl font-bold`}>
                Logged in as: <span className="text-almost-white">{auth?.name && auth.name}</span>
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