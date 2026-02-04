import  {React, useState} from 'react'
import { MdCancel } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { FaDeleteLeft } from "react-icons/fa6";
import EditContact from './EditContact';
import { useDeleteContactMutation } from '../redux/Contact/ContactSlice';
import DeleteModal from './DeleteModal';





const ContactDetailsCard = ({ contact, unDisplayDetails, 
}) => {


const [deleteContact] = useDeleteContactMutation()  

const [viewEditContacts, setViewEditContacts] = useState(false)
const [currentContact, setCurrentContact] = useState()
const formateDate = (t) => {
const formatedDate = new Date(t).toDateString()
return formatedDate
        }

    const handlingDelete = async (contactId) => {
        try {
            const res = await deleteContact(contactId).unwrap()
            return res?.message
        } catch (error) {
            return error?.data?.message || "Failed to delete contact"
        }
    }
  return (
    <div className="fixed inset-0 flex flex-col items-start  justify-center bg-green-300/50 z-50">
        <div className="bg-gray-100 dark:bg-gray-800 dark:text-white rounded-2xl shadow-lg w-full max-w-4xl p-6 mx-4 overflow-y-auto max-h-[90vh]">
            <div className='flex justify-between mb-8'>
                <div className='flex flex-col'>
                     <h3 className=' text-2xl font-bold'>{contact.name}</h3>
                <small>{contact.companyName}</small>
                </div>
               <div className='flex'>
                <button  className="rounded-md cursor-pointer border-2 border-gray-500 dark:text-white p-2 hover:bg-gray-500 hover:text-white mt-2 mr-2"
                onClick={()=>{
                    setCurrentContact(contact)
                    setViewEditContacts(true)}}
          
          > <CiEdit className=' inline' />
Edit</button>

<DeleteModal dialogMessage={`Are you sure you want to delete ${contact.name}`} handlingDelete={()=> handlingDelete(contact._id)}/>
                {/* <button className="rounded-md cursor-pointer border-2 border-red-500 dark:text-white p-2 hover:text-white hover:bg-red-500 mt-2 mr-2"> <FaDeleteLeft className=' inline' />
Delete</button> */}
                <button className="rounded-md cursor-pointer border-2 border-gray-500 dark:text-white p-2 hover:bg-gray-500 hover:text-white mt-2 mr-2"
                onClick={() => unDisplayDetails()}
                > <MdCancel className=' inline' /> close</button>
               </div>
            </div>
    <div>
        <div className=' rounded-3xl border-gray-600 border-2 flex justify-between p-2 mb-6'>
        <small>Email</small>
        <strong>{contact.email}</strong>
    </div>
     <div className=' rounded-3xl border-gray-600 border-2 flex justify-between p-2 mb-6'>
        <small>Phone</small>
        <strong>{`0${contact.phoneNumber}`}</strong>
    </div>
     <div className='rounded-3xl border-gray-600 border-2 flex justify-between p-2 mb-6'>
        <small>Connection Established On:</small>
        <strong>{formateDate(contact.createdAt)}</strong>
    </div>
     <div className='rounded-3xl border-gray-600 border-2 flex justify-between p-2 mb-6'>
        <small>Modified Last On</small>
        <strong>{formateDate(contact.updatedAt)}</strong>
    </div>
     <div className=' rounded-3xl border-gray-600 border-2 flex justify-between p-2 mb-6'>
        <small>Position</small>
        <strong>{contact.position}</strong>
    </div>
    </div> 
    <button className="rounded-md cursor-pointer border-2 border-gray-500 dark:text-white p-2 hover:bg-gray-500 hover:text-white mt-2 mr-2 bg-yellow-600 text-white">send mail-comming soon</button>
     <button className="rounded-md cursor-pointer border-2 border-gray-500 dark:text-white p-2 hover:bg-gray-500 hover:text-white mt-2 mr-2 bg-yellow-600 text-white">send reminder via text-comming soon</button>
      <button className="rounded-md cursor-pointer border-2 border-gray-500 dark:text-white p-2 hover:bg-gray-500 hover:text-white mt-2 mr-2 bg-yellow-600 text-white">send reminder via mail-comming soon</button>
        </div>
       


       {viewEditContacts && <EditContact contact={currentContact} 
       close={()=>{
        setViewEditContacts(false)
       }}
       />}
    </div>
  )
}

export default ContactDetailsCard