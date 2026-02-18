import React, { useEffect, useState } from 'react';
import { NavLink , useNavigate} from 'react-router-dom';
import { FaSun, FaMoon, FaTasks, FaUserPlus } from 'react-icons/fa';
import { MdOutlineDashboard, MdDashboardCustomize, MdOutlineLogout, MdOutlineAccountCircle, MdCancel } from "react-icons/md";
import { LuNotebookPen } from "react-icons/lu";
import { IoDocumentsSharp, } from "react-icons/io5";
import { IoIosNotifications } from 'react-icons/io';
import { BsCalendar2EventFill } from "react-icons/bs";
import { GiHamburgerMenu } from "react-icons/gi";
import { CgProfile } from "react-icons/cg";
import Notification from './components/Notification';
import { BsPeopleFill } from 'react-icons/bs';
import { useLogOutMutation } from './redux/Profile/ProfileSlice';
import { useGetAllNotificationsQuery, useGetUserInfoQuery } from './redux/dashboard/OverviewSlice';

const Nav = ({ isDark, toggleDarkMode }) => {
// get login status from local storage


const navigate = useNavigate();

// logout rtk query

  const [logOut] = useLogOutMutation();

  // handle logout
  const handleLogout = async () => {
    try {
      await logOut().unwrap();

      // clear local storage
      localStorage.removeItem('isLoggedIn');
      
      // redirect to login page
      navigate('/login');

    } catch (error) {
      console.error('Logout failed:', error);
    }
  }


  const [displayMenu, setDisplayMenu] = useState(false);
  const [profileMenu, setProfileMenu] = useState(false);
  const [displayNotification, setDisplayNotification] = useState(false);

  const [userInfo, setUserInfo] = useState('');

  const { data: notificationData, isLoading } = useGetAllNotificationsQuery();
  const { data: userData } = useGetUserInfoQuery();

  const notifications = notificationData?.notifications ?? [];

  useEffect(() => {
   
    if (userData?.user) setUserInfo(userData.user.userName);
  }, [ userData]);

  const activeClass = 'bg-green-500 text-white font-bold rounded-2xl px-4 py-2';

  return (
    <>
      {/* Mobile Navbar */}
      <header className='fixed top-0 left-0 w-full z-50 md:hidden lg:hidden'>
        <div className='flex justify-between p-4 bg-white dark:bg-[#1E293B] text-gray-800 dark:text-gray-200'>
          <div className='flex items-center space-x-4'>
            <MdOutlineDashboard />
            <NavLink to='/dashboard' className='text-2xl font-bold font-inter text-green-500'>
              SmartVa
            </NavLink>
          </div>

          <div className='flex gap-16'>
            <div className='flex items-center gap-5'>
              <button className='text-2xl' onClick={toggleDarkMode}>
                {isDark ? <FaSun className='text-[#111827] dark:text-[#F3F4F6]' /> : <FaMoon />}
              </button>

              <button className='text-2xl' onClick={() => {
                setDisplayMenu(false);
                setProfileMenu(false);
                setDisplayNotification(!displayNotification);
              }}>
                <IoIosNotifications />
              </button>

              <button className='text-2xl' onClick={() => {
                setDisplayMenu(false);
                setProfileMenu(!profileMenu);
              }}>
                <MdOutlineAccountCircle />
              </button>
            </div>

            <button className='text-2xl' onClick={() => {
              setDisplayMenu(!displayMenu);
              setProfileMenu(false);
            }}>
              {displayMenu ? <MdCancel /> : <GiHamburgerMenu />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Links */}
      {displayMenu && (
        <div className='fixed top-0 left-0 mt-14 px-4 py-2 bg-white dark:bg-gray-800 shadow-md md:hidden z-50'>
          <ul className='flex flex-col space-y-2 text-gray-700 dark:text-gray-100 gap-6'>
            <NavLink
              to="/dashboard"
              className={({ isActive }) => isActive ? activeClass : 'hover:text-blue-500'}
              onClick={() => setDisplayMenu(false)}
            >
              <MdDashboardCustomize className='inline mr-2 text-green-500' /> Dashboard
            </NavLink>
            <NavLink
              to="/task"
              className={({ isActive }) => isActive ? activeClass : 'hover:text-blue-500'}
              onClick={() => setDisplayMenu(false)}
            >
              <FaTasks className='inline mr-2 text-green-500' /> Tasks
            </NavLink>
            <NavLink
              to="/note"
              className={({ isActive }) => isActive ? activeClass : 'hover:text-blue-500'}
              onClick={() => setDisplayMenu(false)}
            >
              <LuNotebookPen className='inline mr-2 text-green-500' /> Notes
            </NavLink>
            <NavLink
            to="/contact"
            className={({ isActive }) => isActive ? activeClass : 'ml-4 hover:text-blue-500'}
            onClick={() => setDisplayMenu(false)}
          >
            <BsPeopleFill className='inline mr-2 text-green-500' />
           Contact
          </NavLink>
            <NavLink
              to="/document"
              className={({ isActive }) => isActive ? activeClass : 'hover:text-blue-500'}
              onClick={() => setDisplayMenu(false)}
            >
              <IoDocumentsSharp className='inline mr-2 text-green-500' /> Documents
            </NavLink>
            <NavLink
              to="/visitor"
              className={({ isActive }) => isActive ? activeClass : 'hover:text-blue-500'}
              onClick={() => setDisplayMenu(false)}
            >
              <FaUserPlus className='inline mr-2 text-green-500' /> Visitors
            </NavLink>
            <NavLink
              to="/event"
              className={({ isActive }) => isActive ? activeClass : 'hover:text-blue-500'}
              onClick={() => setDisplayMenu(false)}
            >
              <BsCalendar2EventFill className='inline mr-2 text-green-500' /> Events
            </NavLink>
          </ul>
        </div>
      )}

      {/* Profile Menu */}
      {profileMenu && (
        <div className='fixed z-50 top-26 right-4 bg-white dark:bg-gray-800 shadow-md rounded-lg p-4'>
          <ul className='flex flex-col space-y-2 text-gray-700 dark:text-gray-100'>
            <NavLink to="/profile" className='hover:text-blue-500'
            onClick={()=> setProfileMenu(false)}
            >
              <CgProfile className='inline mr-2' /> Profile
            </NavLink>
            <button to="/login" className='hover:text-blue-500'
            onClick={()=> {
              setProfileMenu(false);
handleLogout();
            }}
            >
              <MdOutlineLogout className='inline mr-2' /> Logout
            </button>
          </ul>
        </div>
      )}

      {/* Notifications */}
      {displayNotification && (
        <div className='fixed z-50 top-8 lg:top-[21]  right-4 bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 grid grid-cols-1 gap-6 mb-10 mt-6 md:top-20 overflow-auto max-h-96 '>
          {notifications.length > 0 ? notifications.map(notification => (
            <Notification key={notification?._id} message={notification?.message} id={notification?._id} createdAt={notification.createdAt}/>
          )) : (
            <p className='dark:text-white'>Hey {userInfo}, looks like your notifications are on pause for now ✨</p>
          )}
        </div>
      )}

      {/* Desktop Navbar */}
      <div className='fixed w-screen gap-10 p-8 top-0 shadow-md hidden md:flex lg:flex justify-between items-center  bg-white dark:bg-[#1E293B] text-gray-800 dark:text-gray-200 z-50 '>
        <div className='flex items-center gap-2'>
          <MdDashboardCustomize />
          <NavLink
            to="/dashboard"
            className='text-2xl font-bold font-inter' 
          >
            SmartVa
          </NavLink>
        </div>

        <nav className='flex items-center gap-4'>
          <NavLink
            to="/dashboard"
            className={({ isActive }) => isActive ? activeClass : 'ml-4 hover:text-blue-500'}
          >
            <MdDashboardCustomize className='lg:hidden inline mr-2 ' />

            <span className='hidden lg:inline'> Dashboard  </span>
            
          </NavLink>
          <NavLink
            to="/task"
            className={({ isActive }) => isActive ? activeClass : 'ml-4 hover:text-blue-500'}
          >
            <FaTasks className='lg:hidden inline mr-2 ' /> 
            
            <span className='hidden lg:inline'> Tasks </span>
            
          </NavLink>
          <NavLink
            to="/note"
            className={({ isActive }) => isActive ? activeClass : 'ml-4 hover:text-blue-500'}
          >
             <LuNotebookPen className='lg:hidden inline mr-2 ' /> 

             <span className='hidden lg:inline'> Notes </span>
           
          </NavLink>
           <NavLink
            to="/contact"
            className={({ isActive }) => isActive ? activeClass : 'ml-4 hover:text-blue-500'}
          >

             <BsPeopleFill className='lg:hidden inline mr-2 ' />

             <span className='hidden lg:inline'>Contact </span>
           
          </NavLink>
          <NavLink
            to="/document"
            className={({ isActive }) => isActive ? activeClass : 'ml-4 hover:text-blue-500'}
          >
             <IoDocumentsSharp className='inline lg:hidden mr-2 ' />

             <span className='hidden lg:inline'> Documents</span>
            
          </NavLink>
          <NavLink
            to="/visitor"
            className={({ isActive }) => isActive ? activeClass : 'ml-4 hover:text-blue-500'}
          >
               <FaUserPlus className='inline lg:hidden mr-2 ' /> 
            
            <span className='hidden lg:inline' >    Visitors</span>
         
          </NavLink>
          <NavLink
            to="/event"
            className={({ isActive }) => isActive ? activeClass : 'ml-4 hover:text-blue-500'}
          >
             <BsCalendar2EventFill className='inline lg:hidden mr-2 ' />

             <span className='hidden lg:inline'>  Events</span>
           
          </NavLink>

          <button onClick={toggleDarkMode} className='ml-4'>
            {isDark ? <FaSun className='text-[#111827] dark:text-[#F3F4F6]' /> : <FaMoon />}
          </button>

          <button className='ml-2' onClick={() => {
            setDisplayMenu(false);
            setProfileMenu(false);
            setDisplayNotification(!displayNotification);
          }}>
            <IoIosNotifications />
          </button>

          <button className='ml-2' onClick={() => {
            setDisplayMenu(false);
            setDisplayNotification(false);
            setProfileMenu(!profileMenu);
          }}>
            <MdOutlineAccountCircle />
          </button>
        </nav>
      </div>
    </>
  );
};

export default Nav;
