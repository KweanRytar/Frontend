import React from 'react'
import { MdEventBusy } from "react-icons/md";
import { IoIosTime } from "react-icons/io";
import { FaLocationArrow } from "react-icons/fa";
import { useNavigate } from 'react-router';


const UpcomingEvents = ({title, date, venue, id}) => {
  const navigate = useNavigate();
  return (
    <div className='flex gap-10 items-center bg-white dark:bg-gray-700 p-6 rounded-2xl shadow-md mt-6'>
<div className='relative bg-green-300 rounded-2xl p-6 h-22 w-22 mt-4'><MdEventBusy className=' absolute top-4 left-4 bottom-4 text-6xl ' />
</div>
<div className='flex flex-col gap-4'>
    <strong className='text-green-600'>{title}</strong>
<small> <IoIosTime  className=' inline mr-4 md:mr-2'/>
 {`${date}`} </small>
<small> <FaLocationArrow className=' inline mr-4 md:mr-2' />
{venue}</small>
<button  onClick={()=>navigate('/event-details/${id}')}  className='rounded-3xl border-gray-500 bg-[#00b86b] p-2 text-white cursor-pointer text-center'>View</button>
</div>

    </div>
  )
}

export default UpcomingEvents