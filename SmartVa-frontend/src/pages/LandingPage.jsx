import React from 'react'

import LandingPageNavBar from '../components/LandingPageNavBar'
import Features from '../components/Features'
import UseCases from '../components/UseCases'
import Questions from '../components/Questions'
import Pricing from '../components/Pricing'
import overviewPlaceHolder from '../assets/rgisterBestOption.jpg'
import { FaCircle, FaTwitter, FaLinkedin, FaInstagram, FaGithub } from 'react-icons/fa'
import { MdMoveUp, MdMoveDown } from 'react-icons/md'

const LandingPage = ({ isDark, toggleDarkMode }) => {
  const pinkBulletedPoints = [
    'Switching between Todoist, Notion, Google Calendar, Email contacts...',
    'Trying to keep track of everything in your head',
    'Feeling overwhelmed by the number of apps you use',
    'missing important deadlines or forgetting tasks because they are scattered across different platforms',
    'scattered documents, visitor logs and meeting notes in random folders',
  ]

  const lightGreenBulletedPoints = [
    'Everything centralized in one responsive dashboard-tasks, notes, docs, visiotrs, events, contacts and notifications',
    'Real-time sync and a focused notification center that surfaces only what matters',
    'Rich text notes, document organizer and visitor tracker in one place',
    'Clean Calendar & events view to keep your day structured without clutter',
  ]

  return (
    <div className="min-h-screen bg-[#f5faf7] dark:bg-gray-900 dark:text-white">
      <LandingPageNavBar isDark={isDark} toggleDarkMode={toggleDarkMode} />

      {/* HERO SECTION */}
      <section id="hero" className="py-24">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">

            {/* LEFT SIDE */}
            <div>
              <div className="bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 rounded-full inline-block">
                <small className="text-emerald-600 font-medium">
                  Free Forever • No credit card • No trials
                </small>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mt-8 leading-tight">
                SmartVa Your All In One Productivity Dashboard
              </h1>

              <p className="text-lg mt-6 text-gray-600 dark:text-gray-300">
                Streamline your tasks, notes, documents, contacts, events, visitors and notifications
                in one intuitive workspace. Stay organized and boost efficiency without switching apps.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 text-sm text-gray-700 dark:text-gray-300">
                <p>Real time updates</p>
                <p>Beautiful dark mode interface</p>
                <p>100 percent free forever</p>
                <p>Built for individuals and small teams</p>
              </div>

              <div className="mt-10 flex flex-col sm:flex-row sm:items-center gap-4">
                <a
                  href="https://www.smartvirtualassistants.site/signup"
                  className="bg-[#18bb85] hover:bg-[#16a77c] text-white px-8 py-3 rounded-xl font-medium transition"
                >
                  Get Started Free
                </a>
                <small className="text-gray-500 dark:text-gray-400">
                  Set up your workspace in under 30 seconds
                </small>
              </div>
            </div>

            {/* RIGHT SIDE IMAGE */}
            <div className="relative">
              <div className="shadow-2xl rounded-3xl overflow-hidden">
                <img
                  src={overviewPlaceHolder}
                  alt="SmartVa dashboard overview"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>

          </div>

          {/* Problem Intro */}
          <div className="mt-10 px-0">
            <h2 className="text-2xl md:text-3xl font-bold">
              Tired of juggling multiple productivity apps?
            </h2>
            <p className="mt-4 text-gray-600 dark:text-gray-300">
              SmartVa replaces scattered tools with one structured, centralized dashboard.
            </p>
          </div>

          {/* Problem vs Solution Columns */}
          <div className="mt-10 grid md:grid-cols-2 gap-12">
            <div className="space-y-5">
              {pinkBulletedPoints.map((point, index) => (
                <div key={index} className="flex items-start gap-3">
                  <FaCircle className="text-red-300 mt-1 text-xs flex-shrink-0" />
                  <p className="text-gray-700 dark:text-gray-300">{point}</p>
                </div>
              ))}
            </div>
            <div className="space-y-5">
              {lightGreenBulletedPoints.map((point, index) => (
                <div key={index} className="flex items-start gap-3">
                  <FaCircle className="text-emerald-400 mt-1 text-xs flex-shrink-0" />
                  <p className="text-gray-700 dark:text-gray-300">{point}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* FEATURES - full width, no max-w-3xl constraint */}
      <section id="features" className="mt-10">
        <Features />
      </section>

      {/* USE CASES */}
      <section id="use-cases" className="mt-10 container mx-auto px-6">
        <UseCases />
      </section>

      {/* PRICING */}
      <section id="pricing" className="mt-10 container mx-auto px-6">
        <Pricing />
      </section>

      {/* FAQ */}
      <section id="faq" className="mt-10 container mx-auto px-6">
        <Questions />
      </section>

      {/* FOOTER */}
      <section id="footer">
        <footer className="bg-gray-950 text-gray-400 pt-20 pb-10">
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">
                Smart<span className="text-emerald-500">VA</span>
              </h2>
              <p className="text-sm max-w-md">
                A structured productivity workspace built for modern assistants and administrative
                teams. Organize everything in one place.
              </p>
              <div className="flex gap-4 mt-6 text-lg">
                <FaTwitter className="hover:text-white cursor-pointer" />
                <FaLinkedin className="hover:text-white cursor-pointer" />
                <FaInstagram className="hover:text-white cursor-pointer" />
                <FaGithub className="hover:text-white cursor-pointer" />
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#features" className="hover:text-white transition">Features</a></li>
                <li><a href="#use-cases" className="hover:text-white transition">Use Cases</a></li>
                <li><a href="#pricing" className="hover:text-white transition">Pricing</a></li>
                <li><a href="#faq" className="hover:text-white transition">FAQ</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-16 pt-6 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} SmartVA. All rights reserved.
          </div>
        </footer>
      </section>

      {/* Scroll navigation */}
      <div className="fixed bottom-5 right-5 flex flex-col gap-3 z-50">
        <a
          href="#hero"
          className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white p-3 rounded-full shadow-md transition"
        >
          <MdMoveUp size={20} />
        </a>
        <a
          href="#footer"
          className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white p-3 rounded-full shadow-md transition"
        >
          <MdMoveDown size={20} />
        </a>
      </div>

    </div>
  )
}

export default LandingPage