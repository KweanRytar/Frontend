import React from 'react'

const Overview = ({name, total}) => {
  
  return (
    <div className='flex flex-col items-center justify-center bg-white dark:bg-gray-700 p-6 rounded-2xl shadow-md mt-6'>
        <strong className='text-green-600 font-bold'>{name}</strong>
        <small>{total}</small>
        </div>
  )
}

export default Overview