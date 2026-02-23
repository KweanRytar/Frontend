import React from 'react'
import { FaCircle } from 'react-icons/fa'

const Pricing = () => {

  const features = [
    'Unlimited tasks & delegation',
    'Task details mini dashboard',
    'Automatic reminders',
    'Event scheduling & notifications',
    'Real-time notifications center',
    'Notes with PDF export',
    'Smart document registry',
    'Visitor management',
    'Central productivity dashboard'
  ]

  return (
    <div className="container mx-auto px-6 py-20">

      {/* Header */}
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-[#008235]">
          Completely Free — No Credit Card Needed
        </h2>
        <p className="mt-4 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          All features. No time limits. No paywalls. SmartVA stays free so you can stay focused.
        </p>
      </div>

      {/* Pricing Card */}
      <div className="flex justify-center mb-20">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-10 max-w-md w-full text-center transform transition hover:scale-105 hover:shadow-[0_0_25px_#008235]/30">

          <strong className="text-5xl text-[#008235]">$0</strong>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            100% Free Plan — All Features Included
          </p>

          {/* Feature List */}
          <div className="mt-8 space-y-3 text-left">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3">
                <FaCircle className="text-[#18bb85] mt-1 text-xs" />
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  {feature}
                </p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <a
            href="https://www.smartvirtualassistants.site/signup"
            className="mt-8 inline-block bg-[#18bb85] hover:bg-[#16a77c] text-white px-8 py-3 rounded-xl font-medium transition"
          >
            Sign Up Free Now
          </a>

          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Start in 30 seconds
          </p>

          <small className="block mt-2 text-gray-500 dark:text-gray-400">
            Sign up, set up, and start organizing your life — SmartVA handles the rest.
          </small>

        </div>
      </div>

      {/* 3 Step Getting Started */}
      <div className="text-center mb-12">
        <h3 className="text-2xl font-bold text-[#008235] mb-10">
          Get Started in 3 Simple Steps
        </h3>

        <div className="grid md:grid-cols-3 gap-10">

          {/* Step 1 */}
          <div className="p-6">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[#008235]/10 flex items-center justify-center text-[#008235] font-bold">
              1
            </div>
            <p className="font-semibold">Sign up with your email</p>
            <small className="text-gray-600 dark:text-gray-300 block mt-2">
              Create your free SmartVA account with just your email and password.
              No credit card required.
            </small>
          </div>

          {/* Step 2 */}
          <div className="p-6">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[#008235]/10 flex items-center justify-center text-[#008235] font-bold">
              2
            </div>
            <p className="font-semibold">Verify your email</p>
            <small className="text-gray-600 dark:text-gray-300 block mt-2">
              Confirm your email address and access your personalized dashboard instantly.
            </small>
          </div>

          {/* Step 3 */}
          <div className="p-6">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[#008235]/10 flex items-center justify-center text-[#008235] font-bold">
              3
            </div>
            <p className="font-semibold">Start organizing</p>
            <small className="text-gray-600 dark:text-gray-300 block mt-2">
              Add tasks, schedule events, manage notes, and stay on top of everything from one calm workspace.
            </small>
          </div>

        </div>
      </div>

      {/* Final CTA */}
      <div className="text-center">
        <a
          href="https://www.smartvirtualassistants.site/signup"
          className="inline-block bg-[#008235] hover:bg-[#006d2d] text-white px-10 py-4 rounded-xl font-semibold transition shadow-md hover:shadow-[0_0_25px_#008235]/40"
        >
          Create Your Free Account
        </a>
      </div>

    </div>
  )
}

export default Pricing