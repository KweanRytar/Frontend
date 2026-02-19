import React, { useState } from "react";
import { FaHamburger,  } from "react-icons/fa";
import { MdCancel } from "react-icons/md";

const LandingPageNavBar = () => {
  const navLinks = [
    { name: "features", href: "#features" },
    { name: "use cases", href: "#use-cases" },
    { name: "contact", href: "#contact" },
    { name: "pricing", href: "#pricing" },
    { name: "FAQ", href: "#faq" },
  ];
  const [viewMenu, setViewMenu] = useState(false);

  const getStartedLinks = [
    { name: "login", href: "https://www.smartvirtualassistants.site/login" },
    {
      name: "register",
      href: "https://www.smartvirtualassistants.site/signup",
    },
  ];
  return (
    <>
    {/* desktop navbar */}
    <div className="hidden md:flex">
      <nav className="fixed top-0 left-0 right-0 z-20  bg-transparent dark:bg-[#1E293B]  p-4 md:p-6 flex items-center justify-between">
        <div className="flex gap-1.5">
          <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xl font-semibold shadow-md">
            S
          </div>
          <h1>SmartVa</h1>
        </div>

        <div className="flex gap-1.5">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-gray-800 dark:text-gray-200 hover:text-emerald-500 mx-4"
            >
              {link.name}
            </a>
          ))}
        </div>
        <div className="flex gap-1.5">
          {getStartedLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-gray-800 dark:text-gray-200 hover:text-emerald-500 mx-4"
            >
              {link.name}
            </a>
          ))}
        </div>
      </nav>
    </div>

    {/* mobile navbar */}
    <div className="flex  justify-between  md:hidden">
        <nav className="fixed top-0 left-0 right-0 z-20  bg-transparent dark:bg-[#1E293B]  p-4 md:p-6 flex items-center justify-between">
        <div className="flex gap-1.5">
            <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xl font-semibold shadow-md">s</div>
            <h1>SmartVa</h1>
        </div>

          <div className="flex gap-1.5">
            {getStartedLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-gray-800 dark:text-gray-200 hover:text-emerald-500 mx-4"
              >
                {link.name}
              </a>
            ))}
          </div>

        <button onClick={() => setViewMenu((prev) => !prev)}>
            {viewMenu ? (
                <MdCancel size={24} className="text-gray-800 dark:text-gray-200" />
            ) : (
                <FaHamburger size={24} className="text-gray-800 dark:text-gray-200" />
            )}
        </button>
        </nav>
    </div>

    {/* sliding in from left mobile menu */}
    <div className={`fixed top-0 left-0 h-full w-3/4 bg-[#1E293B] z-30 transform ${viewMenu ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out`}>
        <div className="flex flex-col items-start p-6 gap-6">
            {navLinks.map((link) => (
                <a
                    key={link.name}
                    href={link.href}
                    className="text-gray-200 hover:text-emerald-500 text-lg"
                    onClick={() => setViewMenu(false)} // close menu on link click
                >
                    {link.name}
                </a>
            ))}
        </div>
    </div>
     </>
  );
 
};

export default LandingPageNavBar;
