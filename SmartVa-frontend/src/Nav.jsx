import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaSun, FaMoon, FaTasks, FaUserPlus } from 'react-icons/fa';
import { MdDashboardCustomize, MdOutlineLogout, MdOutlineAccountCircle, MdCancel } from "react-icons/md";
import { LuNotebookPen } from "react-icons/lu";
import { IoDocumentsSharp } from "react-icons/io5";
import { IoIosNotifications } from 'react-icons/io';
import { BsCalendar2EventFill, BsPeopleFill } from 'react-icons/bs';
import { GiHamburgerMenu } from 'react-icons/gi';
import { CgProfile } from 'react-icons/cg';

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

  const notifications = notificationData?.notifications ?? [];

  // Key for localStorage
  const PREV_COUNT_KEY = 'notification_prev_count';

  // Load previous count from localStorage on mount
  const [prevCount, setPrevCount] = useState(() => {
    const saved = localStorage.getItem(PREV_COUNT_KEY);
    return saved ? Number(saved) : 0;
  });

  const [hasNewNotification, setHasNewNotification] = useState(false);

  // Detect when new notifications arrive (after refetch or websocket update)
  useEffect(() => {
    const currentCount = notifications.length;

    // If we have more notifications now than last known count → new ones arrived
    if (currentCount > prevCount) {
      setHasNewNotification(true);
    }

    // Always update the stored previous count to the current one
    localStorage.setItem(PREV_COUNT_KEY, String(currentCount));
    setPrevCount(currentCount);
  }, [notifications.length]);

  // Reset the "new" indicator when user opens the notification dropdown
  const resetNewIndicator = () => {
    setHasNewNotification(false);
    // We do NOT reset prevCount here — we want it to reflect the total seen so far
  };

  useEffect(() => {
    if (userData?.user) setUserInfo(userData.user.userName);
  }, [userData]);

  const handleLogout = async () => {
    try {
      await logOut().unwrap();
      localStorage.removeItem('isLoggedIn');
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const activeClass = 'bg-green-500 text-white font-bold rounded-2xl px-4 py-2';

  return (
    <>
      {/* MOBILE HEADER */}
      <header className='fixed top-0 left-0 w-full z-50 md:hidden bg-white dark:bg-gray-900 shadow-md'>
        <div className='flex p-4 items-center relative'>
          <NavLink to="/dashboard" className='text-2xl font-bold text-green-500 flex items-center gap-2'>
            <MdDashboardCustomize /> SmartVa
          </NavLink>

          <div className='flex items-center gap-4 relative'>
            <button onClick={toggleDarkMode} aria-label="Toggle Dark Mode">
              {isDark ? <FaSun className="text-yellow-300" /> : <FaMoon className="text-gray-700" />}
            </button>

            <button
              onClick={() => {
                resetNewIndicator();
                setDisplayNotification(!displayNotification);
                setDisplayMenu(false);
                setProfileMenu(false);
              }}
              className="relative text-2xl"
              aria-label="Notifications"
            >
              <IoIosNotifications
                className={
                  hasNewNotification
                    ? "text-green-500"
                    : isDark
                    ? "text-gray-300"
                    : "text-gray-600"
                }
              />

              {hasNewNotification && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                  +
                </span>
              )}
            </button>

            <button
              onClick={() => {
                setDisplayMenu(false);
                setDisplayNotification(false);
                setProfileMenu(!profileMenu);
              }}
              aria-label="Profile"
            >
              <MdOutlineAccountCircle className={isDark ? "text-gray-300" : "text-gray-700"} />
            </button>

            <button onClick={() => setDisplayMenu(!displayMenu)} aria-label="Menu">
              {displayMenu ? (
                <MdCancel className={isDark ? "text-gray-300" : "text-gray-700"} />
              ) : (
                <GiHamburgerMenu className={isDark ? "text-gray-300" : "text-gray-700"} />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE MENU */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 shadow-lg z-50 transform transition-transform duration-300 ${
          displayMenu ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-green-500">Menu</h2>
          <button onClick={() => setDisplayMenu(false)} aria-label="Close Menu">
            <MdCancel className={isDark ? "text-gray-300" : "text-gray-700"} />
          </button>
        </div>
        <ul className="flex flex-col gap-4 p-4">
          {menuItems.map(item => (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                isActive
                  ? activeClass
                  : 'hover:text-blue-500 dark:hover:text-blue-400 flex items-center gap-2 dark:text-gray-200'
              }
              onClick={() => setDisplayMenu(false)}
            >
              <item.icon className="text-green-500" /> {item.label}
            </NavLink>
          ))}
        </ul>
      </div>

      {/* PROFILE MENU */}
      {profileMenu && (
        <div className="fixed z-50 top-16 right-4 bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 w-48 dark:text-gray-200">
          <div className="absolute -top-2 right-4 w-4 h-4 bg-white dark:bg-gray-800 rotate-45 shadow-md"></div>
          <ul className="flex flex-col gap-2 mt-2">
            <NavLink to="/profile" className="hover:text-blue-500 dark:hover:text-blue-400" onClick={() => setProfileMenu(false)}>
              <CgProfile className="inline mr-2" /> Profile
            </NavLink>
            <button onClick={handleLogout} className="hover:text-blue-500 dark:hover:text-blue-400 flex items-center gap-2">
              <MdOutlineLogout /> Logout
            </button>
          </ul>
        </div>
      )}

      {/* NOTIFICATIONS DROPDOWN */}
      {displayNotification && (
        <div className="fixed top-16 right-4 z-50 w-80 max-h-96 overflow-auto bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 dark:text-gray-200">
          <div className="absolute -top-2 right-6 w-4 h-4 bg-white dark:bg-gray-800 rotate-45 shadow-md"></div>
          {notifications.length ? (
            notifications.map(n => (
              <Notification
                key={n._id}
                message={n.message}
                id={n._id}
                createdAt={n.createdAt}
              />
            ))
          ) : (
            <p>Hey {userInfo}, your notifications are empty ✨</p>
          )}
        </div>
      )}

      {/* DESKTOP NAVBAR */}
      <header className="hidden md:flex fixed top-0 w-full z-50 bg-white dark:bg-gray-900 shadow-md px-8 py-4 items-center justify-between">
        <NavLink to="/dashboard" className="text-2xl font-bold text-green-500 flex items-center gap-2">
          <MdDashboardCustomize /> SmartVa
        </NavLink>

        <nav className="flex items-center gap-6">
          {menuItems.map(item => (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                isActive
                  ? activeClass
                  : 'hover:text-blue-500 dark:hover:text-blue-400 flex items-center gap-1 dark:text-gray-200'
              }
            >
              <item.icon className="lg:hidden text-green-500" />
              <span className="hidden lg:inline">{item.label}</span>
            </NavLink>
          ))}

          <button onClick={toggleDarkMode} aria-label="Toggle Dark Mode">
            {isDark ? <FaSun className="text-yellow-300" /> : <FaMoon className="text-gray-700" />}
          </button>

          <button
            onClick={() => {
              resetNewIndicator();
              setDisplayNotification(!displayNotification);
              setDisplayMenu(false);
              setProfileMenu(false);
            }}
            className="relative text-2xl"
            aria-label="Notifications"
          >
            <IoIosNotifications
              className={
                hasNewNotification
                  ? "text-green-500"
                  : isDark
                  ? "text-gray-300"
                  : "text-gray-600"
              }
            />

            {hasNewNotification && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                +
              </span>
            )}
          </button>

          <button
            onClick={() => {
              setDisplayMenu(false);
              setDisplayNotification(false);
              setProfileMenu(!profileMenu);
            }}
          >
            <MdOutlineAccountCircle className={isDark ? "text-gray-300" : "text-gray-700"} />
          </button>
        </nav>
      </header>
    </>
  );
};

export default Nav;