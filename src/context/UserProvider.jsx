import { useState } from "react";
import { createContext } from "react";
import axiosClient from "../../config/axiosClient";
import { sortByLastCreated, sortByLastCreatedOrder } from "../helpers";

const UserContext = createContext()

const UserProvider = ({children}) =>{

    const [ userOrders, setUserOrders ] = useState([])
    const [ userOrderData, setUserOrderData ] = useState({})
    const [ userCommentList, setUserCommentList ] = useState([])
    const [ userItems, setUserItems ] = useState([])
    const [ userItemData, setUserItemData ] = useState({})
    const [ openChangePasswordDialog, setOpenChangePasswordDialog ] = useState(false)
    const [ openChangeContactDialog, setOpenChangeContactDialog ] = useState(false)
    const [ openDeleteAccountDialog, setOpenDeleteAccountDialog ] = useState(false)

    const openCloseChangePasswordDialog = () =>{
        setOpenChangePasswordDialog(!openChangePasswordDialog)
    }

    const openCloseChangeContactDialog = () =>{
        setOpenChangeContactDialog(!openChangeContactDialog)
    }

    const openCloseDeleteAccountDialog = () =>{
        setOpenDeleteAccountDialog(!openDeleteAccountDialog)
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

    const obtainUserOrders = async frame =>{

        try {
           
            const userToken = sessionStorage.getItem('usertoken')

            if(!userToken){
                   return
            }

            const { data } = await axiosClient.post('/order/obtain-user-orders', {frame},  config(userToken))

            setUserOrders(data)         
        } catch (error) {
            console.log(error.response.data.msg)
        }      
    }

    const sortUserOrders = sort => {
        
        if(sort==="Last updated"){
            const hasComment = [...userOrders].filter( order => order.comments[0])
            const nonComment = [...userOrders].filter( order => !order.comments[0])
            
            const commentsSorted = [...hasComment].sort((a,b)=>new Date(b.comments[0].createdAt)- new Date(a.comments[0].createdAt))
            setUserOrders([...commentsSorted, ...nonComment])
        }
        else if(sort==="Last created"){
            setUserOrders(sortByLastCreated(userOrders))
        }
    }

    const userCommentIsRead = async id =>{
        
        const userToken = sessionStorage.getItem('usertoken')

        if(!userToken){
               return
        }

        try {
            await axiosClient.put("comment/user-read", {id}, config(userToken))

            const updatedCommentList = userCommentList.map(comment=>{
                if(comment._id === id){
                    comment.userRead = true
                }
                return comment
            })
            setUserCommentList(updatedCommentList)
    
        } catch (error) {
            console.log(error.response.data.msg)
        }        
    }

    const userObtainOrderData = async id =>{

        try{
         
            const userToken = sessionStorage.getItem('usertoken')

            if(!userToken){
                return
            }
            
            const { data } = await axiosClient(`/order/user-obtain-order-data/${id}`, config(userToken))
            
            setUserOrderData(data)
            
        } catch (error) {
            console.log(error.response.data.msg)
        }

    }

    const userCreateComment = async comment =>{
        const userToken = sessionStorage.getItem('usertoken')

        if(!userToken){
               return
        }

        try {
            await axiosClient.post("comment/user-creates", comment, config(userToken))

        } catch (error) {
            console.log(error.response.data.msg)
        }        
    }

    const userObtainItems = async () =>{
        try {

            const userToken = sessionStorage.getItem('usertoken')

            if(!userToken){
                   return
            }
            const { data } = await axiosClient("/item/user-obtain-items", config(userToken) )

            // Filter assets, the ones with active order come first, then sorted by created date.

            setUserItems(sortingItemsByOrders(data))
            
        } catch (error) {
            console.log((error.response.data.msg))
        }
    }

    const userSortItems = (sortType, sortOrder) =>{

        if(sortOrder==="Ascending"){
            if(sortType==="Id"){
                setUserItems([...userItems].sort((a, b) => a.customId.localeCompare(b.customId)))
            }
            if(sortType==="Item Name"){
                setUserItems([...userItems].sort((a, b) => a.name.localeCompare(b.name)))
            }
            if(sortType==="Owner"){
                setUserItems([...userItems].sort((a, b) => a.owner.lastName.localeCompare(b.owner.lastName)))
            }
            if(sortType==="Last Orders"){
                setUserItems(sortingItemsByOrders(userItems))
            }
        }
        if(sortOrder==="Descending"){
            if(sortType==="Id"){
                setUserItems([...userItems].sort((a, b) => b.customId.localeCompare(a.customId)))
            }
            if(sortType==="Item Name"){
                setUserItems([...userItems].sort((a, b) => b.name.localeCompare(a.name)))
            }
            if(sortType==="Owner"){
                setUserItems([...userItems].sort((a, b) => b.owner.lastName.localeCompare(a.owner.lastName)))
            }
            if(sortType==="Last Orders"){
                setUserItems(sortingItemsByOrders(userItems).reverse())
            }
        }
    }

    const userObtainComments = async frame =>{
        const userToken = sessionStorage.getItem('usertoken')

        if(!userToken){
               return
        }

        try {
            const { data } = await axiosClient.post("comment/user-obtain-comments", {frame}, config(userToken))

            const orderedList = sortByLastCreated(data)

            setUserCommentList(orderedList)
    
        } catch (error) {
            console.log(error.response.data.msg)
        }
    }

    const userObtainItemData = async id =>{
        const userToken = sessionStorage.getItem('usertoken')

        if(!userToken){
               return
        }
        try{
            const { data } = await axiosClient(`/item/user-item-data/${id}`, config(userToken))

            setUserItemData(data)
        } catch (error) {
            console.log(error.response.data.msg)
        }
    }

    const userChangePassword = async password=>{
        const userToken = sessionStorage.getItem('usertoken')

        if(!userToken){
               return
        }
        try{
            const { data } = await axiosClient.put("/user/password-change", {password},  config(userToken))

            return {
                msg: data.msg,
                error: false
            }
        } catch (error) {
            console.log(error.response.data.msg)
            return {
                msg: "Could not change password",
                error: true
            }
        }
    }

    const userChangeContact = async details =>{
        const userToken = sessionStorage.getItem('usertoken')

        if(!userToken){
               return
        }
        try{
            const { data } = await axiosClient.put("/user/contact-change", details,  config(userToken))

            return {
                msg: data.msg,
                error: false
            }
        } catch (error) {
            console.log(error.response.data.msg)
            return {
                msg: "Could not change details",
                error: true
            }
        }
    }

    const deleteAccount = async id =>{
        const userToken = sessionStorage.getItem('usertoken')

        if(!userToken){
               return
        }
        try{
            const { data } = await axiosClient.post("/user/delete-account",{id}, config(userToken))

            return {
                msg: data.msg,
                error: false
            }
        } catch (error) {
            console.log(error.response.data.msg)
            return {
                msg: "Error deleting account",
                error: true
            }
        }
    }

    const logoutUser = () =>{
        setUserOrders([])
        setUserOrderData({})
        setUserCommentList([])
        setUserItems([])
        setUserItemData({})
    }

    const userRemoveFirstLogin = async ()=>{

        const userToken = sessionStorage.getItem('usertoken')

        if(!userToken){
               return
        }
        try{
            await axiosClient.put("/user/remove-first-login", {}, config(userToken))

        } catch (error) {
            console.log(error.response.data.msg)
        }

    }

    return(
        <UserContext.Provider
            value={{
                obtainUserOrders,
                userOrders,
                sortUserOrders,
                userObtainOrderData,
                userOrderData,
                setUserOrderData,
                userCommentIsRead,
                userCreateComment,  
                userObtainItems,
                userSortItems,
                userItems,
                userObtainComments,
                userCommentList,
                userObtainItemData,
                userItemData,
                openCloseChangePasswordDialog,
                openChangePasswordDialog, 
                userChangePassword,
                openCloseChangeContactDialog,
                openChangeContactDialog,
                userChangeContact,
                openCloseDeleteAccountDialog,
                openDeleteAccountDialog,
                deleteAccount,
                logoutUser,
                userRemoveFirstLogin
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