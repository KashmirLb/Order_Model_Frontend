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
    const [ orderData, setOrderData ] = useState({})
    const [ lastViewedOrders, setLastViewedOrders ] = useState([])
    const [ items, setItems ] = useState([])
    const [ itemData, setItemData ] = useState({})
    const [ adminList, setAdminList ] = useState([])
    const [ openDateDialog, setOpenDateDialog ] = useState(false)
    const [ openCreateUserDialog, setOpenCreateUserDialog ] = useState(false)
    const [ openCreateItemDialog, setOpenCreateItemDialog ] = useState(false)
    const [ openPasswordResetDialog, setOpenPasswordResetDialog ] = useState(false)
    const [ openDeleteUserDialog, setOpenDeleteUserDialog ] = useState(false)
    const [ openDeleteItemDialog, setOpenDeleteItemDialog ] = useState(false)
    const [ openCreateAdminDialog, setOpenCreateAdminDialog ] = useState(false)
    const [ openManageAdminDialog, setOpenManageAdminDialog ] = useState(false)


    const openCloseUserDialog = () =>{
        setOpenCreateUserDialog(!openCreateUserDialog)
    }

    const openCloseItemDialog = () =>{
        setOpenCreateItemDialog(!openCreateItemDialog)
    }

    const openClosePasswordResetDialog = () =>{
        setOpenPasswordResetDialog(!openPasswordResetDialog)
    }

    const openCloseDeleteUserDialog = () =>{
        setOpenDeleteUserDialog(!openDeleteUserDialog)
    }

    const openCloseDeleteItemDialog = () =>{
        setOpenDeleteItemDialog(!openDeleteItemDialog)
    }

    const openCloseCreateAdminDialog = () =>{
        setOpenCreateAdminDialog(!openCreateAdminDialog)
    }

    const openCloseManageAdminDialog = () =>{
        setCustomerData({})
        setOpenManageAdminDialog(!openManageAdminDialog)
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
            const { data } = await axiosClient('/user/user-list', config(adminToken))

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
            const { data } = await axiosClient.post("/user/create-user", customer, config(adminToken))

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
                
                const { data } = await axiosClient(`/user/user-data/${id}`, config(adminToken))

                const activeOrders = data.orders.filter(order => order.status !== "Closed" )
                const activeAdded = {...data, activeOrders}
               
                setCustomerData(activeAdded)


            } catch (error) {
                console.log(error.response.data.msg)
            }
            setDataLoading(false)
    }

    const updateCustomer = async customer =>{
        const adminToken = sessionStorage.getItem('admintoken')
    
        if(!adminToken){
               return
        }

        try {
            const { data } = await axiosClient.put("user/update-user", customer, config(adminToken))

            return {
                msg: data.msg,
                error: false
            }
        } catch (error) {
            return {
                msg: error.response.data.msg,
                error: true
            }
        }    
    
    }

    const passwordReset = async user =>{
        const adminToken = sessionStorage.getItem('admintoken')
    
        if(!adminToken){
               return
        }

        try {
            const { data } = await axiosClient.put("user/reset-password", user, config(adminToken))

            return {
                msg: data.msg,
                error: false
            }
        } catch (error) {
            return {
                msg: error.response.data.msg,
                error: true
            }
        }    
    }

    const deleteUser = async id =>{
        const adminToken = sessionStorage.getItem('admintoken')
    
        if(!adminToken){
               return
        }

        try {
            const { data } = await axiosClient.post("user/delete-user", {id}, config(adminToken))

            return {
                msg: data.msg,
                error: false
            }
            
        } catch (error) {
            return {
                msg: error.response.data.msg,
                error: true
            }
        }    
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

    const createComment = async comment =>{
        const adminToken = sessionStorage.getItem('admintoken')

        if(!adminToken){
            return
        }

     try {
        await axiosClient.post("comment/admin-creates", comment, config(adminToken))



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
    
    const createOrder = async newOrder =>{
        
        try {
            const adminToken = sessionStorage.getItem('admintoken')
            const { data } = await axiosClient.post("/order/create-order", newOrder, config(adminToken))
            
            return {
                alert: {
                    msg: data.msg,
                    error: false
                },
                order: {
                    _id: data.order
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
    
    const obtainOrderData = async id =>{
        try {
            setDataLoading(true)
            const adminToken = sessionStorage.getItem('admintoken')
            
            if(!adminToken){
                return
            }
            
            const { data } = await axiosClient(`/order/obtain-order-data/${id}`, config(adminToken))
            
            
            
            setOrderData(data)
            
            
        } catch (error) {
            console.log(error.response.data.msg)
        }
        setDataLoading(false)
    }
    
    const addLastViewedOrder = async id =>{
        try {
            const adminToken = sessionStorage.getItem('admintoken')
            await axiosClient.put("/admin/add-viewed-order", {id}, config(adminToken))
        } catch (error) {
            console.log(error)
        } 
    }

    const obtainLastViewedOrders = async ()=>{
        setDataLoading(true)
        try {            
            const adminToken = sessionStorage.getItem('admintoken')

            if(!adminToken){
                setDataLoading(false)
                   return
            }

            const { data } = await axiosClient('/admin/obtain-last-viewed', config(adminToken))

           setLastViewedOrders(data.orders.reverse())     
        } catch (error) {
            console.log(error.response.data.msg)
        }    
        setDataLoading(false)  
    }

    const updateOrder = async order =>{
        const adminToken = sessionStorage.getItem('admintoken')
    
        if(!adminToken){
               return
        }

        try {
            await axiosClient.put("order/update-order", order, config(adminToken))
        } catch (error) {
            console.log(error.response.data.msg)
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
            const { data } = await axiosClient.post("/item/create-item", item, config(adminToken))

            return {
                alert: {
                    msg: "Item created",
                    error: false
                },
                item: {
                    _id: data.item,
                    customId: data.customId
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

    const updateItem = async item =>{
        const adminToken = sessionStorage.getItem('admintoken')
    
        if(!adminToken){
               return
        }

        try {
            const { data } = await axiosClient.put("item/update-item", item, config(adminToken))

            return {
                msg: data.msg,
                error: false
            }
        } catch (error) {
            return {
                msg: error.response.data.msg,
                error: true
            }
        }    
    }

    const deleteItem = async id =>{
        const adminToken = sessionStorage.getItem('admintoken')
    
        if(!adminToken){
               return
        }

        try {
            const { data } = await axiosClient.post("item/delete-item", {id}, config(adminToken))

            return {
                msg: data.msg,
                error: false
            }
            
        } catch (error) {
            return {
                msg: error.response.data.msg,
                error: true
            }
        }    
    }

    const updateAdmin = async admin =>{
        const adminToken = sessionStorage.getItem('admintoken')
    
        if(!adminToken){
               return
        }

        try {
            const { data } = await axiosClient.put("admin/update-admin", admin, config(adminToken))

            return {
                msg: data.msg,
                error: false
            }
        } catch (error) {
            return {
                msg: error.response.data.msg,
                error: true
            }
        }
    }

    const createAdmin = async admin =>{

        try {
            const adminToken = sessionStorage.getItem('admintoken')
            const { data } = await axiosClient.post("/admin/create-admin", admin, config(adminToken))

            return {
                alert: {
                    msg: data.msg,
                    error: false
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

    const obtainAdminList = async () =>{
        try {
            
            const adminToken = sessionStorage.getItem('admintoken')
            const { data } = await axiosClient('/admin/admin-list', config(adminToken))

            setAdminList(data)

        } catch (error) {
            console.log(error.response.data.msg)
        }       
    }

    const adminPasswordReset = async admin =>{

        const adminToken = sessionStorage.getItem('admintoken')
    
        if(!adminToken){
               return
        }

        try {
            const { data } = await axiosClient.put("admin/reset-password", admin, config(adminToken))

            return {
                msg: data.msg,
                error: false
            }
        } catch (error) {
            return {
                msg: error.response.data.msg,
                error: true
            }
        }    
    }

    const activateDisableAdmin = async id =>{
        const adminToken = sessionStorage.getItem('admintoken')
    
        if(!adminToken){
               return
        }

        try {
            const { data } = await axiosClient.put("admin/activate-disable", id, config(adminToken))

            return {
                msg: data.msg,
                error: false
            }
        } catch (error) {
            return {
                msg: error.response.data.msg,
                error: true
            }
        }    
    }

    const removeFirstLogin = async ()=>{
        const adminToken = sessionStorage.getItem('admintoken')
    
        if(!adminToken){
               return
        }

        try {
            await axiosClient.put("admin/remove-first-login", {}, config(adminToken))
        } catch (error) {
            console.log(error)
        }    
    }

    const logoutAdminData = () =>{
        setCustomers([])
        setCustomerData({})
        setCommentList([])
        setOrders([])
        setOrderData({})
        setLastViewedOrders([])
        setItems([])
        setItemData({})
        setAdminList([])
    }

    return(
        <DataContext.Provider
            value={{
                customers,
                obtainCustomers,
                sortCustomers,
                createCustomer,
                customerData,
                setCustomerData,
                obtainCustomerData,
                updateCustomer,
                passwordReset,
                openClosePasswordResetDialog,
                openPasswordResetDialog,
                dataLoading,
                openDateDialog,
                setOpenDateDialog,
                openCreateUserDialog,
                setOpenCreateUserDialog,
                openCloseUserDialog,
                openCloseDeleteUserDialog,
                openDeleteUserDialog,
                deleteUser,
                obtainComments,
                commentList,
                commentIsRead,
                createComment,
                setCommentList,
                obtainOrders,
                orders,
                sortOrders,
                obtainOrderData,
                orderData,
                addLastViewedOrder,
                obtainLastViewedOrders,
                lastViewedOrders,
                setOrderData,
                createOrder,
                updateOrder,
                obtainItems,
                items,
                sortItems,
                openCreateItemDialog,
                openCloseItemDialog,
                createItem,
                obtainItemData,
                itemData,
                setItemData,
                updateItem,
                openCloseDeleteItemDialog,
                openDeleteItemDialog,
                deleteItem,
                updateAdmin,
                openCreateAdminDialog,
                openCloseCreateAdminDialog,
                createAdmin,
                adminList,
                obtainAdminList,
                openManageAdminDialog,
                openCloseManageAdminDialog,
                adminPasswordReset,
                activateDisableAdmin,
                logoutAdminData,
                removeFirstLogin
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