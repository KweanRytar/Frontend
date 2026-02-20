import React, { useEffect, useState } from "react";
import { FaBars } from "react-icons/fa";
import { MdClose } from "react-icons/md";

const LandingPageNavBar = () => {
  const [viewMenu, setViewMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");

  const navLinks = [
    { name: "Features", href: "#features" },
    { name: "Use Cases", href: "#use-cases" },
    { name: "Pricing", href: "#pricing" },
    { name: "FAQ", href: "#faq" },
  ];

  // Detect scroll for navbar styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Active section highlight
  useEffect(() => {
    const handleScroll = () => {
      navLinks.forEach((link) => {
        const section = document.querySelector(link.href);
        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.top <= 120 && rect.bottom >= 120) {
            setActive(link.href);
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* NAVBAR */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700 shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">

          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 text-white flex items-center justify-center font-semibold shadow-sm">
              S
            </div>
            <span className="text-lg font-semibold tracking-tight text-gray-900 dark:text-white">
              SmartVA
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition ${
                  active === link.href
                    ? "text-emerald-600"
                    : "text-gray-600 dark:text-gray-300 hover:text-emerald-600"
                }`}
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-6">
            <a
              href="https://www.smartvirtualassistants.site/login"
              className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-emerald-600 transition"
            >
              Login
            </a>

            <a
              href="https://www.smartvirtualassistants.site/signup"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-200"
            >
              Get Started
            </a>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setViewMenu(!viewMenu)}
            className="md:hidden text-gray-800 dark:text-white"
          >
            {viewMenu ? <MdClose size={26} /> : <FaBars size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile Overlay */}
      {viewMenu && (
        <div
          onClick={() => setViewMenu(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white dark:bg-slate-900 shadow-2xl z-50 transform transition-transform duration-300 md:hidden ${
          viewMenu ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-8 mt-20 flex flex-col gap-8">

          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setViewMenu(false)}
              className="text-base font-medium text-gray-700 dark:text-gray-200 hover:text-emerald-600 transition"
            >
              {link.name}
            </a>
          ))}

          <div className="pt-6 border-t border-gray-200 dark:border-gray-700 flex flex-col gap-5">
            <a
              href="https://www.smartvirtualassistants.site/login"
              className="text-gray-600 dark:text-gray-300 hover:text-emerald-600"
            >
              Login
            </a>

            <a
              href="https://www.smartvirtualassistants.site/signup"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-lg text-center font-semibold shadow-md"
            >
              Get Started
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default LandingPageNavBar;