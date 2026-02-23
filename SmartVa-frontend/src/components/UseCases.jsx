import React from 'react'

// Example avatars (can replace with actual images)
import avatarPlaceholder from '../assets/Avatar.jpeg'

const UseCases = () => {

  // 20 perfect user types
  const perfectUsers = [
    { name: 'Virtual Assistant', uses: 'Manage clients, tasks, and notes from a single dashboard' },
    { name: 'Entrepreneurs', uses: 'Keep ideas, projects, and follow-ups in one simple system' },
    { name: 'Small Teams', uses: 'Coordinate tasks, meetings, and documents without chaos' },
    { name: 'Freelancers', uses: 'Track projects and client communications effortlessly' },
    { name: 'Office Managers', uses: 'Monitor tasks, visitors, and documents efficiently' },
    { name: 'Project Coordinators', uses: 'Delegate tasks and follow progress in real-time' },
    { name: 'Event Planners', uses: 'Schedule events and notify participants automatically' },
    { name: 'HR Professionals', uses: 'Keep employee and visitor logs organized' },
    { name: 'Consultants', uses: 'Manage client meetings, notes, and deliverables easily' },
    { name: 'Executives', uses: 'Get an overview of tasks, events, and notifications' },
    { name: 'Marketing Teams', uses: 'Track campaigns, tasks, and internal communications' },
    { name: 'Sales Teams', uses: 'Monitor follow-ups, leads, and client interactions' },
    { name: 'Startup Founders', uses: 'Organize multiple projects without context switching' },
    { name: 'Content Creators', uses: 'Plan, schedule, and track content production' },
    { name: 'Customer Support', uses: 'Track tickets, follow-ups, and internal notes' },
    { name: 'Remote Teams', uses: 'Collaborate seamlessly with central dashboards' },
    { name: 'Administrative Assistants', uses: 'Handle documents, tasks, and reminders efficiently' },
    { name: 'Coaches & Trainers', uses: 'Track sessions, notes, and client progress' },
    { name: 'Finance Teams', uses: 'Organize invoices, tasks, and financial documents' },
    { name: 'Anyone Who Hates Context Switching', uses: 'Centralize work to stay productive and calm' }
  ]

  // Example testimonies
  const testimonies = [
    { text: 'Finally one app for everything: tasks, notes, visitors, calendar. My brain feels lighter.', author: 'Alex, Virtual Assistant' },
    { text: 'SmartVA keeps our team organized and synced in real-time. Life-changing!', author: 'Maya, Startup Founder' },
    { text: 'I no longer switch between 10 apps daily. Everything in one place!', author: 'John, Freelancer' }
  ]

  const UseCaseCard = ({ name, uses }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 flex flex-col items-center text-center transform transition hover:scale-105 hover:shadow-[0_0_20px_#008235]/30 max-w-xs">
      <img src={avatarPlaceholder} alt={name} className="w-16 h-16 mb-4 rounded-full object-cover" />
      <strong className="text-lg text-[#008235] mb-2">{name}</strong>
      <p className="text-gray-700 dark:text-gray-300 text-sm">{uses}</p>
    </div>
  )

  const TestimonyCard = ({ text, author }) => (
    <div className="bg-[#18bb85]/10 dark:bg-[#008235]/20 rounded-xl p-6 text-center shadow-sm mx-2 transform transition hover:scale-105">
      <p className="text-gray-800 dark:text-gray-100 italic mb-3">"{text}"</p>
      <small className="text-gray-600 dark:text-gray-300 font-semibold">{author}</small>
    </div>
  )

  return (
    <div className="container mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-[#008235]">Perfect for Everyone</h2>
        <p className="text-gray-700 dark:text-gray-300 mt-4 max-w-2xl mx-auto">
          Whether you support one executive or run a small team, SmartVA keeps everything in one calm, organized place.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 justify-items-center">
        {perfectUsers.map((user, idx) => (
          <UseCaseCard key={idx} name={user.name} uses={user.uses} />
        ))}
      </div>

      <div className="text-center mb-12">
        <h3 className="text-2xl font-bold text-[#008235] mb-6">Hear from our Users</h3>
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 px-4 py-6">
          {testimonies.map((t, idx) => (
            <div key={idx} className="snap-start flex-shrink-0 w-80">
              <TestimonyCard text={t.text} author={t.author} />
            </div>
          ))}
        </div>
      </div>

      <div className="text-center space-y-2">
        <p className="text-gray-700 dark:text-gray-300 font-semibold">Join productive people who hate context switching</p>
        <p className="text-gray-700 dark:text-gray-300">100+ early users</p>
        <p className="text-gray-700 dark:text-gray-300">4.9/5 average satisfaction</p>
        <p className="text-gray-700 dark:text-gray-300">Free forever</p>
      </div>
    </div>
  )
}


export default UseCases