import React from 'react'
import { IoIosContact, IoIosTime } from "react-icons/io";
import { Link } from 'react-router';


export const Visitors  = ({name, time, purpose, details}) => {
  return (
     <div className='flex gap-10 items-center bg-white dark:bg-gray-700 p-6 rounded-2xl shadow-md mt-6'>
    <div className='relative bg-green-300 rounded-2xl p-6 h-22 w-22 mt-4'><IoIosContact  className='absolute top-4 left-4 md:left-2 bottom-4 text-6xl md:text-5xl' />
    </div>
    <div className='flex flex-col gap-4'>
        <strong className='text-green-600'>{name}</strong>
    <small> <IoIosTime  className=' inline mr-4 md:mr-2'/>
     {`${time}`} </small>
    <small> 
    {purpose}</small>
    <button className='rounded-3xl border-gray-500 bg-[#00b86b] p-2 text-white cursor-pointer text-center'
    onClick={()=>details()}
    >View</button>
    </div>
    
        </div>
  )
}

export default Visitors
