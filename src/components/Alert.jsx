import React from 'react'

const Alert = ({alert}) => {

    const { msg, error } = alert

  return (
    <div className={`${error ? "bg-red-600" : "bg-light-blue"} w-full text-center py-3 rounded-md text-white uppercase font-bold shadow-md`}>
        {msg}
    </div>
  )
}

export default Alert