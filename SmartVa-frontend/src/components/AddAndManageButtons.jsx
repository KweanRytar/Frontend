import React from 'react'
import { FaPlus } from "react-icons/fa";
import { useNavigate } from 'react-router';

const AddAndManageButtons = ({manage, inform, display, direction}) => {
  const navigate = useNavigate();
  return (
    <div className='flex justify-between items-center'>

  {/* Manage Notes Button */}
  <button className='bg-[#00B86B] text-[#FFFFFF] rounded-2xl w-24 hover:bg-[#00995A] dark:hover:bg-[#00B86B] p-2'
  onClick={()=>navigate(direction)}
  >
{  manage
}  </button>

  {/* Plus Button with Tooltip */}
  <div className="relative group">
    <button className='bg-[#00B86B] text-white rounded-2xl w-14 h-12 hover:bg-[#00995A] dark:hover:bg-[#00B86B] flex items-center justify-center'
    onClick={()=>display()}
    >
      <FaPlus />
    </button>

    {/* Tooltip */}
    <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10">
{      inform
}    </span>
  </div>

</div>

  )
}

export default AddAndManageButtons