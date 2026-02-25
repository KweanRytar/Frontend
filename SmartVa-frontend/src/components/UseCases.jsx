import React, { useState, useEffect, useRef } from 'react'
import { MdChevronLeft, MdChevronRight } from 'react-icons/md'
import avatarPlaceholder from '../assets/Avatar.jpeg'

const UseCases = () => {

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
    { name: 'Anyone Who Hates Context Switching', uses: 'Centralize work to stay productive and calm' },
  ]

  const testimonies = [
    { text: 'Finally one app for everything: tasks, notes, visitors, calendar. My brain feels lighter.', author: 'Alex, Virtual Assistant' },
    { text: 'SmartVA keeps our team organized and synced in real-time. Life-changing!', author: 'Maya, Startup Founder' },
    { text: 'I no longer switch between 10 apps daily. Everything in one place!', author: 'John, Freelancer' },
  ]

  // ── Use Cases Slider (4 cards at a time) ──
  const CARDS_PER_SLIDE = 4
  const [userIndex, setUserIndex] = useState(0)
  const [userPaused, setUserPaused] = useState(false)
  const userTotal = perfectUsers.length
  const userPairs = Math.ceil(userTotal / CARDS_PER_SLIDE)
  const activeUserPair = Math.floor(userIndex / CARDS_PER_SLIDE)

  const nextUsers = () => setUserIndex((prev) => (prev + CARDS_PER_SLIDE >= userTotal ? 0 : prev + CARDS_PER_SLIDE))
  const prevUsers = () => setUserIndex((prev) => (prev - CARDS_PER_SLIDE < 0 ? userTotal - (userTotal % CARDS_PER_SLIDE || CARDS_PER_SLIDE) : prev - CARDS_PER_SLIDE))

  useEffect(() => {
    if (userPaused) return
    const id = setInterval(nextUsers, 3500)
    return () => clearInterval(id)
  }, [userPaused, userIndex])

  const visibleUsers = Array.from({ length: CARDS_PER_SLIDE }, (_, i) => perfectUsers[(userIndex + i) % userTotal])

  // ── Testimonial Slider (1 at a time) ──
  const [testIndex, setTestIndex] = useState(0)
  const [testPaused, setTestPaused] = useState(false)
  const testTotal = testimonies.length

  const nextTest = () => setTestIndex((prev) => (prev + 1) % testTotal)
  const prevTest = () => setTestIndex((prev) => (prev - 1 + testTotal) % testTotal)

  useEffect(() => {
    if (testPaused) return
    const id = setInterval(nextTest, 4000)
    return () => clearInterval(id)
  }, [testPaused, testIndex])

  // ── Cards ──
  const UseCaseCard = ({ name, uses }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 flex flex-col items-center text-center transform transition hover:scale-105 hover:shadow-[0_0_20px_rgba(0,130,53,0.2)] w-full">
      <img src={avatarPlaceholder} alt={name} className="w-14 h-14 mb-3 rounded-full object-cover" />
      <strong className="text-base text-[#008235] mb-2">{name}</strong>
      <p className="text-gray-700 dark:text-gray-300 text-sm">{uses}</p>
    </div>
  )

  const TestimonyCard = ({ text, author }) => (
    <div className="bg-[#18bb85]/10 dark:bg-[#008235]/20 rounded-xl p-8 text-center shadow-sm w-full">
      <p className="text-gray-800 dark:text-gray-100 italic mb-4 text-lg leading-relaxed">"{text}"</p>
      <small className="text-[#008235] font-semibold">{author}</small>
    </div>
  )

  return (
    <div className="w-full px-6 py-16">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#008235]">Perfect for Everyone</h2>
          <p className="text-gray-700 dark:text-gray-300 mt-4 max-w-2xl mx-auto">
            Whether you support one executive or run a small team, SmartVA keeps everything in one calm, organized place.
          </p>
        </div>

        {/* ── Use Cases Slider ── */}
        <div
          className="relative"
          onMouseEnter={() => setUserPaused(true)}
          onMouseLeave={() => setUserPaused(false)}
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 transition-all duration-500">
            {visibleUsers.map((user, i) => (
              <UseCaseCard key={`${userIndex}-${i}`} name={user.name} uses={user.uses} />
            ))}
          </div>

          <button
            onClick={prevUsers}
            className="absolute -left-5 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md p-2 rounded-full text-[#008235] hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition z-10"
            aria-label="Previous"
          >
            <MdChevronLeft size={26} />
          </button>
          <button
            onClick={nextUsers}
            className="absolute -right-5 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md p-2 rounded-full text-[#008235] hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition z-10"
            aria-label="Next"
          >
            <MdChevronRight size={26} />
          </button>
        </div>

        {/* Use Cases Dots */}
        <div className="flex justify-center gap-2 mt-6 mb-16">
          {Array.from({ length: userPairs }).map((_, i) => (
            <button
              key={i}
              onClick={() => setUserIndex(i * CARDS_PER_SLIDE)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                i === activeUserPair ? 'bg-[#008235] w-6' : 'bg-gray-300 dark:bg-gray-600 w-2.5'
              }`}
              aria-label={`Go to group ${i + 1}`}
            />
          ))}
        </div>

        {/* ── Testimonials Slider ── */}
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-[#008235]">Hear from our Users</h3>
        </div>

        <div
          className="relative max-w-2xl mx-auto"
          onMouseEnter={() => setTestPaused(true)}
          onMouseLeave={() => setTestPaused(false)}
        >
          <div className="transition-all duration-500">
            <TestimonyCard text={testimonies[testIndex].text} author={testimonies[testIndex].author} />
          </div>

          <button
            onClick={prevTest}
            className="absolute -left-5 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md p-2 rounded-full text-[#008235] hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition z-10"
            aria-label="Previous testimony"
          >
            <MdChevronLeft size={26} />
          </button>
          <button
            onClick={nextTest}
            className="absolute -right-5 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md p-2 rounded-full text-[#008235] hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition z-10"
            aria-label="Next testimony"
          >
            <MdChevronRight size={26} />
          </button>
        </div>

        {/* Testimonial Dots */}
        <div className="flex justify-center gap-2 mt-6 mb-16">
          {testimonies.map((_, i) => (
            <button
              key={i}
              onClick={() => setTestIndex(i)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                i === testIndex ? 'bg-[#008235] w-6' : 'bg-gray-300 dark:bg-gray-600 w-2.5'
              }`}
              aria-label={`Testimony ${i + 1}`}
            />
          ))}
        </div>

        {/* Stats */}
        <div className="text-center space-y-2">
          <p className="text-gray-700 dark:text-gray-300 font-semibold">Join productive people who hate context switching</p>
          <p className="text-gray-700 dark:text-gray-300">100+ early users</p>
          <p className="text-gray-700 dark:text-gray-300">4.9/5 average satisfaction</p>
          <p className="text-gray-700 dark:text-gray-300">Free forever</p>
        </div>

      </div>
    </div>
  )
}

export default UseCases