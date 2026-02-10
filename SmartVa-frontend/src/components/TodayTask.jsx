import React, { useState } from 'react'
import { SlCalender } from "react-icons/sl";
import { useNavigate } from 'react-router';

import '../style/TodayTask.css'

const TodayTask = ({title, dueDate, id}) => {
    const navigate = useNavigate();
    const [isOn, setIsOn] = useState(true);

    const toggleSwitch = () => {
        setIsOn((prev)=> !prev);
    }
  return (
    <div className='flex gap-10 items-center bg-white dark:bg-gray-700 p-6 rounded-2xl shadow-md mt-6'>
        <div className='relative bg-green-300 rounded-2xl p-6 h-22 w-22 mt-4' >
            <SlCalender className=' absolute top-4 left-4 bottom-4 text-6xl '/> 
        </div>
       <div className='flex justify-between flex-col gap-6'>
 <strong className='text-green-600'>
{title}</strong>
        <small> Due: {`${dueDate}`} </small>
<label className='switch'>
    <input type="checkbox" checked={isOn} onChange={toggleSwitch} />
    <span className='slider round'></span>
</label>
<button onClick={()=>navigate(`/task-details/${id}`)}  className='rounded-3xl border-gray-500 bg-[#00b86b] p-2 text-white cursor-pointer text-center'>View</button>
       </div>
       
    </div>
  )
}

export default TodayTask