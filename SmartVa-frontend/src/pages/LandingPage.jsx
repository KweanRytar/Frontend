import React from 'react'

import LandingPageNavBar from '../components/LandingPageNavBar'
import Features from '../components/Features'
import overviewPlaceHolder from '../assets/rgisterBestOption.jpg'
import { FaCircle } from 'react-icons/fa'

const LandingPage = ({isDark, toggleDarkMode}) => {
  const pinkBulletedPoints = [
    'Switching between Todoist, Notion, Google Calendar, Email contacts...',
    'Trying to keep track of everything in your head',
    'Feeling overwhelmed by the number of apps you use', 'missing important deadlines or forgetting tasks because they are scattered across different platforms','scattered documents, visitor logs and meeting notes in random folders'
  ]

  const lightGreenBulletedPoints = [
    'Everything centralized in one responsive dashboard-tasks, notes, docs, visiotrs, events, contacts and notifications', 'Real-time sync and a focused notification center that surfaces only what matters', 'Rich text notes, document organizer and visitor tracker in one place', 'Clean Calendar & events view to keep your day structured without clutter'
  ]
  return (
    <div className="min-h-screen bg-[#f5faf7] dark:bg-gray-900 dark:text-white">
      <LandingPageNavBar isDark={isDark} toggleDarkMode={toggleDarkMode}  />
      {/* hero  section */}
     {/* HERO SECTION */}
<section id="hero" className="py-24">
  <div className="container mx-auto px-6">
    <div className="grid md:grid-cols-2 gap-16 items-center">

      {/* LEFT SIDE */}
      <div>
        {/* Badge */}
        <div className="bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 rounded-full inline-block">
          <small className="text-emerald-600 font-medium">
            Free Forever • No credit card • No trials
          </small>
        </div>

        {/* Headline */}
        <h1 className="text-4xl md:text-5xl font-bold mt-8 leading-tight">
          SmartVa Your All In One Productivity Dashboard
        </h1>

        {/* Description */}
        <p className="text-lg mt-6 text-gray-600 dark:text-gray-300">
          Streamline your tasks, notes, documents, contacts, events,
          visitors and notifications in one intuitive workspace.
          Stay organized and boost efficiency without switching apps.
        </p>

        {/* Mini Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 text-sm text-gray-700 dark:text-gray-300">
          <p>Real time updates</p>
          <p>Beautiful dark mode interface</p>
          <p>100 percent free forever</p>
          <p>Built for individuals and small teams</p>
        </div>

        {/* CTA */}
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
  </div>
</section>

      <section id='#features'>
        <Features  />
      </section>
      
    </div>
  )
}

export default LandingPage