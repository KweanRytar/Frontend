import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaSun, FaMoon, FaTasks, FaUserPlus } from 'react-icons/fa';
import { MdDashboardCustomize, MdOutlineLogout, MdOutlineAccountCircle, MdCancel } from "react-icons/md";
import { LuNotebookPen } from "react-icons/lu";
import { IoDocumentsSharp } from "react-icons/io5";
import { IoIosNotifications } from 'react-icons/io';
import { BsCalendar2EventFill, BsPeopleFill } from "react-icons/bs";
import { GiHamburgerMenu } from "react-icons/gi";
import { CgProfile } from "react-icons/cg";

import Notification from './components/Notification';
import { useLogOutMutation } from './redux/Profile/ProfileSlice';
import { useGetAllNotificationsQuery, useGetUserInfoQuery } from './redux/dashboard/OverviewSlice';

const menuItems = [
  { label: 'Dashboard', icon: MdDashboardCustomize, to: '/dashboard' },
  { label: 'Tasks', icon: FaTasks, to: '/task' },
  { label: 'Notes', icon: LuNotebookPen, to: '/note' },
  { label: 'Contacts', icon: BsPeopleFill, to: '/contact' },
  { label: 'Documents', icon: IoDocumentsSharp, to: '/document' },
  { label: 'Visitors', icon: FaUserPlus, to: '/visitor' },
  { label: 'Events', icon: BsCalendar2EventFill, to: '/event' },
];

const Nav = ({ isDark, toggleDarkMode }) => {
  const navigate = useNavigate();
  const [logOut] = useLogOutMutation();

  const [displayMenu, setDisplayMenu] = useState(false);
  const [profileMenu, setProfileMenu] = useState(false);
  const [displayNotification, setDisplayNotification] = useState(false);
  const [userInfo, setUserInfo] = useState('');

  const { data: notificationData } = useGetAllNotificationsQuery();
  const { data: userData } = useGetUserInfoQuery();

  const [hasNewNotification, setHasNewNotification] = useState(false);
  const [prevNotificationCount, setPrevNotificationCount] = useState(0);

  // useEffect to change the color of the notification icon when a new notification arrives
  useEffect(() => {
    const currentCount = notificationData?.notifications?.length || 0;
    if (currentCount > prevNotificationCount) {
      setHasNewNotification(true);
    }

    setPrevNotificationCount(currentCount);
  }, [notificationData]);

  // reset hasnewnotification 
  const resetNewNotification = () => {
    setHasNewNotification(false);
  }


  useEffect(() => {
    if (userData?.user) setUserInfo(userData.user.userName);
  }, [userData]);

  const notifications = notificationData?.notifications ?? [];
  const activeClass = 'bg-green-500 text-white font-bold rounded-2xl px-4 py-2';

  const handleLogout = async () => {
    try {
      await logOut().unwrap();
      localStorage.removeItem('isLoggedIn');
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <>
      {/* MOBILE HEADER */}
      <header className='fixed top-0 left-0 w-full z-50 md:hidden bg-white dark:bg-[#1E293B] shadow-md'>
        <div className='flex justify-between p-4 items-center'>
          <NavLink to="/dashboard" className='text-2xl font-bold text-green-500 flex items-center gap-2'>
            <MdDashboardCustomize /> SmartVa
          </NavLink>

          <div className='flex items-center gap-4'>
            <button onClick={toggleDarkMode} aria-label="Toggle Dark Mode">
              {isDark ? <FaSun /> : <FaMoon />}
            </button>

            <button onClick={() => {
              resetNewNotification();
              setDisplayMenu(false);
              setProfileMenu(false);
              setDisplayNotification(!displayNotification);
            }} aria-label="Notifications">
              <IoIosNotifications className={hasNewNotification ? "text-green-500" : "text-gray-500"}/>
              {hasNewNotification && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>}
            </button>

            <button onClick={() => {
              setDisplayMenu(false);
              setDisplayNotification(false);
              setProfileMenu(!profileMenu);
            }} aria-label="Profile">
              <MdOutlineAccountCircle />
            </button>

            <button onClick={() => setDisplayMenu(!displayMenu)} aria-label="Menu">
              {displayMenu ? <MdCancel /> : <GiHamburgerMenu />}
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE MENU (SLIDE-IN) */}
      <div className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 shadow-lg z-50 transform transition-transform duration-300 ease-in-out
                      ${displayMenu ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className='text-lg font-bold text-green-500'>Menu</h2>
          <button onClick={() => setDisplayMenu(false)} aria-label="Close Menu">
            <MdCancel />
          </button>
        </div>
        <ul className='flex flex-col gap-4 p-4'>
          {menuItems.map(item => (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) => isActive ? activeClass : 'hover:text-blue-500 flex items-center gap-2'}
              onClick={() => setDisplayMenu(false)}
            >
              <item.icon className='text-green-500' /> {item.label}
            </NavLink>
          ))}
        </ul>
      </div>

      {/* PROFILE MENU WITH ARROW */}
      {profileMenu && (
        <div className='fixed z-50 top-16 right-4 bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 w-48'>
          <div className='absolute -top-2 right-4 w-4 h-4 bg-white dark:bg-gray-800 rotate-45 shadow-md'></div>
          <ul className='flex flex-col gap-2 mt-2'>
            <NavLink to="/profile" className='hover:text-blue-500' onClick={() => setProfileMenu(false)}>
              <CgProfile className='inline mr-2' /> Profile
            </NavLink>
            <button onClick={handleLogout} className='hover:text-blue-500 flex items-center gap-2'>
              <MdOutlineLogout /> Logout
            </button>
          </ul>
        </div>
      )}

      {/* NOTIFICATIONS WITH ARROW */}
      {displayNotification && (
        <div className='fixed top-16 right-4 z-50 w-80 max-h-96 overflow-auto bg-white dark:bg-gray-800 shadow-md rounded-lg p-4'>
          <div className='absolute -top-2 right-6 w-4 h-4 bg-white dark:bg-gray-800 rotate-45 shadow-md'></div>
          {notifications.length ? notifications.map(n => (
            <Notification key={n._id} message={n.message} id={n._id} createdAt={n.createdAt} />
          )) : (
            <p className='dark:text-white'>Hey {userInfo}, your notifications are empty ✨</p>
          )}
        </div>
      )}

      {/* DESKTOP NAVBAR */}
      <header className='hidden md:flex fixed top-0 w-full z-50 bg-white dark:bg-[#1E293B] shadow-md px-8 py-4 items-center justify-between'>
        <NavLink to="/dashboard" className='text-2xl font-bold text-green-500 flex items-center gap-2'>
          <MdDashboardCustomize /> SmartVa
        </NavLink>

        <nav className='flex items-center gap-6'>
          {menuItems.map(item => (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) => isActive ? activeClass : 'hover:text-blue-500 flex items-center gap-1'}
            >
              <item.icon className='lg:hidden text-green-500' /> <span className='hidden lg:inline'>{item.label}</span>
            </NavLink>
          ))}

          <button onClick={toggleDarkMode} aria-label="Toggle Dark Mode">
            {isDark ? <FaSun /> : <FaMoon />}
          </button>

          <button onClick={() => {
            setDisplayMenu(false);
            setProfileMenu(false);
            setDisplayNotification(!displayNotification);
          }}>
            <IoIosNotifications />
          </button>

          <button onClick={() => {
            setDisplayMenu(false);
            setDisplayNotification(false);
            setProfileMenu(!profileMenu);
          }}>
            <MdOutlineAccountCircle />
          </button>
        </nav>
      </header>
    </>
  );
};

export default Nav;
