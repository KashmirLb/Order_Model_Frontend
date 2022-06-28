import { createContext, useState } from "react";
import axiosClient from "../../config/axiosClient";
import { sortByLastCreated, sortByLastCreatedOrder } from "../helpers";

const DataContext = createContext()

const DataProvider = ({children}) =>{

    const [ dataLoading, setDataLoading ] = useState(false)
    const [ customers, setCustomers ] = useState([])
    const [ customerData, setCustomerData ] = useState({})
    const [ commentList, setCommentList ] = useState([])
    const [ orders, setOrders ] = useState([])
    const [ items, setItems ] = useState([])
    const [ itemData, setItemData ] = useState({})
    const [ openDateDialog, setOpenDateDialog ] = useState(false)
    const [ openCreateUserDialog, setOpenCreateUserDialog ] = useState(false)
    const [ openCreateItemDialog, setOpenCreateItemDialog ] = useState(false)
    const [ foundItem, setFoundItem ] = useState({})


    const openCloseUserDialog = () =>{
        setOpenCreateUserDialog(!openCreateUserDialog)
    }

    const openCloseItemDialog = () =>{
        setOpenCreateItemDialog(!openCreateItemDialog)
    }

    const sortingUsersByComments = (data, sortOrder) => {

        // Checking if users have active orders

        const activeChecked = [...data].map(user => {
            if(user.orders.some(order => order.status==="Open" || order.status==="Finished")){
                user.activeOrder=true
            }
            return user
        })

         // Separating the lists that don't have any comments

         const allCommented = activeChecked.filter(user => user.comments.length>0)
         const nonCommented = activeChecked.filter(user => !user.comments?.length>0)

         // Separating the users with comments that have an order active (open or finished)

         const allActive = allCommented.filter(user => user.activeOrder)
         const nonActive = allCommented.filter(user => !user.activeOrder)

        if(sortOrder==="Descending"){

            // Sorting the entire list, setting oldest first and orders without comments at the end.

            setCustomers([...[...allCommented].sort((a,b)=>new Date(a.comments[0].createdAt)- new Date(b.comments[0].createdAt)),...nonCommented])
        }
        else{
             // Sorting both lists, to show last comments last
 
             const activeSorted = [...allActive].sort((a,b)=>new Date(b.comments[0].createdAt)- new Date(a.comments[0].createdAt))
             const nonActiveSorted = [...nonActive].sort((a,b)=>new Date(b.comments[0].createdAt)- new Date(a.comments[0].createdAt))

             setCustomers([...activeSorted, ...nonActiveSorted, ...nonCommented])
        }
    }
    
    const sortingItemsByOrders = data =>{

        // Separating active, closed and items without orders
        const activeOrders = [...data].filter( item => item.orders[0]?.status==="Open"|| item.orders[0]?.status==="Finished")
        const closedOrders = [...data].filter( item => item.orders[0]?.status==="Closed")
        const nonActiveOrders = [...data].filter( item =>!(item.orders[0]?.status==="Open"|| item.orders[0]?.status==="Finished" || item.orders[0]?.status==="Closed"))

        // Sorting orders by the time their order was created
        const activeSorted = sortByLastCreatedOrder(activeOrders)
        const closedSorted = sortByLastCreatedOrder(closedOrders)
        
        const allItems = [...activeSorted, ...closedSorted, ...nonActiveOrders]
        
        return allItems
    }

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

    const obtainCustomers = async () =>{

        try {
            setDataLoading(true)
            
            const adminToken = sessionStorage.getItem('admintoken')
            const { data } = await axiosClient('/admin/user-list', config(adminToken))

            sortingUsersByComments(data)
        } catch (error) {
            console.log(error.response.data.msg)
        }      
        setDataLoading(false) 
    }

    const sortCustomers = (sortType, sortOrder) => {

        if(sortOrder==="Ascending"){
            if(sortType==="Id"){
                setCustomers([...customers].sort((a, b) => a.customId.localeCompare(b.customId)))
            }
            if(sortType==="Name"){
                setCustomers([...customers].sort((a, b) => a.name.localeCompare(b.name)))
            }
            if(sortType==="Last Name"){
                setCustomers([...customers].sort((a, b) => a.lastName.localeCompare(b.lastName)))
            }
        }
        if(sortOrder==="Descending"){
            if(sortType==="Id"){
                setCustomers([...customers].sort((a, b) => b.customId.localeCompare(a.customId)))
            }
            if(sortType==="Name"){
                setCustomers([...customers].sort((a, b) => b.name.localeCompare(a.name)))
            }
            if(sortType==="Last Name"){
                setCustomers([...customers].sort((a, b) => b.lastName.localeCompare(a.lastName)))
            }
        }
        if(sortType==="Last Comment"){
                sortingUsersByComments(customers, sortOrder)
            }

    }

    const createCustomer = async customer =>{

        try {
            const adminToken = sessionStorage.getItem('admintoken')
            const { data } = await axiosClient.post("/admin/create-user", customer, config(adminToken))

            return {
                alert: {
                    msg: "Customer created",
                    error: false
                },
                user: {
                    _id: data.user
                }
            }     
        } catch (error) {
            return {
                alert: {
                    msg: error.response.data.msg,
                    error: true
                }
            }
        }
    }

    const obtainCustomerData = async id =>{
        try {
                setDataLoading(true)
                const adminToken = sessionStorage.getItem('admintoken')
                
                if(!adminToken){
                    return
                }
                
                const { data } = await axiosClient(`/admin/user-data/${id}`, config(adminToken))

                const activeOrders = data.orders.filter(order => order.status !== "Closed" )
                const sortedComments = sortByLastCreated(data.comments)
                data.comments = sortedComments
                const activeAdded = {...data, activeOrders}
               
                setCustomerData(activeAdded)


            } catch (error) {
                console.log(error.response.data.msg)
            }
            setDataLoading(false)
    }

    const obtainComments = async frame => {
        
        setDataLoading(true)
        const adminToken = sessionStorage.getItem('admintoken')
    
        if(!adminToken){
            setDataLoading(false)
               return
        }

        try {
            const { data } = await axiosClient.post("comment/obtain-comments", {frame}, config(adminToken))

            const orderedList = sortByLastCreated(data)
            setCommentList(orderedList)
    
        } catch (error) {
            console.log(error.response.data.msg)
        }
        setDataLoading(false)
    }

    const commentIsRead = async id =>{
     
        const adminToken = sessionStorage.getItem('admintoken')
    
        if(!adminToken){
               return
        }

        try {
            await axiosClient.put("comment/admin-read", {id}, config(adminToken))

            const updatedCommentList = commentList.map(comment=>{
                if(comment._id === id){
                    comment.adminRead = true
                }
                return comment
            })
            setCommentList(updatedCommentList)
    
        } catch (error) {
            console.log(error.response.data.msg)
        }        
    }

    const obtainOrders = async frame =>{

        try {
            setDataLoading(true)
            
            const adminToken = sessionStorage.getItem('admintoken')

            if(!adminToken){
                setDataLoading(false)
                   return
            }

            const { data } = await axiosClient.post('/order/obtain-orders', {frame},  config(adminToken))

            setOrders(data)         
        } catch (error) {
            console.log(error.response.data.msg)
        }      
        setDataLoading(false) 
    }

    const sortOrders = sort => {

        if(sort==="Last updated"){
            const hasComment = [...orders].filter( order => order.comments[0])
            const nonComment = [...orders].filter( order => !order.comments[0])

            const commentsSorted = [...hasComment].sort((a,b)=>new Date(b.comments[0].createdAt)- new Date(a.comments[0].createdAt))
            setOrders([...commentsSorted, ...nonComment])
        }
        else if(sort==="Last created"){
            setOrders(sortByLastCreated(orders))
        }
    }

    const obtainItems = async () =>{

        try {

            const adminToken = sessionStorage.getItem('admintoken')

            if(!adminToken){
                return
            }
            const { data } = await axiosClient("/item/obtain-items", config(adminToken) )

            // Filter assets, the ones with active order come first, then sorted by created date.

            setItems(sortingItemsByOrders(data))
            
        } catch (error) {
            console.log((error.response.data.msg))
        }
    }

    const sortItems = (sortType, sortOrder) =>{

        if(sortOrder==="Ascending"){
            if(sortType==="Id"){
                setItems([...items].sort((a, b) => a.customId.localeCompare(b.customId)))
            }
            if(sortType==="Item Name"){
                setItems([...items].sort((a, b) => a.name.localeCompare(b.name)))
            }
            if(sortType==="Owner"){
                setItems([...items].sort((a, b) => a.owner.lastName.localeCompare(b.owner.lastName)))
            }
            if(sortType==="Last Orders"){
                setItems(sortingItemsByOrders(items))
            }
        }
        if(sortOrder==="Descending"){
            if(sortType==="Id"){
                setItems([...items].sort((a, b) => b.customId.localeCompare(a.customId)))
            }
            if(sortType==="Item Name"){
                setItems([...items].sort((a, b) => b.name.localeCompare(a.name)))
            }
            if(sortType==="Owner"){
                setItems([...items].sort((a, b) => b.owner.lastName.localeCompare(a.owner.lastName)))
            }
            if(sortType==="Last Orders"){
                setItems(sortingItemsByOrders(items).reverse())
            }
        }
    }

    const obtainItemData = async id =>{
        try {
            setDataLoading(true)
            const adminToken = sessionStorage.getItem('admintoken')
            
            if(!adminToken){
                setDataLoading(false)
                   return
            }
            
            const { data } = await axiosClient(`/item/item-data/${id}`, config(adminToken))

            
           setItemData(data)


        } catch (error) {
            console.log(error.response.data.msg)
        }
        setDataLoading(false)
    }

    const createItem = async item =>{

        try {
            const adminToken = sessionStorage.getItem('admintoken')
            const { data } = await axiosClient.post("/admin/create-item", item, config(adminToken))

            console.log(data)
            return {
                alert: {
                    msg: "Item created",
                    error: false
                },
                item: {
                    _id: data.item
                }
            }     
        } catch (error) {
            return {
                alert: {
                    msg: error.response.data.msg,
                    error: true
                }
            }
        }
    }

    return(
        <DataContext.Provider
            value={{
                customers,
                obtainCustomers,
                sortCustomers,
                createCustomer,
                customerData,
                obtainCustomerData,
                dataLoading,
                openDateDialog,
                setOpenDateDialog,
                openCreateUserDialog,
                setOpenCreateUserDialog,
                openCloseUserDialog,
                obtainComments,
                commentList,
                commentIsRead,
                setCommentList,
                obtainOrders,
                orders,
                sortOrders,
                obtainItems,
                items,
                sortItems,
                openCreateItemDialog,
                openCloseItemDialog,
                foundItem,
                setFoundItem,
                createItem,
                obtainItemData,
                itemData

            }}
        >
            {children}
        </DataContext.Provider>
    )
}

export{
    DataProvider
}

export default DataContext