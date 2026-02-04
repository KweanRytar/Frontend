import React from 'react'
import { MdOutlineEmail } from "react-icons/md";
import { CiCircleMore } from "react-icons/ci";
import { FaPhoneAlt } from "react-icons/fa";


const ContactCard = ({ name,
    companyName,
    email,
    position,
    phoneNumber,
    time,
    displayDetails
    
}) => {
        const formateDate = (t) => {
const formatedDate = new Date(t).toDateString()
return formatedDate
        }
  return (
    <div className='flex flex-col gap-0 items-start bg-white dark:bg-gray-700 p-6 rounded-2xl shadow-md mt-6 '>
        <strong className='text-2xl mb-0'>{name.toUpperCase()}</strong>
        <small className=' text-gray-400 text-[0.9rem] mb-6'> 
{companyName.charAt(0).toUpperCase() + name.slice(1).toLowerCase()}</small>
      <div className='flex gap-2'>
        <MdOutlineEmail />
        <small className='font-bold'> {email.toLowerCase()}</small>
        </div> 

        <div className='flex gap-2 mb-4'>
                <FaPhoneAlt />
                     <small> 
{`0${phoneNumber}`}</small>
                </div> 
   
        <small className='font-bold mb-2'>{position}</small>
        
       
<small className='text-sm text-gray-400 mb-2'>{formateDate(time)}</small>

 <button className='rounded-3xl border-gray-500 bg-[#00b86b] p-2 text-white cursor-pointer'
 onClick={()=>{displayDetails()}}
 > <CiCircleMore className='inline mr-2 text-2xl' />
 Details</button>
    </div>
  )
}

export default ContactCard