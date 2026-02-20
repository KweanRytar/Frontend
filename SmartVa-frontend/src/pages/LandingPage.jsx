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
      <section id='hero' className='py-16'>
        
        <div className='container mx-auto px-4'>
          <div>
            <div className='bg-[#ecfdf5] p-4 rounded-2xl flex gap-y-2'>
 <small className='bg-[#80dcbc] text-[#18bb85] rounded-3xl'>Free Forever <span>No credit Card, No Trials. Just Focus</span></small>
          
        </div>
        <h1 className='text-4xl md:text-5xl font-bold mt-6'>SmartVa-Your Free All-In One productivity dashboard</h1>
        
        <p className='text-lg mt-4 text-gray-600 dark:text-gray-300'>Experience the power of SmartVa, your all-in-one productivity dashboard. Streamline your Tasks, Notes, Documents, Contacts, Events, Visitors and Notifications all in one intuitive platform. Stay organized, boost efficiency, and achieve your goals with ease. Try SmartVa today and transform the way you work!</p>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          <p > Real-Time updates & live notifications</p>
          <p>Beautiful Dark Mode Interface</p>
          <p>100% free forever (no hidden tiers)</p>
          <p>Built for individuals & small team</p>
        </div>

        {/* cta button */}
        <a href='https://www.smartvirtualassistants.site/signup' className='bg-[#18bb85] text-white px-6 py-3 rounded-lg mt-6 hover:bg-[#16a77c] transition-colors duration-300'>Get Started free</a>
        <small className='text-gray-600 dark:text-gray-300 '>Stop switching apps. Set up your workspace in under 30 seconds</small>
          </div>
         
{/* div to contain pictures with shadow so it looks like its floating*/}
<div className="shadow-lg shadow-gray-400 rounded-2xl mt-10">
<image src={overviewPlaceHolder} alt='overview' className='rounded-2xl mt-6' />
</div>

<p>Tired of Juggling 7 different apps every day?</p>
<small className='text-gray-600 '>SmartVa is the all-in-one solution that combines Tasks, Notes, Documents, Contacts, Events, Visitors and Notifications into one seamless dashboard. Say goodbye to app overload and hello to streamlined productivity.</small>


<div className=' flex flex-col md:flex-row justify-between'>
  {/* pink bulleted points */}
<div className="mt-6 flex flex-col gap-y-4">
  {pinkBulletedPoints.map((point, index) => (
    <div key={index} className="flex items-start gap-x-2">
      <FaCircle className="text-[#f4e8e5] mt-1" />
      <p>{point}</p>
    </div>
  ))}
</div>

{/* lightGreen bulleted points */}
<div className="mt-6 flex flex-col gap-y-4">
  {lightGreenBulletedPoints.map((point, index) => (
    <div key={index} className="flex items-start gap-x-2">
      <FaCircle className="text-[#80dcbc] mt-1" />
      <p>{point}</p>
    </div>
  ))}
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