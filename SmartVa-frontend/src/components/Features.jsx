import React from 'react'

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
      imageUrlDark: taskDark
    },
    {
      title: 'Task Details & Mini Dashboard',
      description: 'View what tasks are assigned to you, track progress, and receive automatic reminders.',
      imageUrlLight: taskDetails,
      imageUrlDark: taskDetails
    },
    {
      title: 'Intelligent Event Scheduling',
      description: 'Schedule meetings effortlessly, notify members, and send reminders automatically.',
      imageUrlLight: eventLight,
      imageUrlDark: eventDark
    },
    {
      title: 'Real-Time Notifications',
      description: 'Receive instant updates for tasks, events, documents, and responses.',
      imageUrlLight: realtimeNotification,
      imageUrlDark: realtimeNotification
    },
    {
      title: 'Professional Notes',
      description: 'Capture ideas, meeting minutes, and records with rich formatting. Export clean, professional PDFs.',
      imageUrlLight: noteLight,
      imageUrlDark: noteDark
    },
    {
      title: 'Smart Document Registry',
      description: 'Track documents with categories, response status, and structured follow-ups.',
      imageUrlLight: documentLight,
      imageUrlDark: documentDark
    },
    {
      title: 'Document Responses',
      description: 'Record follow-ups for each document to maintain seamless communication chains.',
      imageUrlLight: documentResponeLight,
      imageUrlDark: documentResponseDark
    },
    {
      title: 'Visitor Management',
      description: 'Log visitor details, purpose, and visit history for organized office records.',
      imageUrlLight: visitor,
      imageUrlDark: visitor
    },
    {
      title: 'Productivity Dashboard',
      description: 'Real-time overview of tasks, events, documents, and activity — all in one control center.',
      imageUrlLight: smartSpace,
      imageUrlDark: smartSpace
    },
    {
      title: 'PDF Export',
      description: 'Export notes and records into professional, presentation-ready PDFs.',
      imageUrlLight: noteExport,
      imageUrlDark: noteExport
    }
  ]

  // reuseable commponent to display smartva features 
 // Reusable feature card
  const FeatureCard = ({ title, description, imageUrlLight, imageUrlDark }) => {
    return (
      <div className="flex flex-col items-center text-center p-4 transform transition duration-500 hover:scale-105 hover:shadow-[0_0_20px_#008235]/40">
        {/* Image toggle for dark mode */}
        <img
          src={imageUrlLight}
          alt={title}
          className="rounded-md mb-4 w-36 h-36 object-contain dark:hidden"
        />
        <img
          src={imageUrlDark}
          alt={title}
          className="rounded-md mb-4 w-36 h-36 object-contain hidden dark:block"
        />
        <strong className="text-xl text-[#008235]">{title}</strong>
        <p className="text-gray-600 dark:text-gray-300 mt-2">{description}</p>
      </div>
    )
  }


  return (
     <div className="container mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-[#008235]">Everything you need in one place</h2>
        <p className="text-lg mt-4 text-gray-600 dark:text-gray-300">
          SmartVA is a centralized productivity hub built for virtual assistants, entrepreneurs, and anyone who hates context switching.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {ftBasis.map((feature, index) => (
          <FeatureCard
            key={index}
            title={feature.title}
            description={feature.description}
            imageUrlLight={feature.imageUrlLight}
            imageUrlDark={feature.imageUrlDark}
          />
        ))}
      </div>
    </div>
  )
}

export default Features