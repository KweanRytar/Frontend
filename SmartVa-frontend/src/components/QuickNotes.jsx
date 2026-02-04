import React from 'react'
import { IoNewspaper } from "react-icons/io5";



const QuickNotes = ({time, title, shortendDescription, details}) => {
  return (
    <div className='flex gap-10 items-center bg-white dark:bg-gray-700 p-6 rounded-2xl shadow-md mt-6'>
        <div className='relative bg-green-300 rounded-2xl p-6 h-22 w-22 mt-4'>
              <IoNewspaper className='absolute top-4 left-4 md:left-2 bottom-4 text-6xl md:text-5xl'/>
        </div>
    
      <div className='flex flex-col gap-4'>
        <small className=''>{time}</small>
  <strong className='text-green-600'>{title}</strong>
  <details>{shortendDescription}</details>
  <button className='rounded-3xl border-gray-500 bg-[#00b86b] p-2 text-white cursor-pointer text-center'
  onClick={(()=>details())}
  >View</button>
      </div>
  
    </div>
  )
}

export default QuickNotes