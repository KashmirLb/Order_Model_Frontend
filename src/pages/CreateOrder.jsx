import { useState, useEffect } from "react"
import useAuth from "../hooks/useAuth"
import useData from "../hooks/useData"
import SearchBar from "../components/SearchBar"
import DialogCreateUser from "../components/DialogCreateUser"
import Alert from "../components/Alert"
import { useNavigate } from "react-router-dom"


const CreateOrder = () => {

    const [ alert, setAlert ] = useState({})
    const [ title, setTitle ] = useState("")
    const [ description, setDescription ] = useState("")
    const [ status, setStatus ] = useState("Open")
    const [ item, setItem ] = useState("")
    const [ userList, setUserList] = useState([])

    const navigate = useNavigate()

    const { searchList } = useAuth()
    const { customerData, setCustomerData, openCloseUserDialog, createOrder } = useData()

    useEffect(()=>{
        setAlert({})
        setCustomerData({})
        const onlyUsers = searchList.filter( item => item.searchType==="users")
        setUserList(onlyUsers)
    },[])

    useEffect(()=>{
        const onlyUsers = searchList.filter( item => item.searchType==="users")
        setUserList(onlyUsers)
    },[searchList])

    useEffect(()=>{
        setItem("")
    },[customerData])

    const handleSubmit = async e =>{
        e.preventDefault()

        setAlert({})

        if([title, item].includes("")){
            setAlert({
                msg: "Fields are missing",
                error: true
            })
            return
        }
        if(!customerData?._id){
            setAlert({
                msg: "Select a customer",
                error: true
            })
            return
        }

        const selectedItem = customerData.assets.find(asset=> asset.customId===item)

        const createdOrder = await createOrder({
            title, 
            description,
            status,
            customer: customerData._id,
            asset: selectedItem._id
        })

        setAlert(createdOrder.alert)

        setTitle("")
        setDescription("")
        setItem("")
        setCustomerData({})
        setStatus("Open")

        setTimeout(()=>{
            setAlert({})
            navigate(`/admin-console/orders/${createdOrder.order._id}`)
        },1500)

    }

    const { msg, error } = alert

    const styleBorders = input =>{
        if(input==="" && error){
          return "outline-red-700 outline-4 outline"
        }
        return ""
      } 

  return (
    <>
        <form onSubmit={handleSubmit}>
            
            <div className="p-3 md:grid md:grid-cols-2 gap-2">
                <div className="bg-admin-primary w-full rounded-md text-admin-primary ">
                    <div className="p-3">
                        <label 
                            className=" text-admin-light text-xl font-bold"
                            htmlFor="title"
                        >Title:</label>
                        <input 
                            type="text"
                            id="title"
                            autoComplete="title"
                            placeholder="Order title"
                            className={`${styleBorders(title)} w-full mt-3 p-2 border rounded-sm bg-gray-50`}
                            value={title}
                            onChange={e=>setTitle(e.target.value)}
                        />
                    </div>
                    <div className="p-3">
                        <label 
                            className=" text-admin-light text-xl font-bold"
                            htmlFor="description"
                        >Description:</label>
                        <textarea 
                            id="description"
                            autoComplete="title"
                            className={`w-full mt-3 p-2 border rounded-sm bg-gray-50 h-52`}
                            value={description}
                            onChange={e=>setDescription(e.target.value)}
                        />
                    </div>
                    <div className="p-3 flex justify-end items-center gap-2">
                        <label 
                            className=" text-admin-light text-xl font-bold"
                            htmlFor="status"
                        >Status:</label>
                        <select 
                            id="status"
                            className="text-admin-light px-2 border border-admin-light rounded-sm bg-admin-secondary"
                            value={status}
                            onChange={e=>setStatus(e.target.value)}
                        >
                            <option value="Open">Open</option>
                            <option value="Finished">Finished</option>
                            <option value="Closed">Closed</option>
                        </select>
                    </div>
                </div>
                <div className="bg-admin-secondary w-full rounded-md">
                    <div className="p-3">
                        <div className="flex justify-between items-center">
                            <label 
                                className=" text-admin-light text-xl font-bold"
                                htmlFor="title"
                            >Customer:</label>
                            <button
                                type="button"
                                className="px-1 py-2 bg-admin-primary shadow-md border border-admin-light text-admin-light 
                                    rounded-md font-bold hover:bg-admin-light hover:text-admin-primary transition-colors"
                                onClick={openCloseUserDialog}
                            >New Customer</button>
                        </div>
                        <SearchBar searchList={userList} sidebar={false} />
                        <div className={`${styleBorders(customerData?._id ? customerData._id : "")} text-almost-white bg-admin-primary p-3 m-1 rounded-md border border-admin-light`}>
                            <p><span className="text-admin-light">Id:</span> {customerData.customId && customerData.customId}</p>
                            <p><span className="text-admin-light">Name:</span> {customerData.name && ` ${customerData.lastName}, ${customerData.name}`}</p>
                        </div>
                        {
                            customerData._id && (
                                <div className="p-3 flex items-center gap-2">
                                    <label 
                                        className=" text-admin-light text-xl font-bold"
                                        htmlFor="item"
                                    >Item related:</label>
                                    <select 
                                        id="item"
                                        className={`${styleBorders(item)} px-2 border border-admin-light rounded-sm bg-admin-secondary text-admin-light`}
                                        value={item}
                                        onChange={e=>setItem(e.target.value)}
                                    >
                                        <option value="">-- Select Item --</option>
                                        {customerData?.assets?.length && customerData.assets.map( item =>(
                                            <option key={item._id} value={item.customId}>{item.customId} - {item.name}</option>
                                            ))
                                        }
                                        <option value="None" className="text-red-700 uppercase font-bold">None</option>
                                    </select>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
            <div className="flex items-center">
                <button
                    type="submit"
                    className="rounded-md px-10 bg-indigo-700 py-4 uppercase text-xl font-bold text-almost-white hover:bg-indigo-500 transition-colors m-4"
                >
                    Create Order
                </button>
                <div className="md:w-1/3 mx-4">
                    {msg && <Alert alert={alert}/>}
                </div>
            </div>
        </form>
        <DialogCreateUser creatingOrder={true}/>
    </>
  )
}

export default CreateOrder