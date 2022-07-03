export const formatDate = date => {
    const newDate = new Date(date)

    const options = {
       
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: false
    }
    return newDate.toLocaleDateString('en-EN', options).substring(0,1).toLocaleUpperCase() + newDate.toLocaleDateString('en-EN', options).substring(1)
}

export const sortByLastCreated = (list) => {

    const listSorted = [...list].sort((a,b)=>new Date(b.createdAt)- new Date(a.createdAt))

    return listSorted
}

export const sortByLastCreatedOrder = (list) => {

    const listSorted = [...list].sort((a,b)=>new Date(b.orders[0].createdAt)- new Date(a.orders[0].createdAt))

    return listSorted
}

export const generatePassword = () =>{
    return Math.random().toString(36).slice(2,10)
}