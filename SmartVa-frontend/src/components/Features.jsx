import React, { useState, useEffect, useRef } from 'react'
import { MdChevronLeft, MdChevronRight } from 'react-icons/md'

// picture of features
import taskDark from '../assets/task-dark.png'
import taskLight from '../assets/task-light.png'
import documentDark from '../assets/document-dark.png'
import documentLight from '../assets/document-light.png'
import eventLight from '../assets/event-light.png'
import eventDark from '../assets/event-dark.png'
import noteDark from '../assets/Note-Dark.png'
import noteLight from '../assets/note-light.png'
import documentResponeLight from '../assets/responses-light.png'
import documentResponseDark from '../assets/responses-dark.png'
import visitor from '../assets/visitor-general.png'
import realtimeNotification from '../assets/realtime notification.png'
import smartSpace from '../assets/smartSpace-dark.png'
import noteExport from '../assets/note-export.png'
import taskDetails from '../assets/smartSpace-Details.png'

const Features = () => {
  const ftBasis = [
    {
      title: 'Smart Task Management',
      description: 'Create, prioritize, delegate, and track tasks with deadlines and status updates.',
      imageUrlLight: taskLight,
      imageUrlDark: taskDark,
    },
    {
      title: 'Task Details & Mini Dashboard',
      description: 'View what tasks are assigned to you, track progress, and receive automatic reminders.',
      imageUrlLight: taskDetails,
      imageUrlDark: taskDetails,
    },
    {
      title: 'Intelligent Event Scheduling',
      description: 'Schedule meetings effortlessly, notify members, and send reminders automatically.',
      imageUrlLight: eventLight,
      imageUrlDark: eventDark,
    },
    {
      title: 'Real-Time Notifications',
      description: 'Receive instant updates for tasks, events, documents, and responses.',
      imageUrlLight: realtimeNotification,
      imageUrlDark: realtimeNotification,
    },
    {
      title: 'Professional Notes',
      description: 'Capture ideas, meeting minutes, and records with rich formatting. Export clean, professional PDFs.',
      imageUrlLight: noteLight,
      imageUrlDark: noteDark,
    },
    {
      title: 'Smart Document Registry',
      description: 'Track documents with categories, response status, and structured follow-ups.',
      imageUrlLight: documentLight,
      imageUrlDark: documentDark,
    },
    {
      title: 'Document Responses',
      description: 'Record follow-ups for each document to maintain seamless communication chains.',
      imageUrlLight: documentResponeLight,
      imageUrlDark: documentResponseDark,
    },
    {
      title: 'Visitor Management',
      description: 'Log visitor details, purpose, and visit history for organized office records.',
      imageUrlLight: visitor,
      imageUrlDark: visitor,
    },
    {
      title: 'Productivity Dashboard',
      description: 'Real-time overview of tasks, events, documents, and activity — all in one control center.',
      imageUrlLight: smartSpace,
      imageUrlDark: smartSpace,
    },
    {
      title: 'PDF Export',
      description: 'Export notes and records into professional, presentation-ready PDFs.',
      imageUrlLight: noteExport,
      imageUrlDark: noteExport,
    },
  ]

  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const intervalRef = useRef(null)
  const total = ftBasis.length

  const next = () => setCurrent((prev) => (prev + 2 >= total ? 0 : prev + 2))
  const prev = () => setCurrent((prev) => (prev - 2 < 0 ? total - (total % 2 === 0 ? 2 : 1) : prev - 2))

  useEffect(() => {
    if (!paused) {
      intervalRef.current = setInterval(() => {
        setCurrent((prev) => (prev + 2 >= total ? 0 : prev + 2))
      }, 3500)
    }
    return () => clearInterval(intervalRef.current)
  }, [paused, total])

  // Get 2 cards to show (wrap around if needed)
  const visibleFeatures = [ftBasis[current], ftBasis[(current + 1) % total]]

  const FeatureCard = ({ title, description, imageUrlLight, imageUrlDark }) => (
    <div className="flex flex-col items-center text-center p-8 rounded-2xl border border-emerald-100 dark:border-emerald-900/40 bg-white dark:bg-gray-800 shadow-sm transform transition duration-500 hover:scale-[1.03] hover:shadow-[0_0_24px_rgba(0,130,53,0.18)] w-full">
      <img
        src={imageUrlLight}
        alt={title}
        className="rounded-xl mb-5 w-40 h-40 object-contain dark:hidden"
      />
      <img
        src={imageUrlDark}
        alt={title}
        className="rounded-xl mb-5 w-40 h-40 object-contain hidden dark:block"
      />
      <strong className="text-xl text-[#008235] font-semibold">{title}</strong>
      <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm leading-relaxed">{description}</p>
    </div>
  )

  // Dot indicators — one dot per pair
  const totalPairs = Math.ceil(total / 2)
  const activePair = Math.floor(current / 2)

  return (
    <div className="w-full px-6 py-16">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#008235]">Everything you need in one place</h2>
          <p className="text-lg mt-4 text-gray-600 dark:text-gray-300">
            SmartVA is a centralized productivity hub built for virtual assistants, entrepreneurs,
            and anyone who hates context switching.
          </p>
        </div>

        {/* Slider */}
        <div
          className="relative"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Cards */}
          <div className="grid sm:grid-cols-2 gap-8 transition-all duration-500">
            {visibleFeatures.map((feature, i) => (
              <FeatureCard
                key={`${current}-${i}`}
                title={feature.title}
                description={feature.description}
                imageUrlLight={feature.imageUrlLight}
                imageUrlDark={feature.imageUrlDark}
              />
            ))}
          </div>

          {/* Prev / Next Buttons */}
          <button
            onClick={prev}
            className="absolute -left-5 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md p-2 rounded-full text-[#008235] hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition z-10"
            aria-label="Previous"
          >
            <MdChevronLeft size={28} />
          </button>
          <button
            onClick={next}
            className="absolute -right-5 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md p-2 rounded-full text-[#008235] hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition z-10"
            aria-label="Next"
          >
            <MdChevronRight size={28} />
          </button>
        </div>

        {/* Dot Indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: totalPairs }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i * 2)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                i === activePair
                  ? 'bg-[#008235] w-6'
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Features