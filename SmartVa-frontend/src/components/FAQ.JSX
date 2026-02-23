import React, { useState } from 'react'
import { FiPlus, FiMinus } from 'react-icons/fi'

const Faq = () => {

 const faqs = [
  {
    question: "Is SmartVA really 100% free?",
    answer: "Yes. SmartVA is completely free with no hidden charges, no trials, and no feature restrictions."
  },
  {
    question: "Do I need a credit card to sign up?",
    answer: "No credit card is required. Simply sign up with your email and start using SmartVA immediately."
  },
  {
    question: "Are there any feature limitations?",
    answer: "No. All SmartVA features are available to every user without restrictions."
  },
  {
    question: "Can I delegate tasks to other people?",
    answer: "Yes. You can assign tasks to delegates, track their progress, and receive real-time updates."
  },
  {
    question: "Can delegates update task progress?",
    answer: "Yes. Delegates can log in and update the status of assigned tasks in real-time."
  },
  {
    question: "Does SmartVA send automatic reminders?",
    answer: "Yes. You receive automatic reminders for tasks and events so you never miss important deadlines."
  },
  {
    question: "Does SmartVA support real-time notifications?",
    answer: "Yes. You get instant notifications for task updates, event changes, and document responses."
  },
  {
    question: "What is the Task Details mini dashboard?",
    answer: "It shows all tasks assigned to you, their deadlines, progress status, and reminders in one focused view."
  },
  {
    question: "Can I schedule events inside SmartVA?",
    answer: "Yes. You can schedule meetings and automatically notify concerned members."
  },
  {
    question: "Will participants be reminded before meetings?",
    answer: "Yes. SmartVA automatically sends reminders when the meeting time is approaching."
  },
  {
    question: "Can I keep contact logs?",
    answer: "Yes. SmartVA allows you to store and manage contacts in an organized way."
  },
  {
    question: "Is there a centralized dashboard?",
    answer: "Yes. SmartVA provides a productivity dashboard with real-time overview of tasks, events, documents, and activity."
  },
  {
    question: "Can I create and export notes?",
    answer: "Yes. You can create rich notes and export them into clean, professional PDFs."
  },
  {
    question: "Does SmartVA support document tracking?",
    answer: "Yes. You can register documents, categorize them, and track their response status."
  },
  {
    question: "Can I track document responses?",
    answer: "Yes. SmartVA allows you to log responses and follow-ups for each document."
  },
  {
    question: "Is visitor management included?",
    answer: "Yes. You can log visitor details, purpose, and visit history."
  },
  {
    question: "Can small teams use SmartVA?",
    answer: "Absolutely. SmartVA works for individuals and small teams managing shared tasks."
  },
  {
    question: "Is SmartVA good for virtual assistants?",
    answer: "Yes. SmartVA was designed to help virtual assistants manage clients, tasks, and schedules efficiently."
  },
  {
    question: "Does SmartVA work for entrepreneurs?",
    answer: "Yes. Entrepreneurs can manage projects, ideas, meetings, and follow-ups in one place."
  },
  {
    question: "Is SmartVA mobile responsive?",
    answer: "Yes. SmartVA works smoothly across desktop, tablet, and mobile devices."
  },
  {
    question: "Does SmartVA have dark mode?",
    answer: "Yes. SmartVA includes a clean and beautiful dark mode interface."
  },
  {
    question: "How secure is my data?",
    answer: "SmartVA uses secure authentication and structured storage to keep your information safe."
  },
  {
    question: "How long does it take to set up?",
    answer: "You can sign up and start organizing in under 30 seconds."
  },
  {
    question: "Can I manage multiple projects?",
    answer: "Yes. You can create and manage multiple tasks and projects simultaneously."
  },
  {
    question: "Will I receive notifications for delegated tasks?",
    answer: "Yes. You’ll be notified when delegates update or complete assigned tasks."
  },
  {
    question: "Does SmartVA reduce app switching?",
    answer: "Yes. SmartVA centralizes tasks, notes, documents, contacts, and events into one dashboard."
  },
  {
    question: "Is there a limit on tasks I can create?",
    answer: "No. You can create as many tasks as you need."
  },
  {
    question: "Can I organize my day clearly?",
    answer: "Yes. The dashboard and event system help structure your day without clutter."
  },
  {
    question: "Can I access SmartVA from anywhere?",
    answer: "Yes. As long as you have internet access, you can log in from anywhere."
  },
  {
    question: "Will SmartVA remain free in the future?",
    answer: "SmartVA is built with the mission to stay accessible and free for productivity-focused users."
  }
]

  const [openIndexes, setOpenIndexes] = useState([])

  const toggleFAQ = (index) => {
    if (openIndexes.includes(index)) {
      setOpenIndexes(openIndexes.filter(i => i !== index))
    } else {
      setOpenIndexes([...openIndexes, index])
    }
  }

  return (
    <div className="container mx-auto px-6 py-20">

      {/* Header */}
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-[#008235]">
          Frequently Asked Questions
        </h2>
        <p className="mt-4 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Everything you need to know about SmartVA.
        </p>
      </div>

      {/* FAQ List */}
      <div className="max-w-3xl mx-auto space-y-4">

        {faqs.map((faq, index) => {
          const isOpen = openIndexes.includes(index)

          return (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition hover:shadow-[0_0_20px_#008235]/20"
            >

              {/* Question */}
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center text-left"
              >
                <span className="font-semibold text-lg text-gray-800 dark:text-white">
                  {faq.question}
                </span>

                <span className="text-[#008235] text-2xl">
                  {isOpen ? <FiMinus /> : <FiPlus />}
                </span>
              </button>

              {/* Answer */}
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  isOpen ? 'max-h-40 mt-4' : 'max-h-0'
                }`}
              >
                <p className="text-gray-600 dark:text-gray-300">
                  {faq.answer}
                </p>
              </div>

            </div>
          )
        })}

      </div>

    </div>
  )
}

export default Faq